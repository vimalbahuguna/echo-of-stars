-- Additional SOS Astro Academy tables and views to complete schema
BEGIN;

-- SESSION MANAGEMENT (aligned to curriculum weeks)
CREATE TABLE IF NOT EXISTS public.cur_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cur_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.stu_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.cur_sessions(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES public.academy_memberships(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'present', -- present | absent | late
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, membership_id)
);
ALTER TABLE public.stu_attendance ENABLE ROW LEVEL SECURITY;

-- FACULTY ASSIGNMENTS TO WEEKS
CREATE TABLE IF NOT EXISTS public.fac_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id BIGINT NOT NULL REFERENCES public.fac_faculty(faculty_id) ON DELETE CASCADE,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  role TEXT DEFAULT 'instructor',
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (faculty_id, week_id)
);

-- PACKAGE PRICING TIERS
CREATE TABLE IF NOT EXISTS public.pkg_pricing_tiers (
  tier_id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES public.pkg_course_packages(package_id) ON DELETE CASCADE,
  tier_name VARCHAR(100) NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  description TEXT,
  UNIQUE (package_id, tier_name)
);

-- PAYMENTS FOR ENROLLMENTS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
    CREATE TYPE public.payment_status_enum AS ENUM ('pending','paid','refunded');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.stu_payments (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id BIGINT NOT NULL REFERENCES public.stu_enrollments(enrollment_id) ON DELETE CASCADE,
  amount_usd NUMERIC(10,2) NOT NULL,
  status public.payment_status_enum NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMPTZ DEFAULT now(),
  external_ref VARCHAR(200),
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON public.stu_payments(enrollment_id);

-- CURRICULUM RESOURCES & LOGS
CREATE TABLE IF NOT EXISTS public.cur_reading_materials (
  material_id BIGSERIAL PRIMARY KEY,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  url TEXT,
  kind TEXT,
  added_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_materials_week ON public.cur_reading_materials(week_id);

CREATE TABLE IF NOT EXISTS public.cur_exercise_logs (
  log_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  exercise_id BIGINT NOT NULL REFERENCES public.cur_practical_exercises(exercise_id) ON DELETE CASCADE,
  status public.stu_progress_status_enum DEFAULT 'Not Started',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE (student_id, exercise_id)
);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_student ON public.cur_exercise_logs(student_id);

-- VIEWS
CREATE OR REPLACE VIEW public.vw_student_enrollment_overview AS
SELECT s.student_id,
       s.first_name,
       s.last_name,
       e.enrollment_id,
       e.status,
       e.payment_status,
       e.enrollment_date,
       e.level_id,
       l.level_name,
       p.package_name
FROM public.stu_students s
JOIN public.stu_enrollments e ON e.student_id = s.student_id
JOIN public.cur_certification_levels l ON l.level_id = e.level_id
LEFT JOIN public.pkg_course_packages p ON p.package_id = e.package_id;

CREATE OR REPLACE VIEW public.vw_faculty_week_load AS
SELECT f.faculty_id,
       f.first_name,
       f.last_name,
       a.week_id,
       w.week_title,
       w.week_start,
       w.week_end
FROM public.fac_faculty f
JOIN public.fac_assignments a ON a.faculty_id = f.faculty_id
JOIN public.cur_weeks w ON w.week_id = a.week_id;

CREATE OR REPLACE VIEW public.vw_curriculum_outline AS
SELECT l.level_id,
       l.level_name,
       m.month_id,
       m.month_number,
       m.month_title,
       w.week_id,
       w.week_start,
       w.week_end,
       w.week_title,
       t.topic_id,
       t.topic_order,
       t.topic_title
FROM public.cur_certification_levels l
JOIN public.cur_months m ON m.level_id = l.level_id
JOIN public.cur_weeks w ON w.month_id = m.month_id
LEFT JOIN public.cur_topics t ON t.week_id = w.week_id
ORDER BY l.sequence_order, m.month_number, w.week_start, t.topic_order;

COMMIT;