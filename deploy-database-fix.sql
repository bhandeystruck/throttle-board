-- Deploy User Dashboard Fix - Database Functions Update
-- This script updates the create_flight_request_safe function to automatically set user_id

-- Drop the existing function first to avoid conflicts
DROP FUNCTION IF EXISTS public.create_flight_request_safe(text, text, text, text, text, text, text, text, text, uuid);

-- Create the updated function with correct signature
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
  
  -- Insert flight request with automatic user_id from auth.uid()
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

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_flight_request_safe(text, text, text, text, text, text, text, text, text) TO authenticated;

-- Verify the function was created successfully
SELECT 'create_flight_request_safe function updated successfully' as status;
