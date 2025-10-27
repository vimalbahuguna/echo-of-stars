-- Vedic Academy: Progress RPC, Backfill, and Franchise Subtree RLS
-- 1) Helper to check if a target org is in current user's organization subtree
-- 2) Secure RPC progress_update_week that auto-fills tenant/org from actor context
-- 3) Backfill tenant/org for stu_* tables
-- 4) Extend RLS for franchise_admin org subtree management

BEGIN;

-- 1) Helper: is_in_current_org_subtree(target_org_id)
CREATE OR REPLACE FUNCTION public.is_in_current_org_subtree(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
WITH RECURSIVE org_tree AS (
  SELECT public.get_current_user_organization_id() AS id
  UNION ALL
  SELECT o.id
  FROM public.organizations o
  JOIN org_tree ot ON o.parent_organization_id = ot.id
)
SELECT EXISTS(SELECT 1 FROM org_tree WHERE id = target_org_id);
$$;

-- 2) Secure RPC: progress_update_week
-- Upserts a student's progress for a given week while auto-filling tenant/org.
-- p_student_id is optional; if NULL, resolves via current user's profile->email->stu_students.
CREATE OR REPLACE FUNCTION public.progress_update_week(
  p_student_id BIGINT DEFAULT NULL,
  p_week_id BIGINT,
  p_completion NUMERIC(5,2) DEFAULT NULL,
  p_status public.stu_progress_status_enum DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_started_date DATE DEFAULT NULL,
  p_completed_date DATE DEFAULT NULL
)
RETURNS public.stu_progress
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_role public.user_role;
  v_actor_tenant UUID;
  v_actor_org UUID;
  v_target_student_id BIGINT;
  v_target_tenant UUID;
  v_target_org UUID;
  v_existing public.stu_progress%ROWTYPE;
  v_result public.stu_progress%ROWTYPE;
BEGIN
  v_role := COALESCE(public.get_current_user_role(), 'end_user');
  v_actor_tenant := public.get_current_user_tenant_id();
  v_actor_org := public.get_current_user_organization_id();

  -- Resolve target student_id and existing tenant/org
  IF p_student_id IS NULL THEN
    SELECT s.student_id, s.tenant_id, s.organization_id
      INTO v_target_student_id, v_target_tenant, v_target_org
    FROM public.stu_students s
    JOIN public.profiles p ON p.email = s.email
    WHERE p.id = auth.uid();

    IF v_target_student_id IS NULL THEN
      RAISE EXCEPTION 'No student record linked to current user';
    END IF;
  ELSE
    v_target_student_id := p_student_id;
    SELECT s.tenant_id, s.organization_id
      INTO v_target_tenant, v_target_org
    FROM public.stu_students s
    WHERE s.student_id = v_target_student_id;

    IF v_role = 'end_user' THEN
      -- Only allow updating own progress
      PERFORM 1 FROM public.stu_students s
      JOIN public.profiles p ON p.email = s.email
      WHERE s.student_id = v_target_student_id AND p.id = auth.uid();
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Not permitted to update another student''s progress';
      END IF;
    ELSE
      -- Admin roles: enforce tenant/org constraints
      IF v_target_tenant IS NOT NULL AND v_target_tenant <> v_actor_tenant THEN
        RAISE EXCEPTION 'Cross-tenant update not permitted';
      END IF;

      IF v_role = 'organization_admin' THEN
        IF v_target_org IS NOT NULL AND v_target_org <> v_actor_org THEN
          RAISE EXCEPTION 'Cross-organization update not permitted';
        END IF;
      ELSIF v_role = 'franchise_admin' THEN
        IF v_target_org IS NOT NULL AND NOT public.is_in_current_org_subtree(v_target_org) THEN
          RAISE EXCEPTION 'Organization not in your subtree';
        END IF;
      END IF;
    END IF;
  END IF;

  -- Resolve existing progress row
  SELECT * INTO v_existing
  FROM public.stu_progress
  WHERE student_id = v_target_student_id AND week_id = p_week_id;

  -- Choose tenant/org: prefer student, else actor
  v_target_tenant := COALESCE(v_target_tenant, v_actor_tenant);
  v_target_org := COALESCE(v_target_org, v_actor_org);

  IF v_existing IS NULL THEN
    INSERT INTO public.stu_progress (
      student_id, week_id, completion_percentage, status, started_date, completed_date, notes,
      tenant_id, organization_id
    ) VALUES (
      v_target_student_id, p_week_id, COALESCE(p_completion, 0), COALESCE(p_status, 'In Progress'),
      p_started_date, p_completed_date, p_notes,
      v_target_tenant, v_target_org
    )
    RETURNING * INTO v_result;
  ELSE
    UPDATE public.stu_progress sp
    SET completion_percentage = COALESCE(p_completion, sp.completion_percentage),
        status = COALESCE(p_status, sp.status),
        started_date = COALESCE(p_started_date, sp.started_date),
        completed_date = COALESCE(p_completed_date, sp.completed_date),
        notes = COALESCE(p_notes, sp.notes),
        tenant_id = COALESCE(sp.tenant_id, v_target_tenant),
        organization_id = COALESCE(sp.organization_id, v_target_org)
    WHERE sp.progress_id = v_existing.progress_id
    RETURNING * INTO v_result;
  END IF;

  RETURN v_result;
END;
$$;

-- 3) Backfill tenant/org for legacy rows
-- stu_students from profiles by email
UPDATE public.stu_students s
SET tenant_id = p.tenant_id,
    organization_id = COALESCE(s.organization_id, p.organization_id)
FROM public.profiles p
WHERE s.tenant_id IS NULL
  AND p.email = s.email;

-- stu_enrollments from stu_students
UPDATE public.stu_enrollments e
SET tenant_id = s.tenant_id,
    organization_id = COALESCE(e.organization_id, s.organization_id)
FROM public.stu_students s
WHERE e.tenant_id IS NULL
  AND e.student_id = s.student_id;

-- stu_progress from stu_students
UPDATE public.stu_progress sp
SET tenant_id = s.tenant_id,
    organization_id = COALESCE(sp.organization_id, s.organization_id)
FROM public.stu_students s
WHERE sp.tenant_id IS NULL
  AND sp.student_id = s.student_id;

-- qa_student_feedback from stu_students
UPDATE public.qa_student_feedback q
SET tenant_id = s.tenant_id,
    organization_id = COALESCE(q.organization_id, s.organization_id)
FROM public.stu_students s
WHERE q.tenant_id IS NULL
  AND q.student_id = s.student_id;

-- 4) Extend RLS: franchise_admin manage within org subtree
DO $$ BEGIN
  -- stu_students
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_students') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_students_franchise_admin_manage_subtree' AND c.relname = 'stu_students' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_students_franchise_admin_manage_subtree ON public.stu_students
        FOR ALL USING (
          tenant_id = public.get_current_user_tenant_id() AND
          public.get_current_user_role() = 'franchise_admin' AND
          public.is_in_current_org_subtree(organization_id)
        ) WITH CHECK (
          tenant_id = public.get_current_user_tenant_id() AND
          public.get_current_user_role() = 'franchise_admin' AND
          public.is_in_current_org_subtree(organization_id)
        );
    END IF;
  END IF;

  -- stu_enrollments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_enrollments') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_enrollments_franchise_admin_manage_subtree' AND c.relname = 'stu_enrollments' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_enrollments_franchise_admin_manage_subtree ON public.stu_enrollments
        FOR ALL USING (
          tenant_id = public.get_current_user_tenant_id() AND
          public.get_current_user_role() = 'franchise_admin' AND
          public.is_in_current_org_subtree(organization_id)
        ) WITH CHECK (
          tenant_id = public.get_current_user_tenant_id() AND
          public.get_current_user_role() = 'franchise_admin' AND
          public.is_in_current_org_subtree(organization_id)
        );
    END IF;
  END IF;

  -- stu_progress
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_progress') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_progress_franchise_admin_manage_subtree' AND c.relname = 'stu_progress' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_progress_franchise_admin_manage_subtree ON public.stu_progress
        FOR ALL USING (
          tenant_id = public.get_current_user_tenant_id() AND
          public.get_current_user_role() = 'franchise_admin' AND
          public.is_in_current_org_subtree(organization_id)
        ) WITH CHECK (
          tenant_id = public.get_current_user_tenant_id() AND
          public.get_current_user_role() = 'franchise_admin' AND
          public.is_in_current_org_subtree(organization_id)
        );
    END IF;
  END IF;

  -- qa_student_feedback
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qa_student_feedback') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'qa_feedback_franchise_admin_manage_subtree' AND c.relname = 'qa_student_feedback' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY qa_feedback_franchise_admin_manage_subtree ON public.qa_student_feedback
        FOR ALL USING (
          tenant_id = public.get_current_user_tenant_id() AND
          public.get_current_user_role() = 'franchise_admin' AND
          public.is_in_current_org_subtree(organization_id)
        ) WITH CHECK (
          tenant_id = public.get_current_user_tenant_id() AND
          public.get_current_user_role() = 'franchise_admin' AND
          public.is_in_current_org_subtree(organization_id)
        );
    END IF;
  END IF;
END $$;

COMMIT;