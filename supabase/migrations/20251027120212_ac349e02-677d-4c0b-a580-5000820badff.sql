-- Create STU_cohorts table for student groups/cohorts
CREATE TABLE IF NOT EXISTS public.stu_cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  level_id bigint REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  start_date date,
  end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  max_students integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create STU_cohort_members table
CREATE TABLE IF NOT EXISTS public.stu_cohort_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.stu_cohorts(id) ON DELETE CASCADE,
  membership_id uuid NOT NULL REFERENCES public.academy_memberships(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'completed')),
  notes text,
  UNIQUE(cohort_id, membership_id)
);

-- Create CUR_sections table for course sections
CREATE TABLE IF NOT EXISTS public.cur_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  level_id bigint REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  week_id bigint REFERENCES public.cur_weeks(week_id) ON DELETE SET NULL,
  faculty_id bigint REFERENCES public.fac_faculty(faculty_id) ON DELETE SET NULL,
  schedule text,
  capacity integer,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create CUR_assignments table
CREATE TABLE IF NOT EXISTS public.cur_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES public.cur_sections(id) ON DELETE CASCADE,
  week_id bigint REFERENCES public.cur_weeks(week_id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  max_points numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create COM_announcements table
CREATE TABLE IF NOT EXISTS public.com_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'faculty', 'specific_level')),
  level_id bigint REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create RES_section_resources table
CREATE TABLE IF NOT EXISTS public.res_section_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.cur_sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  resource_type text CHECK (resource_type IN ('document', 'video', 'link', 'other')),
  url text,
  file_path text,
  order_index integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stu_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stu_cohort_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cur_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cur_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.com_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.res_section_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for STU_cohorts
CREATE POLICY "Admins can manage cohorts in their tenant"
  ON public.stu_cohorts
  FOR ALL
  TO authenticated
  USING (tenant_id = get_current_user_tenant_id() AND get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'))
  WITH CHECK (tenant_id = get_current_user_tenant_id() AND get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'));

CREATE POLICY "Users can view cohorts in their tenant"
  ON public.stu_cohorts
  FOR SELECT
  TO authenticated
  USING (tenant_id = get_current_user_tenant_id());

-- RLS Policies for STU_cohort_members
CREATE POLICY "Admins can manage cohort members"
  ON public.stu_cohort_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.stu_cohorts 
      WHERE id = stu_cohort_members.cohort_id 
      AND tenant_id = get_current_user_tenant_id()
      AND get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stu_cohorts 
      WHERE id = stu_cohort_members.cohort_id 
      AND tenant_id = get_current_user_tenant_id()
      AND get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin')
    )
  );

CREATE POLICY "Users can view their cohort memberships"
  ON public.stu_cohort_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.academy_memberships 
      WHERE id = stu_cohort_members.membership_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for CUR_sections
CREATE POLICY "Authenticated users can view sections"
  ON public.cur_sections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage sections"
  ON public.cur_sections
  FOR ALL
  TO authenticated
  USING (get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'))
  WITH CHECK (get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'));

-- RLS Policies for CUR_assignments
CREATE POLICY "Enrolled users can view assignments"
  ON public.cur_assignments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage assignments"
  ON public.cur_assignments
  FOR ALL
  TO authenticated
  USING (get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'))
  WITH CHECK (get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'));

-- RLS Policies for COM_announcements
CREATE POLICY "Admins can manage announcements in their tenant"
  ON public.com_announcements
  FOR ALL
  TO authenticated
  USING (tenant_id = get_current_user_tenant_id() AND get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'))
  WITH CHECK (tenant_id = get_current_user_tenant_id() AND get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'));

CREATE POLICY "Users can view announcements in their tenant"
  ON public.com_announcements
  FOR SELECT
  TO authenticated
  USING (tenant_id = get_current_user_tenant_id() AND (published_at IS NULL OR published_at <= now()));

-- RLS Policies for RES_section_resources
CREATE POLICY "Enrolled users can view section resources"
  ON public.res_section_resources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage section resources"
  ON public.res_section_resources
  FOR ALL
  TO authenticated
  USING (get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'))
  WITH CHECK (get_current_user_role() IN ('super_admin', 'tenant_admin', 'organization_admin'));

-- Indexes for performance
CREATE INDEX idx_stu_cohorts_tenant ON public.stu_cohorts(tenant_id);
CREATE INDEX idx_stu_cohorts_level ON public.stu_cohorts(level_id);
CREATE INDEX idx_stu_cohort_members_cohort ON public.stu_cohort_members(cohort_id);
CREATE INDEX idx_stu_cohort_members_membership ON public.stu_cohort_members(membership_id);
CREATE INDEX idx_cur_sections_level ON public.cur_sections(level_id);
CREATE INDEX idx_cur_sections_faculty ON public.cur_sections(faculty_id);
CREATE INDEX idx_cur_assignments_section ON public.cur_assignments(section_id);
CREATE INDEX idx_com_announcements_tenant ON public.com_announcements(tenant_id);
CREATE INDEX idx_res_section_resources_section ON public.res_section_resources(section_id);

-- Triggers for updated_at
CREATE TRIGGER update_stu_cohorts_updated_at BEFORE UPDATE ON public.stu_cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cur_sections_updated_at BEFORE UPDATE ON public.cur_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cur_assignments_updated_at BEFORE UPDATE ON public.cur_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_com_announcements_updated_at BEFORE UPDATE ON public.com_announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_res_section_resources_updated_at BEFORE UPDATE ON public.res_section_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();