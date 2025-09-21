-- Security Functions for ThrottleBoard
-- These functions provide secure server-side validation and admin checks

-- Function to securely check admin status
CREATE OR REPLACE FUNCTION public.check_admin_status(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user exists and is admin
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = user_uuid 
    AND is_admin = true
  );
END;
$$;

-- Function to securely create flight request with validation
CREATE OR REPLACE FUNCTION public.create_flight_request_safe(
  p_requester_handle text,
  p_origin_icao text,
  p_origin_city text,
  p_destination_icao text,
  p_destination_city text,
  p_platform text DEFAULT NULL,
  p_airline text DEFAULT NULL,
  p_aircraft text DEFAULT NULL,
  p_notes_public text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  flight_id uuid;
BEGIN
  -- Validate required fields
  IF p_requester_handle IS NULL OR LENGTH(TRIM(p_requester_handle)) = 0 THEN
    RAISE EXCEPTION 'Requester handle is required';
  END IF;
  
  IF p_origin_icao IS NULL OR NOT p_origin_icao ~ '^[A-Z]{4}$' THEN
    RAISE EXCEPTION 'Valid origin ICAO code is required';
  END IF;
  
  IF p_destination_icao IS NULL OR NOT p_destination_icao ~ '^[A-Z]{4}$' THEN
    RAISE EXCEPTION 'Valid destination ICAO code is required';
  END IF;
  
  -- Sanitize input
  p_requester_handle := TRIM(p_requester_handle);
  p_origin_city := TRIM(p_origin_city);
  p_destination_city := TRIM(p_destination_city);
  
  -- Limit text field lengths
  IF LENGTH(p_requester_handle) > 50 THEN
    RAISE EXCEPTION 'Requester handle too long';
  END IF;
  
  IF LENGTH(p_origin_city) > 100 THEN
    RAISE EXCEPTION 'Origin city name too long';
  END IF;
  
  IF LENGTH(p_destination_city) > 100 THEN
    RAISE EXCEPTION 'Destination city name too long';
  END IF;
  
  -- Insert flight request
  INSERT INTO public.flight_requests (
    requester_handle,
    platform,
    origin_icao,
    origin_city,
    destination_icao,
    destination_city,
    airline,
    aircraft,
    sim,
    notes_public,
    priority,
    visibility,
    status,
    user_id
  ) VALUES (
    p_requester_handle,
    p_platform,
    UPPER(p_origin_icao),
    p_origin_city,
    UPPER(p_destination_icao),
    p_destination_city,
    p_airline,
    p_aircraft,
    'MSFS 2024',
    p_notes_public,
    1,
    'public',
    'requested',
    auth.uid()
  ) RETURNING id INTO flight_id;
  
  RETURN flight_id;
END;
$$;

-- Function to safely update flight status (admin only)
CREATE OR REPLACE FUNCTION public.update_flight_status_safe(
  p_flight_id uuid,
  p_status text,
  p_comment text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_status text;
  admin_user_id uuid;
BEGIN
  -- Check if current user is admin
  admin_user_id := auth.uid();
  
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = admin_user_id AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;
  
  -- Validate status
  IF p_status NOT IN ('requested', 'queued', 'planning', 'underway', 'edited', 'published', 'archived', 'declined') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;
  
  -- Get current status
  SELECT status INTO current_status 
  FROM public.flight_requests 
  WHERE id = p_flight_id;
  
  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Flight request not found';
  END IF;
  
  -- Update status
  UPDATE public.flight_requests 
  SET status = p_status, updated_at = now()
  WHERE id = p_flight_id;
  
  -- Create status event
  INSERT INTO public.status_events (
    flight_request_id,
    from_status,
    to_status,
    comment,
    changed_by
  ) VALUES (
    p_flight_id,
    current_status,
    p_status,
    p_comment,
    admin_user_id
  );
  
  RETURN true;
END;
$$;

-- Function to get user's own flight requests
CREATE OR REPLACE FUNCTION public.get_user_flights(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  submitted_at timestamptz,
  status text,
  requester_handle text,
  platform text,
  origin_icao text,
  origin_city text,
  destination_icao text,
  destination_city text,
  airline text,
  aircraft text,
  sim text,
  notes_public text,
  priority integer,
  visibility text,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user can only access their own flights
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT 
    fr.id,
    fr.submitted_at,
    fr.status,
    fr.requester_handle,
    fr.platform,
    fr.origin_icao,
    fr.origin_city,
    fr.destination_icao,
    fr.destination_city,
    fr.airline,
    fr.aircraft,
    fr.sim,
    fr.notes_public,
    fr.priority,
    fr.visibility,
    fr.published_at,
    fr.created_at,
    fr.updated_at
  FROM public.flight_requests fr
  WHERE fr.user_id = p_user_id
  ORDER BY fr.submitted_at DESC;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.check_admin_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_flight_request_safe(text, text, text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_flights(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_flight_status_safe(uuid, text, text) TO authenticated;
