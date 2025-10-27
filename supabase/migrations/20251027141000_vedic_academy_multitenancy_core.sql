-- Vedic Academy: Core Multitenancy for student domain (stu_*)
-- Adds tenant/org fields and RLS policies across students, enrollments, progress, feedback
-- Safe IF EXISTS/IF NOT EXISTS guards to apply incrementally

BEGIN;

-- 1) Add multitenancy fields
DO $$ BEGIN
  -- stu_students
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_students') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='stu_students' AND column_name='tenant_id'
    ) THEN
      ALTER TABLE public.stu_students ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='stu_students' AND column_name='organization_id'
    ) THEN
      ALTER TABLE public.stu_students ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
    END IF;
    CREATE INDEX IF NOT EXISTS idx_stu_students_tenant ON public.stu_students(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_stu_students_org ON public.stu_students(organization_id);
  END IF;

  -- stu_enrollments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_enrollments') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='stu_enrollments' AND column_name='tenant_id'
    ) THEN
      ALTER TABLE public.stu_enrollments ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='stu_enrollments' AND column_name='organization_id'
    ) THEN
      ALTER TABLE public.stu_enrollments ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
    END IF;
    CREATE INDEX IF NOT EXISTS idx_stu_enrollments_tenant ON public.stu_enrollments(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_stu_enrollments_org ON public.stu_enrollments(organization_id);
  END IF;

  -- stu_progress
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_progress') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='stu_progress' AND column_name='tenant_id'
    ) THEN
      ALTER TABLE public.stu_progress ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='stu_progress' AND column_name='organization_id'
    ) THEN
      ALTER TABLE public.stu_progress ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
    END IF;
    CREATE INDEX IF NOT EXISTS idx_stu_progress_tenant ON public.stu_progress(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_stu_progress_org ON public.stu_progress(organization_id);
  END IF;

  -- qa_student_feedback
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qa_student_feedback') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='qa_student_feedback' AND column_name='tenant_id'
    ) THEN
      ALTER TABLE public.qa_student_feedback ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema='public' AND table_name='qa_student_feedback' AND column_name='organization_id'
    ) THEN
      ALTER TABLE public.qa_student_feedback ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
    END IF;
    CREATE INDEX IF NOT EXISTS idx_feedback_tenant ON public.qa_student_feedback(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_org ON public.qa_student_feedback(organization_id);
  END IF;
END $$;

-- 2) Enable RLS on core tables
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_students') THEN
    ALTER TABLE public.stu_students ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_enrollments') THEN
    ALTER TABLE public.stu_enrollments ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_progress') THEN
    ALTER TABLE public.stu_progress ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qa_student_feedback') THEN
    ALTER TABLE public.qa_student_feedback ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 3) Policies: service role full access
DO $$ BEGIN
  -- Helper to create policy if missing
  PERFORM 1;

  -- stu_students
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_students') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_students_service_role_all' AND c.relname = 'stu_students' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_students_service_role_all ON public.stu_students FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;

  -- stu_enrollments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_enrollments') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_enrollments_service_role_all' AND c.relname = 'stu_enrollments' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_enrollments_service_role_all ON public.stu_enrollments FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;

  -- stu_progress
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_progress') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_progress_service_role_all' AND c.relname = 'stu_progress' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_progress_service_role_all ON public.stu_progress FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;

  -- qa_student_feedback
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qa_student_feedback') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'qa_feedback_service_role_all' AND c.relname = 'qa_student_feedback' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY qa_feedback_service_role_all ON public.qa_student_feedback FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;
END $$;

-- 4) Policies: admins manage within tenant/org; users read their own data
DO $$ BEGIN
  -- stu_students: admins manage in tenant; org admins manage in organization
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_students') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_students_admins_manage_tenant' AND c.relname = 'stu_students' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_students_admins_manage_tenant ON public.stu_students
        FOR ALL USING (
          (tenant_id = public.get_current_user_tenant_id()) AND 
          public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
        ) WITH CHECK (
          (tenant_id = public.get_current_user_tenant_id()) AND 
          public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
        );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_students_users_read_own' AND c.relname = 'stu_students' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_students_users_read_own ON public.stu_students
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.email = stu_students.email
          )
        );
    END IF;
  END IF;

  -- stu_enrollments: admins manage in tenant; users read via own student email
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_enrollments') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_enrollments_admins_manage_tenant' AND c.relname = 'stu_enrollments' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_enrollments_admins_manage_tenant ON public.stu_enrollments
        FOR ALL USING (
          (tenant_id = public.get_current_user_tenant_id()) AND 
          public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
        ) WITH CHECK (
          (tenant_id = public.get_current_user_tenant_id()) AND 
          public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
        );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_enrollments_users_read_own' AND c.relname = 'stu_enrollments' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_enrollments_users_read_own ON public.stu_enrollments
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.stu_students s
            JOIN public.profiles p ON p.email = s.email
            WHERE s.student_id = stu_enrollments.student_id AND p.id = auth.uid()
          )
        );
    END IF;
  END IF;

  -- stu_progress: admins manage in tenant; users read via own student email
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_progress') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_progress_admins_manage_tenant' AND c.relname = 'stu_progress' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_progress_admins_manage_tenant ON public.stu_progress
        FOR ALL USING (
          (tenant_id = public.get_current_user_tenant_id()) AND 
          public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
        ) WITH CHECK (
          (tenant_id = public.get_current_user_tenant_id()) AND 
          public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
        );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'stu_progress_users_read_own' AND c.relname = 'stu_progress' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY stu_progress_users_read_own ON public.stu_progress
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.stu_students s
            JOIN public.profiles p ON p.email = s.email
            WHERE s.student_id = stu_progress.student_id AND p.id = auth.uid()
          )
        );
    END IF;
  END IF;

  -- qa_student_feedback: admins manage in tenant; users read via own student email
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qa_student_feedback') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'qa_feedback_admins_manage_tenant' AND c.relname = 'qa_student_feedback' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY qa_feedback_admins_manage_tenant ON public.qa_student_feedback
        FOR ALL USING (
          (tenant_id = public.get_current_user_tenant_id()) AND 
          public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
        ) WITH CHECK (
          (tenant_id = public.get_current_user_tenant_id()) AND 
          public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
        );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'qa_feedback_users_read_own' AND c.relname = 'qa_student_feedback' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY qa_feedback_users_read_own ON public.qa_student_feedback
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.stu_students s
            JOIN public.profiles p ON p.email = s.email
            WHERE s.student_id = qa_student_feedback.student_id AND p.id = auth.uid()
          )
        );
    END IF;
  END IF;
END $$;

COMMIT;