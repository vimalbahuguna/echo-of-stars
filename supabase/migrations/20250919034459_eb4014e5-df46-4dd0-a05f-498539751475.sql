-- Enable pgcrypto extension for secure hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Fix security linter issues from previous migration

-- 1. Fix the security definer view issue by converting to a function instead
DROP VIEW IF EXISTS public.admin_profile_view;
CREATE OR REPLACE FUNCTION public.get_admin_profile_view()
RETURNS TABLE(
  id UUID,
  tenant_id UUID,
  organization_id UUID,
  role user_role,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  is_active BOOLEAN,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  phone_masked TEXT,
  address_masked TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.tenant_id,
    p.organization_id,
    p.role,
    p.first_name,
    p.last_name,
    p.email,
    p.is_active,
    p.last_login_at,
    p.created_at,
    p.updated_at,
    -- Mask sensitive data
    CASE 
      WHEN get_current_user_role() = 'super_admin'::user_role THEN p.phone
      ELSE '***-***-' || RIGHT(COALESCE(p.phone, ''), 4)
    END AS phone_masked,
    CASE 
      WHEN get_current_user_role() = 'super_admin'::user_role THEN p.address
      ELSE LEFT(COALESCE(p.address, ''), 20) || '...'
    END AS address_masked
  FROM public.profiles p
  WHERE p.tenant_id = get_current_user_tenant_id()
    AND (
      get_current_user_role() = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'organization_admin'::user_role])
      OR p.id = auth.uid()
    );
$$;
-- 2. Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.get_profile_sensitive_data(profile_id UUID)
RETURNS TABLE(
  phone TEXT,
  address TEXT,
  birth_date DATE,
  birth_time TIME,
  timezone TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.phone,
    p.address,
    p.birth_date,
    p.birth_time,
    p.timezone
  FROM public.profiles p
  WHERE p.id = profile_id
    AND (
      -- Only allow if requester is super admin or the profile owner
      get_current_user_role() = 'super_admin'::user_role
      OR auth.uid() = profile_id
    );
$$;
CREATE OR REPLACE FUNCTION public.hash_session_token(token TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
SET search_path = public
AS $$
  SELECT encode(digest(token, 'sha256'), 'hex');
$$;
CREATE OR REPLACE FUNCTION public.generate_secure_share_token()
RETURNS TEXT
LANGUAGE SQL
SET search_path = public
AS $$
  SELECT encode(gen_random_bytes(32), 'base64url');
$$;
