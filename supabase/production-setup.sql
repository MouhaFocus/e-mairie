-- ============================================
-- MAIRIE E-ACTES - SETUP PRODUCTION COMPLET
-- ============================================
-- Ce script combine le schéma initial + les corrections RLS
-- À exécuter dans Supabase SQL Editor (production)
-- 
-- Instructions:
-- 1. Copiez tout ce fichier
-- 2. Allez dans Supabase Dashboard → SQL Editor
-- 3. Collez le script complet
-- 4. Cliquez sur "Run"
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
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
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION (Pour éviter la récursion RLS)
-- ============================================
-- Note: Créée dans public car on ne peut pas créer de fonctions dans auth en production
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Agents and admins can view all profiles
DROP POLICY IF EXISTS "Agents and admins can view all profiles" ON public.profiles;
CREATE POLICY "Agents and admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.user_role() IN ('agent', 'admin'));

-- New users can insert their profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- REQUESTS POLICIES
-- ============================================

-- Citizens can view their own requests
DROP POLICY IF EXISTS "Citizens can view own requests" ON public.requests;
CREATE POLICY "Citizens can view own requests"
  ON public.requests
  FOR SELECT
  USING (citizen_id = auth.uid());

-- Agents and admins can view all requests
DROP POLICY IF EXISTS "Agents and admins can view all requests" ON public.requests;
CREATE POLICY "Agents and admins can view all requests"
  ON public.requests
  FOR SELECT
  USING (public.user_role() IN ('agent', 'admin'));

-- Citizens can insert their own requests
DROP POLICY IF EXISTS "Citizens can insert own requests" ON public.requests;
CREATE POLICY "Citizens can insert own requests"
  ON public.requests
  FOR INSERT
  WITH CHECK (citizen_id = auth.uid());

-- Only agents and admins can update requests
DROP POLICY IF EXISTS "Only agents and admins can update requests" ON public.requests;
CREATE POLICY "Only agents and admins can update requests"
  ON public.requests
  FOR UPDATE
  USING (public.user_role() IN ('agent', 'admin'));

-- ============================================
-- REQUEST EVENTS POLICIES
-- ============================================

-- Citizens can view events for their own requests
DROP POLICY IF EXISTS "Citizens can view own request events" ON public.request_events;
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
DROP POLICY IF EXISTS "Agents and admins can view all request events" ON public.request_events;
CREATE POLICY "Agents and admins can view all request events"
  ON public.request_events
  FOR SELECT
  USING (public.user_role() IN ('agent', 'admin'));

-- Only agents and admins can insert request events
DROP POLICY IF EXISTS "Only agents and admins can insert request events" ON public.request_events;
CREATE POLICY "Only agents and admins can insert request events"
  ON public.request_events
  FOR INSERT
  WITH CHECK (public.user_role() IN ('agent', 'admin'));

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
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on requests
DROP TRIGGER IF EXISTS update_requests_updated_at ON public.requests;
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
DROP TRIGGER IF EXISTS trigger_create_request_event ON public.requests;
CREATE TRIGGER trigger_create_request_event
  AFTER UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION create_request_event_on_status_change();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Schema créé avec succès !';
  RAISE NOTICE '📋 Prochaines étapes:';
  RAISE NOTICE '   1. Créer un utilisateur admin dans Authentication';
  RAISE NOTICE '   2. Exécuter: UPDATE public.profiles SET role = ''admin'' WHERE id = (SELECT id FROM auth.users WHERE email = ''votre-email@admin.fr'');';
  RAISE NOTICE '✅ Fonction public.user_role() créée pour éviter la récursion RLS';
END $$;

