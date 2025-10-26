-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- Fix pranayama_sessions UUID generation (the core issue)
ALTER TABLE public.pranayama_sessions ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Remove legacy UUID trigger and function if they exist
DROP TRIGGER IF EXISTS trg_pranayama_sessions_set_uuid ON public.pranayama_sessions;
DROP FUNCTION IF EXISTS public.generate_uuid_for_pranayama_sessions();

-- Add performance index for pranayama sessions
CREATE INDEX IF NOT EXISTS idx_pranayama_sessions_user_tenant_time 
ON public.pranayama_sessions(user_id, tenant_id, start_time DESC);