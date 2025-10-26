-- Academy Roles and Memberships for Vedic Astrology Academy
-- Defines enum for academy roles and membership table scoped to tenant/org
-- Includes RLS policies for secure, multi-tenant administration

BEGIN;

-- 1) Create enum for academy roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'academy_role'
  ) THEN
    CREATE TYPE public.academy_role AS ENUM ('student', 'faculty', 'admin');
  END IF;
END$$;

-- 2) Create academy_memberships table
CREATE TABLE IF NOT EXISTS public.academy_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  role public.academy_role NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | suspended | withdrawn
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academy_memberships_user_id ON public.academy_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_memberships_tenant_id ON public.academy_memberships(tenant_id);
CREATE INDEX IF NOT EXISTS idx_academy_memberships_org_id ON public.academy_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_academy_memberships_role ON public.academy_memberships(role);

-- 4) Enable RLS
ALTER TABLE public.academy_memberships ENABLE ROW LEVEL SECURITY;

-- 5) RLS Policies
-- Helpers used: get_current_user_tenant_id(), get_current_user_role(), get_current_user_organization_id()

-- Students/Faculty/Admins can view their own membership records
CREATE POLICY "Users can view their own academy memberships" ON public.academy_memberships
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view memberships within their tenant
CREATE POLICY "Admins can view memberships in their tenant" ON public.academy_memberships
  FOR SELECT
  USING (
    tenant_id = public.get_current_user_tenant_id() AND
    public.get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin')
  );

-- Admins can manage memberships within their tenant
CREATE POLICY "Admins can manage memberships in their tenant" ON public.academy_memberships
  FOR ALL
  USING (
    tenant_id = public.get_current_user_tenant_id() AND
    public.get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin')
  )
  WITH CHECK (
    tenant_id = public.get_current_user_tenant_id() AND
    public.get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin')
  );

-- Users should not insert/update/delete memberships for themselves directly
-- (No user-level INSERT/UPDATE/DELETE policies are defined.)

-- 6) Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_on_academy_memberships ON public.academy_memberships;
CREATE TRIGGER set_updated_at_on_academy_memberships
BEFORE UPDATE ON public.academy_memberships
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMIT;