-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- Fix pranayama_sessions UUID generation
ALTER TABLE public.pranayama_sessions ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Remove legacy UUID trigger and function in correct order
DROP TRIGGER IF EXISTS set_pranayama_session_uuid ON public.pranayama_sessions;
DROP FUNCTION IF EXISTS public.generate_uuid_for_pranayama_sessions();

-- Add performance index for pranayama sessions
CREATE INDEX IF NOT EXISTS idx_pranayama_sessions_user_tenant_time 
ON public.pranayama_sessions(user_id, tenant_id, start_time DESC);

-- Create meditation_sessions table
CREATE TABLE IF NOT EXISTS public.meditation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  practice_type TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on meditation_sessions
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meditation_sessions
CREATE POLICY "Allow authenticated users to view their own meditation sessions"
ON public.meditation_sessions
FOR SELECT
USING (
  auth.uid() = user_id 
  AND (SELECT profiles.tenant_id FROM profiles WHERE profiles.id = auth.uid()) = tenant_id
);

CREATE POLICY "Allow authenticated users to insert their own meditation session"
ON public.meditation_sessions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND (SELECT profiles.tenant_id FROM profiles WHERE profiles.id = auth.uid()) = tenant_id
);

CREATE POLICY "Allow authenticated users to update their own meditation session"
ON public.meditation_sessions
FOR UPDATE
USING (
  auth.uid() = user_id 
  AND (SELECT profiles.tenant_id FROM profiles WHERE profiles.id = auth.uid()) = tenant_id
);

CREATE POLICY "Allow authenticated users to delete their own meditation session"
ON public.meditation_sessions
FOR DELETE
USING (
  auth.uid() = user_id 
  AND (SELECT profiles.tenant_id FROM profiles WHERE profiles.id = auth.uid()) = tenant_id
);

-- Create mantra_sessions table
CREATE TABLE IF NOT EXISTS public.mantra_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  mantra_type TEXT NOT NULL DEFAULT 'Om Namah Shivaya',
  target_repetitions INTEGER NOT NULL DEFAULT 108,
  repetitions INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on mantra_sessions
ALTER TABLE public.mantra_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mantra_sessions
CREATE POLICY "Allow authenticated users to view their own mantra sessions"
ON public.mantra_sessions
FOR SELECT
USING (
  auth.uid() = user_id 
  AND (SELECT profiles.tenant_id FROM profiles WHERE profiles.id = auth.uid()) = tenant_id
);

CREATE POLICY "Allow authenticated users to insert their own mantra session"
ON public.mantra_sessions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND (SELECT profiles.tenant_id FROM profiles WHERE profiles.id = auth.uid()) = tenant_id
);

CREATE POLICY "Allow authenticated users to update their own mantra session"
ON public.mantra_sessions
FOR UPDATE
USING (
  auth.uid() = user_id 
  AND (SELECT profiles.tenant_id FROM profiles WHERE profiles.id = auth.uid()) = tenant_id
);

CREATE POLICY "Allow authenticated users to delete their own mantra session"
ON public.mantra_sessions
FOR DELETE
USING (
  auth.uid() = user_id 
  AND (SELECT profiles.tenant_id FROM profiles WHERE profiles.id = auth.uid()) = tenant_id
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_tenant_time 
ON public.meditation_sessions(user_id, tenant_id, start_time DESC);

CREATE INDEX IF NOT EXISTS idx_mantra_sessions_user_tenant_time 
ON public.mantra_sessions(user_id, tenant_id, start_time DESC);