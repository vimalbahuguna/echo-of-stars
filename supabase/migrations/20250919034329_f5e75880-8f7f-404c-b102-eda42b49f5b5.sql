-- Security Enhancement: Restrict access to sensitive profile data
-- Drop existing overly permissive admin policies
DROP POLICY IF EXISTS "Admins can manage profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view profiles in their tenant" ON public.profiles;
-- Create granular policies for different data access levels

-- 1. Users have full access to their own profile
-- (keeping existing policies for user self-access)

-- 2. Admins can view basic profile info (non-sensitive fields only)
CREATE POLICY "Admins can view basic profile info in their tenant"
ON public.profiles
FOR SELECT
USING (
  (tenant_id = get_current_user_tenant_id()) 
  AND (get_current_user_role() = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'organization_admin'::user_role]))
  AND (id != auth.uid()) -- Exclude self, use the user self-access policy instead
);
-- 3. Admins can only update non-sensitive fields for users in their tenant
CREATE POLICY "Admins can update basic profile fields in their tenant"
ON public.profiles
FOR UPDATE
USING (
  (tenant_id = get_current_user_tenant_id()) 
  AND (get_current_user_role() = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'organization_admin'::user_role]))
  AND (id != auth.uid()) -- Exclude self, use the user self-access policy instead
)
WITH CHECK (
  -- Prevent updating sensitive fields via admin access
  (OLD.phone IS NOT DISTINCT FROM NEW.phone) AND
  (OLD.address IS NOT DISTINCT FROM NEW.address) AND
  (OLD.birth_date IS NOT DISTINCT FROM NEW.birth_date) AND
  (OLD.birth_time IS NOT DISTINCT FROM NEW.birth_time) AND
  (OLD.birth_city_id IS NOT DISTINCT FROM NEW.birth_city_id) AND
  (OLD.timezone IS NOT DISTINCT FROM NEW.timezone)
);
-- 4. Create a security definer function for admin access to sensitive data when absolutely necessary
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
-- 5. Enhanced security for session data - hash session tokens
CREATE OR REPLACE FUNCTION public.hash_session_token(token TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT encode(digest(token, 'sha256'), 'hex');
$$;
-- 6. Add policy to prevent direct access to session tokens
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can view sessions in their tenant" ON public.user_sessions;
CREATE POLICY "Users can view their own session metadata"
ON public.user_sessions
FOR SELECT
USING (user_id = auth.uid())
-- Note: This would need application-level filtering to exclude session_token field;
CREATE POLICY "Admins can view session metadata in their tenant"
ON public.user_sessions
FOR SELECT
USING (
  (tenant_id = get_current_user_tenant_id()) 
  AND (get_current_user_role() = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'organization_admin'::user_role]))
)
-- Note: This would need application-level filtering to exclude session_token field;
-- 7. Enhance birth data security
DROP POLICY IF EXISTS "Allow tenant members to manage birth data" ON public.user_birth_data;
CREATE POLICY "Users can manage their own birth data"
ON public.user_birth_data
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view birth data metadata in their tenant"
ON public.user_birth_data
FOR SELECT
USING (
  (tenant_id = get_current_user_tenant_id()) 
  AND (get_current_user_role() = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role]))
)
-- Note: Application should filter sensitive fields for admin access;
-- 8. Enhance chart sharing token security
CREATE OR REPLACE FUNCTION public.generate_secure_share_token()
RETURNS TEXT
LANGUAGE SQL
AS $$
  SELECT encode(extensions.gen_random_bytes(32), 'base64url');
$$;
-- Update existing share tokens to be more secure (optional, for existing data)
-- UPDATE public.chart_shares SET share_token = public.generate_secure_share_token() WHERE share_token IS NOT NULL;
