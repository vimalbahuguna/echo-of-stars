-- Fix the incomplete RLS policy for pranayama_sessions table
-- Drop the existing incomplete policy and recreate it properly

DROP POLICY IF EXISTS "Allow authenticated users to insert their own pranayama sessions" ON public.pranayama_sessions;

CREATE POLICY "Allow authenticated users to insert their own pranayama sessions" ON public.pranayama_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id AND (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) = tenant_id);