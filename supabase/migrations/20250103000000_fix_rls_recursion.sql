-- Fix infinite recursion in RLS policies
-- This migration creates a helper function and updates all policies to use it

-- ============================================
-- HELPER FUNCTION
-- ============================================

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Agents and admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Agents and admins can view all requests" ON public.requests;
DROP POLICY IF EXISTS "Only agents and admins can update requests" ON public.requests;
DROP POLICY IF EXISTS "Agents and admins can view all request events" ON public.request_events;
DROP POLICY IF EXISTS "Only agents and admins can insert request events" ON public.request_events;

-- Create helper function to get user role (bypasses RLS to avoid recursion)
-- Note: We create it in public schema because we can't create functions in auth schema in production
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- RECREATE POLICIES WITH FIXED VERSION
-- ============================================

-- Agents and admins can view all profiles
CREATE POLICY "Agents and admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.user_role() IN ('agent', 'admin'));

-- Agents and admins can view all requests
CREATE POLICY "Agents and admins can view all requests"
  ON public.requests
  FOR SELECT
  USING (public.user_role() IN ('agent', 'admin'));

-- Only agents and admins can update requests
CREATE POLICY "Only agents and admins can update requests"
  ON public.requests
  FOR UPDATE
  USING (public.user_role() IN ('agent', 'admin'));

-- Agents and admins can view all request events
CREATE POLICY "Agents and admins can view all request events"
  ON public.request_events
  FOR SELECT
  USING (public.user_role() IN ('agent', 'admin'));

-- Only agents and admins can insert request events
CREATE POLICY "Only agents and admins can insert request events"
  ON public.request_events
  FOR INSERT
  WITH CHECK (public.user_role() IN ('agent', 'admin'));

