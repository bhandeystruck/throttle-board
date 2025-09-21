-- Migration: Add user_id column to flight_requests table
-- This migration adds the missing user_id column that the application expects

-- Add the user_id column to flight_requests table
ALTER TABLE public.flight_requests 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add RLS policies for user_id
CREATE POLICY "Users can view their own flight requests" 
ON public.flight_requests FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own flight requests" 
ON public.flight_requests FOR UPDATE 
USING (user_id = auth.uid());

-- Optional: Copy created_by values to user_id for existing records
-- Uncomment the following line if you want to populate user_id with existing created_by values
-- UPDATE public.flight_requests SET user_id = created_by WHERE created_by IS NOT NULL;
