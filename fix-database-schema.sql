-- Fix for the 'user_id' column issue in flight_requests table
-- Run these commands in your Supabase SQL Editor

-- First, check if the user_id column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'flight_requests' AND column_name = 'user_id';

-- If the column doesn't exist, add it
ALTER TABLE flight_requests 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_flight_requests_user_id ON flight_requests(user_id);

-- Update the RLS policies to handle the user_id column
DROP POLICY IF EXISTS "Users can view own flight requests" ON flight_requests;
DROP POLICY IF EXISTS "Users can insert own flight requests" ON flight_requests;
DROP POLICY IF EXISTS "Users can update own flight requests" ON flight_requests;

-- Recreate the policies
CREATE POLICY "Users can view own flight requests" ON flight_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flight requests" ON flight_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own flight requests" ON flight_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow anonymous users to insert flight requests (without user_id)
CREATE POLICY "Anonymous users can insert flight requests" ON flight_requests
  FOR INSERT WITH CHECK (user_id IS NULL);

-- Refresh the schema cache (this might help with the cache issue)
NOTIFY pgrst, 'reload schema';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'flight_requests' 
ORDER BY ordinal_position;
