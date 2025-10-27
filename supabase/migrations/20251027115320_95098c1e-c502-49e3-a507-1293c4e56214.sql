-- Regenerate types for academy tables
-- This migration ensures all academy-related tables are properly reflected in the types file

-- Verify academy_memberships table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'academy_memberships') THEN
    RAISE EXCEPTION 'academy_memberships table does not exist';
  END IF;
END $$;

-- Add index for better query performance on academy memberships
CREATE INDEX IF NOT EXISTS idx_academy_memberships_user_tenant 
ON academy_memberships(user_id, tenant_id);

CREATE INDEX IF NOT EXISTS idx_academy_memberships_tenant_role 
ON academy_memberships(tenant_id, role);

-- Ensure types are regenerated
COMMENT ON TABLE academy_memberships IS 'Academy membership records with roles and tenant associations';