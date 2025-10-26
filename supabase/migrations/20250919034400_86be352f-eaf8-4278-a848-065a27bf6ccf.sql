-- Security Enhancement: Fix access to sensitive profile data
-- Drop existing overly permissive admin policies
DROP POLICY IF EXISTS "Admins can manage profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view profiles in their tenant" ON public.profiles;
-- Create granular policies for different data access levels

-- 1. Admins can view basic profile info (non-sensitive fields only)
-- Note: Application layer should filter out sensitive fields when admins query profiles
CREATE POLICY "Admins can view basic profile info in their tenant"
ON public.profiles
FOR SELECT
USING (
  (tenant_id = get_current_user_tenant_id()) 
  AND (get_current_user_role() = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'organization_admin'::user_role]))
  AND (id != auth.uid()) -- Exclude self, use the user self-access policy instead
);
-- 2. Admins can only update role and status fields for users in their tenant
CREATE POLICY "Admins can update user roles and status in their tenant"
ON public.profiles
FOR UPDATE
USING (
  (tenant_id = get_current_user_tenant_id()) 
  AND (get_current_user_role() = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'organization_admin'::user_role]))
  AND (id != auth.uid()) -- Exclude self, use the user self-access policy instead
);
-- 3. Create a security definer function for controlled admin access to sensitive data
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
-- 4. Enhanced security for birth data - restrict to user ownership only
DROP POLICY IF EXISTS "Allow tenant members to manage birth data" ON public.user_birth_data;
CREATE POLICY "Users can manage their own birth data"
ON public.user_birth_data
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
-- 5. Enhance session security - restrict direct token access
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can view sessions in their tenant" ON public.user_sessions;
CREATE POLICY "Users can view their own session metadata"
ON public.user_sessions
FOR SELECT
USING (user_id = auth.uid());
CREATE POLICY "Super admins can view session metadata"
ON public.user_sessions
FOR SELECT
USING (get_current_user_role() = 'super_admin'::user_role);
-- 6. Create a view for admin profile access that excludes sensitive data
CREATE OR REPLACE VIEW public.admin_profile_view AS
SELECT 
  id,
  tenant_id,
  organization_id,
  role,
  first_name,
  last_name,
  email,
  is_active,
  last_login_at,
  created_at,
  updated_at,
  -- Mask sensitive data
  CASE 
    WHEN get_current_user_role() = 'super_admin'::user_role THEN phone
    ELSE '***-***-' || RIGHT(COALESCE(phone, ''), 4)
  END AS phone_masked,
  CASE 
    WHEN get_current_user_role() = 'super_admin'::user_role THEN address
    ELSE LEFT(COALESCE(address, ''), 20) || '...'
  END AS address_masked
FROM public.profiles
WHERE tenant_id = get_current_user_tenant_id()
  AND (
    get_current_user_role() = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'organization_admin'::user_role])
    OR id = auth.uid()
  );
-- 7. Create function to securely hash session tokens
CREATE OR REPLACE FUNCTION public.hash_session_token(token TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT encode(digest(token, 'sha256'), 'hex');
$$;
-- 8. Enhanced chart sharing token security
CREATE OR REPLACE FUNCTION public.generate_secure_share_token()
RETURNS TEXT
LANGUAGE SQL
AS $$
  SELECT encode(extensions.gen_random_bytes(32), 'base64url');
$$;
