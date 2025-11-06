-- Mairie e-Actes Database Schema
-- This file contains the complete database schema for the civil-status digitalization platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profiles (citizens, agents, admins)
-- Links to Supabase auth.users via id
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  national_id TEXT,
  role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'agent', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- REQUESTS TABLE
-- ============================================
-- Stores all civil-status document requests
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  type_of_act TEXT NOT NULL CHECK (type_of_act IN ('birth', 'marriage', 'death')),
  person_fullname TEXT NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  date_of_birth DATE,
  place_of_birth TEXT,
  number_of_copies INT NOT NULL DEFAULT 1 CHECK (number_of_copies > 0 AND number_of_copies <= 10),
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'ready_for_pickup', 'delivered')),
  attachments JSONB DEFAULT '[]'::jsonb,
  assigned_to UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- REQUEST EVENTS TABLE
-- ============================================
-- Stores the history/timeline of each request
CREATE TABLE IF NOT EXISTS public.request_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests (id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_requests_citizen_id ON public.requests(citizen_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_type ON public.requests(type_of_act);
CREATE INDEX IF NOT EXISTS idx_requests_assigned_to ON public.requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_request_events_request_id ON public.request_events(request_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Agents and admins can view all profiles
CREATE POLICY "Agents and admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- New users can insert their profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- REQUESTS POLICIES
-- ============================================

-- Citizens can view their own requests
CREATE POLICY "Citizens can view own requests"
  ON public.requests
  FOR SELECT
  USING (citizen_id = auth.uid());

-- Agents and admins can view all requests
CREATE POLICY "Agents and admins can view all requests"
  ON public.requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- Citizens can insert their own requests
CREATE POLICY "Citizens can insert own requests"
  ON public.requests
  FOR INSERT
  WITH CHECK (citizen_id = auth.uid());

-- Only agents and admins can update requests
CREATE POLICY "Only agents and admins can update requests"
  ON public.requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- ============================================
-- REQUEST EVENTS POLICIES
-- ============================================

-- Citizens can view events for their own requests
CREATE POLICY "Citizens can view own request events"
  ON public.request_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.requests
      WHERE requests.id = request_events.request_id
      AND requests.citizen_id = auth.uid()
    )
  );

-- Agents and admins can view all request events
CREATE POLICY "Agents and admins can view all request events"
  ON public.request_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- Only agents and admins can insert request events
CREATE POLICY "Only agents and admins can insert request events"
  ON public.request_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on requests
CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create request event when status changes
CREATE OR REPLACE FUNCTION create_request_event_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.request_events (request_id, actor_id, previous_status, new_status)
    VALUES (NEW.id, auth.uid(), OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create event when request status changes
CREATE TRIGGER trigger_create_request_event
  AFTER UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION create_request_event_on_status_change();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Note: Run these commands in Supabase Dashboard Storage settings

-- Create bucket for request attachments
-- INSERT INTO storage.buckets (id, name, public) VALUES ('request-attachments', 'request-attachments', false);

-- Storage policies for request-attachments bucket
-- Citizens can upload attachments to their own folders
-- CREATE POLICY "Citizens can upload own attachments"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'request-attachments' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- Citizens can view their own attachments
-- CREATE POLICY "Citizens can view own attachments"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'request-attachments' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- Agents and admins can view all attachments
-- CREATE POLICY "Agents can view all attachments"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'request-attachments' AND
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid() AND role IN ('agent', 'admin')
--     )
--   );

