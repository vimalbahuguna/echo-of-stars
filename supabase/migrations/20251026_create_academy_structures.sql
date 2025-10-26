-- Vedic Academy structures: cohorts, sections, assignments, submissions, announcements, resources
-- Aligns with multi-tenant RBAC using existing helper functions
-- Safe to run; uses IF NOT EXISTS where possible

BEGIN;

-- 1) Cohorts (group of learners within a term)
CREATE TABLE IF NOT EXISTS public.academy_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  term TEXT, -- e.g. 2025-Spring
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- active | archived
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_cohorts_tenant_id ON public.academy_cohorts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_academy_cohorts_org_id ON public.academy_cohorts(organization_id);

ALTER TABLE public.academy_cohorts ENABLE ROW LEVEL SECURITY;

-- Members in cohorts, linked via academy_memberships
CREATE TABLE IF NOT EXISTS public.cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES public.academy_cohorts(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES public.academy_memberships(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_cohort_member ON public.cohort_members(cohort_id, membership_id);
ALTER TABLE public.cohort_members ENABLE ROW LEVEL SECURITY;

-- 2) Course sections (offerings of a course led by a faculty)
CREATE TABLE IF NOT EXISTS public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  cohort_id UUID REFERENCES public.academy_cohorts(id) ON DELETE SET NULL,
  code TEXT, -- e.g. AST-101-A
  title TEXT,
  faculty_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  capacity INT,
  status TEXT NOT NULL DEFAULT 'active', -- active | archived
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_sections_course_id ON public.course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_tenant_id ON public.course_sections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_faculty ON public.course_sections(faculty_user_id);
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;

-- Enrollments to sections (via academy membership)
CREATE TABLE IF NOT EXISTS public.section_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES public.academy_memberships(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active', -- active | withdrawn
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_section_membership ON public.section_enrollments(section_id, membership_id);
ALTER TABLE public.section_enrollments ENABLE ROW LEVEL SECURITY;

-- 3) Assignments and submissions
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMPTZ,
  max_points INT DEFAULT 100,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assignments_section_id ON public.assignments(section_id);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES public.academy_memberships(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ,
  grade_points INT,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, membership_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.assignment_submissions(assignment_id);
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- 4) Announcements (tenant/org scoped; optionally cohort/section scoped)
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  cohort_id UUID REFERENCES public.academy_cohorts(id) ON DELETE SET NULL,
  section_id UUID REFERENCES public.course_sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_tenant_id ON public.announcements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_announcements_cohort_id ON public.announcements(cohort_id);
CREATE INDEX IF NOT EXISTS idx_announcements_section_id ON public.announcements(section_id);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 5) Resources (materials attached to sections)
CREATE TABLE IF NOT EXISTS public.section_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  kind TEXT, -- e.g. pdf, link, video
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_section_id ON public.section_resources(section_id);
ALTER TABLE public.section_resources ENABLE ROW LEVEL SECURITY;

-- 6) Triggers to update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_on_academy_cohorts'
  ) THEN
    CREATE TRIGGER set_updated_at_on_academy_cohorts BEFORE UPDATE ON public.academy_cohorts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_on_course_sections'
  ) THEN
    CREATE TRIGGER set_updated_at_on_course_sections BEFORE UPDATE ON public.course_sections
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_on_section_enrollments'
  ) THEN
    CREATE TRIGGER set_updated_at_on_section_enrollments BEFORE UPDATE ON public.section_enrollments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_on_assignments'
  ) THEN
    CREATE TRIGGER set_updated_at_on_assignments BEFORE UPDATE ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_on_assignment_submissions'
  ) THEN
    CREATE TRIGGER set_updated_at_on_assignment_submissions BEFORE UPDATE ON public.assignment_submissions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

-- 7) RLS Policies
-- Cohorts: Admins manage within tenant; members can read if part of cohort
CREATE POLICY IF NOT EXISTS "Admins manage cohorts in tenant" ON public.academy_cohorts
  FOR ALL USING (
    tenant_id = public.get_current_user_tenant_id() AND
    public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
  ) WITH CHECK (
    tenant_id = public.get_current_user_tenant_id() AND
    public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
  );

CREATE POLICY IF NOT EXISTS "Members read cohorts they belong to" ON public.academy_cohorts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cohort_members cm
      JOIN public.academy_memberships am ON am.id = cm.membership_id
      WHERE cm.cohort_id = academy_cohorts.id AND am.user_id = auth.uid()
    )
  );

-- Cohort members: users read their own membership entries; admins manage in tenant
CREATE POLICY IF NOT EXISTS "Users read own cohort_members" ON public.cohort_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.academy_memberships am
      WHERE am.id = cohort_members.membership_id AND am.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Admins manage cohort_members in tenant" ON public.cohort_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.academy_cohorts c
      WHERE c.id = cohort_members.cohort_id AND c.tenant_id = public.get_current_user_tenant_id()
    ) AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.academy_cohorts c
      WHERE c.id = cohort_members.cohort_id AND c.tenant_id = public.get_current_user_tenant_id()
    ) AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
  );

-- Sections: Admins manage within tenant; faculty of the section can read; students read if enrolled
CREATE POLICY IF NOT EXISTS "Admins manage sections in tenant" ON public.course_sections
  FOR ALL USING (
    tenant_id = public.get_current_user_tenant_id() AND
    public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
  ) WITH CHECK (
    tenant_id = public.get_current_user_tenant_id() AND
    public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
  );

CREATE POLICY IF NOT EXISTS "Faculty read own sections" ON public.course_sections
  FOR SELECT USING (faculty_user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Members read sections if enrolled" ON public.course_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.section_enrollments se
      JOIN public.academy_memberships am ON am.id = se.membership_id
      WHERE se.section_id = course_sections.id AND am.user_id = auth.uid()
    )
  );

-- Section enrollments: users read/manage their own; admins manage in tenant
CREATE POLICY IF NOT EXISTS "Users read own section_enrollments" ON public.section_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.academy_memberships am
      WHERE am.id = section_enrollments.membership_id AND am.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Users insert own section_enrollments" ON public.section_enrollments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.academy_memberships am
      WHERE am.id = section_enrollments.membership_id AND am.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Admins manage section_enrollments in tenant" ON public.section_enrollments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_sections s
      WHERE s.id = section_enrollments.section_id AND s.tenant_id = public.get_current_user_tenant_id()
    ) AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_sections s
      WHERE s.id = section_enrollments.section_id AND s.tenant_id = public.get_current_user_tenant_id()
    ) AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin')
  );

-- Assignments: faculty/admin manage; members read if enrolled in section
CREATE POLICY IF NOT EXISTS "Faculty/admin manage assignments" ON public.assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_sections s
      WHERE s.id = assignments.section_id AND (
        s.faculty_user_id = auth.uid() OR
        (s.tenant_id = public.get_current_user_tenant_id() AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin'))
      )
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_sections s
      WHERE s.id = assignments.section_id AND (
        s.faculty_user_id = auth.uid() OR
        (s.tenant_id = public.get_current_user_tenant_id() AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin'))
      )
    )
  );

CREATE POLICY IF NOT EXISTS "Members read assignments if enrolled" ON public.assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.section_enrollments se
      JOIN public.academy_memberships am ON am.id = se.membership_id
      WHERE se.section_id = assignments.section_id AND am.user_id = auth.uid()
    )
  );

-- Submissions: users manage own; faculty/admin read in tenant
CREATE POLICY IF NOT EXISTS "Users manage own submissions" ON public.assignment_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.academy_memberships am
      WHERE am.id = assignment_submissions.membership_id AND am.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.academy_memberships am
      WHERE am.id = assignment_submissions.membership_id AND am.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Faculty/admin read submissions" ON public.assignment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.course_sections s ON s.id = a.section_id
      WHERE a.id = assignment_submissions.assignment_id AND (
        s.faculty_user_id = auth.uid() OR
        (s.tenant_id = public.get_current_user_tenant_id() AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin'))
      )
    )
  );

-- Announcements: admins/faculty manage in tenant; members read if tenant matches
CREATE POLICY IF NOT EXISTS "Admins/faculty manage announcements" ON public.announcements
  FOR ALL USING (
    tenant_id = public.get_current_user_tenant_id() AND (
      public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin') OR
      EXISTS (
        SELECT 1 FROM public.course_sections s
        WHERE s.id = announcements.section_id AND s.faculty_user_id = auth.uid()
      )
    )
  ) WITH CHECK (
    tenant_id = public.get_current_user_tenant_id() AND (
      public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin') OR
      EXISTS (
        SELECT 1 FROM public.course_sections s
        WHERE s.id = announcements.section_id AND s.faculty_user_id = auth.uid()
      )
    )
  );

CREATE POLICY IF NOT EXISTS "Members read announcements in tenant" ON public.announcements
  FOR SELECT USING (
    tenant_id = public.get_current_user_tenant_id()
  );

-- Resources: faculty/admin manage; members read if enrolled
CREATE POLICY IF NOT EXISTS "Faculty/admin manage resources" ON public.section_resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_sections s
      WHERE s.id = section_resources.section_id AND (
        s.faculty_user_id = auth.uid() OR
        (s.tenant_id = public.get_current_user_tenant_id() AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin'))
      )
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_sections s
      WHERE s.id = section_resources.section_id AND (
        s.faculty_user_id = auth.uid() OR
        (s.tenant_id = public.get_current_user_tenant_id() AND public.get_current_user_role() IN ('super_admin','tenant_admin','organization_admin'))
      )
    )
  );

CREATE POLICY IF NOT EXISTS "Members read resources if enrolled" ON public.section_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.section_enrollments se
      JOIN public.academy_memberships am ON am.id = se.membership_id
      WHERE se.section_id = section_resources.section_id AND am.user_id = auth.uid()
    )
  );

COMMIT;