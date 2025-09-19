-- Flight Requests Database Schema for Throttle Board
-- Run this in your Supabase SQL Editor

-- Create custom types
CREATE TYPE flight_status AS ENUM (
  'requested',
  'queued', 
  'planning',
  'underway',
  'edited',
  'published',
  'archived',
  'declined'
);

CREATE TYPE platform_type AS ENUM (
  'tiktok',
  'instagram', 
  'youtube',
  'other'
);

CREATE TYPE visibility_type AS ENUM (
  'public',
  'unlisted',
  'private'
);

-- Flight Requests Table
CREATE TABLE flight_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status flight_status DEFAULT 'requested',
  requester_handle TEXT NOT NULL,
  platform platform_type,
  origin_icao TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  destination_icao TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  airline TEXT,
  aircraft TEXT,
  sim TEXT DEFAULT 'MSFS 2024',
  notes_public TEXT,
  notes_private TEXT,
  eta TIMESTAMP WITH TIME ZONE,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  visibility visibility_type DEFAULT 'public',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Media Links Table
CREATE TABLE media_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_request_id UUID REFERENCES flight_requests(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status Events Table (for tracking status changes)
CREATE TABLE status_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_request_id UUID REFERENCES flight_requests(id) ON DELETE CASCADE,
  from_status flight_status,
  to_status flight_status NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  comment TEXT,
  changed_by TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_flight_requests_status ON flight_requests(status);
CREATE INDEX idx_flight_requests_submitted_at ON flight_requests(submitted_at);
CREATE INDEX idx_flight_requests_visibility ON flight_requests(visibility);
CREATE INDEX idx_flight_requests_user_id ON flight_requests(user_id);
CREATE INDEX idx_media_links_flight_request_id ON media_links(flight_request_id);
CREATE INDEX idx_status_events_flight_request_id ON status_events(flight_request_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_flight_requests_updated_at 
  BEFORE UPDATE ON flight_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE flight_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_events ENABLE ROW LEVEL SECURITY;

-- Public flight requests are visible to everyone
CREATE POLICY "Public flight requests are viewable by everyone" ON flight_requests
  FOR SELECT USING (visibility = 'public');

-- Users can view their own flight requests
CREATE POLICY "Users can view own flight requests" ON flight_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own flight requests
CREATE POLICY "Users can insert own flight requests" ON flight_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own flight requests
CREATE POLICY "Users can update own flight requests" ON flight_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can do everything (you'll need to implement admin role check)
CREATE POLICY "Admins can do everything" ON flight_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%admin%'
    )
  );

-- Similar policies for media_links
CREATE POLICY "Media links are viewable by everyone" ON media_links
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage media links" ON media_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%admin%'
    )
  );

-- Similar policies for status_events
CREATE POLICY "Status events are viewable by everyone" ON status_events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage status events" ON status_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%admin%'
    )
  );

-- Insert some sample data (optional)
INSERT INTO flight_requests (
  requester_handle, platform, origin_icao, origin_city, 
  destination_icao, destination_city, airline, aircraft, 
  notes_public, priority, status, visibility
) VALUES 
  ('@avi8r_nikos', 'tiktok', 'LGAV', 'Athens', 'LGTS', 'Thessaloniki', 'Aegean Airlines', 'Airbus A320', 'Love to see the beautiful Greek islands approach!', 5, 'published', 'public'),
  ('@flysim_dubai', 'instagram', 'OMDB', 'Dubai', 'OLBA', 'Beirut', 'Emirates', 'Boeing 777-300ER', 'Excited to see the Middle East scenery!', 4, 'underway', 'public'),
  ('@aviation_canada', 'youtube', 'CYVR', 'Vancouver', 'CYVR', 'Vancouver', NULL, 'Boeing 737-800', 'ILS approach to runway 26L please! Weather permitting.', 3, 'planning', 'public'),
  ('@jetblue_fan', 'tiktok', 'KPVD', 'Providence', 'KTPA', 'Tampa', 'JetBlue Airways', 'Airbus A320', 'First time requesting! Love your content!', 2, 'queued', 'public'),
  ('@nz_aviation', NULL, 'NZQN', 'Queenstown', 'NZQN', 'Queenstown', NULL, 'Airbus A320', 'RNAV approach with those stunning mountains!', 1, 'requested', 'public');
