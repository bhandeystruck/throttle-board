-- Create user profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  bio text,
  is_admin boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create flight requests table
CREATE TABLE public.flight_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'queued', 'planning', 'underway', 'edited', 'published', 'archived', 'declined')),
  requester_handle text NOT NULL,
  platform text CHECK (platform IN ('tiktok', 'instagram', 'other')),
  origin_icao text NOT NULL,
  origin_city text NOT NULL,
  destination_icao text NOT NULL,
  destination_city text NOT NULL,
  airline text,
  aircraft text,
  sim text DEFAULT 'MSFS 2024',
  notes_public text,
  notes_private text,
  eta timestamptz,
  priority integer DEFAULT 0,
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create media links table
CREATE TABLE public.media_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_request_id uuid NOT NULL REFERENCES public.flight_requests(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('youtube', 'tiktok', 'instagram')),
  url text NOT NULL,
  title text,
  thumbnail_url text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create status events table for timeline
CREATE TABLE public.status_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_request_id uuid NOT NULL REFERENCES public.flight_requests(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  comment text,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for flight_requests
CREATE POLICY "Public flight requests are viewable by everyone" 
ON public.flight_requests FOR SELECT 
USING (visibility = 'public');

CREATE POLICY "Admins can view all flight requests" 
ON public.flight_requests FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Anyone can insert flight requests" 
ON public.flight_requests FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update flight requests" 
ON public.flight_requests FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can delete flight requests" 
ON public.flight_requests FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Users can view their own flight requests" 
ON public.flight_requests FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own flight requests" 
ON public.flight_requests FOR UPDATE 
USING (user_id = auth.uid());

-- RLS Policies for media_links
CREATE POLICY "Media links are viewable with their flight requests" 
ON public.media_links FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.flight_requests fr 
    WHERE fr.id = flight_request_id AND fr.visibility = 'public'
  )
  OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can manage media links" 
ON public.media_links FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- RLS Policies for status_events
CREATE POLICY "Status events are viewable with their flight requests" 
ON public.status_events FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.flight_requests fr 
    WHERE fr.id = flight_request_id AND fr.visibility = 'public'
  )
  OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can create status events" 
ON public.status_events FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;


-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flight_requests_updated_at
  BEFORE UPDATE ON public.flight_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create status event on status change
CREATE OR REPLACE FUNCTION public.handle_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.status_events (flight_request_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to create status event on flight request update
CREATE TRIGGER on_flight_request_status_change
  AFTER UPDATE ON public.flight_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_status_change();

