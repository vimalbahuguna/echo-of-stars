-- Create SOS Astro Academy schema strictly per document with module prefixes
BEGIN;

-- Enums (PostgreSQL types) mapped from document
CREATE TYPE public.cur_level_type_enum AS ENUM ('Foundation','Practitioner','Professional','Master');
CREATE TYPE public.cur_difficulty_level_enum AS ENUM ('Beginner','Intermediate','Advanced','Master');
CREATE TYPE public.fac_session_type_enum AS ENUM ('One-on-One','Group','Emergency','Project Review');
CREATE TYPE public.stu_enrollment_status_enum AS ENUM ('Enrolled','In Progress','Completed','Dropped','On Hold');
CREATE TYPE public.stu_payment_status_enum AS ENUM ('Pending','Partial','Paid','Refunded');
CREATE TYPE public.stu_progress_status_enum AS ENUM ('Not Started','In Progress','Completed','Skipped');
CREATE TYPE public.pkg_package_type_enum AS ENUM ('Complete','Level-by-Level','Fast-Track');

-- Updated-at trigger function (for tables with updated_at requirement)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- CURRICULUM MODULE (CUR_)
CREATE TABLE public.cur_certification_levels (
  level_id BIGSERIAL PRIMARY KEY,
  level_name VARCHAR(100) NOT NULL,
  level_type public.cur_level_type_enum NOT NULL,
  duration_months INT NOT NULL,
  duration_weeks INT NOT NULL,
  duration_days INT NOT NULL,
  sequence_order INT NOT NULL,
  passing_score_percentage NUMERIC(5,2) NOT NULL,
  fee_usd NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uk_level_type UNIQUE (level_type)
);
CREATE TRIGGER trg_cur_levels_updated BEFORE UPDATE ON public.cur_certification_levels FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.cur_months (
  month_id BIGSERIAL PRIMARY KEY,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  month_number INT NOT NULL,
  month_title VARCHAR(200) NOT NULL,
  description TEXT,
  UNIQUE(level_id, month_number)
);

CREATE TABLE public.cur_weeks (
  week_id BIGSERIAL PRIMARY KEY,
  month_id BIGINT NOT NULL REFERENCES public.cur_months(month_id) ON DELETE CASCADE,
  week_start INT NOT NULL,
  week_end INT NOT NULL,
  week_title VARCHAR(200) NOT NULL,
  theory_hours NUMERIC(5,2) DEFAULT 0,
  practical_hours NUMERIC(5,2) DEFAULT 0,
  self_study_hours NUMERIC(5,2) DEFAULT 0,
  description TEXT
);
CREATE INDEX idx_month_weeks ON public.cur_weeks(month_id, week_start);

CREATE TABLE public.cur_topics (
  topic_id BIGSERIAL PRIMARY KEY,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  topic_title VARCHAR(300) NOT NULL,
  topic_order INT NOT NULL,
  topic_description TEXT,
  is_core_topic BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_week_topics ON public.cur_topics(week_id, topic_order);

CREATE TABLE public.cur_practical_exercises (
  exercise_id BIGSERIAL PRIMARY KEY,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  exercise_title VARCHAR(300) NOT NULL,
  exercise_description TEXT,
  exercise_order INT NOT NULL,
  estimated_duration_hours NUMERIC(5,2),
  difficulty_level public.cur_difficulty_level_enum NOT NULL
);
CREATE INDEX idx_week_exercises ON public.cur_practical_exercises(week_id, exercise_order);

-- ASSESSMENT MODULE (ASM_)
CREATE TABLE public.asm_types (
  assessment_type_id BIGSERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  CONSTRAINT uk_type_name UNIQUE (type_name)
);

CREATE TABLE public.asm_assessments (
  assessment_id BIGSERIAL PRIMARY KEY,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  assessment_type_id BIGINT NOT NULL REFERENCES public.asm_types(assessment_type_id) ON DELETE RESTRICT,
  assessment_name VARCHAR(200) NOT NULL,
  duration_hours NUMERIC(5,2),
  max_marks INT,
  quantity INT DEFAULT 1,
  description TEXT
);
CREATE INDEX idx_level_assessments ON public.asm_assessments(level_id);

-- COURSE PACKAGES (PKG_)
CREATE TABLE public.pkg_course_packages (
  package_id BIGSERIAL PRIMARY KEY,
  package_name VARCHAR(100) NOT NULL,
  package_type public.pkg_package_type_enum NOT NULL,
  total_fee_usd NUMERIC(10,2) NOT NULL,
  duration_months INT NOT NULL,
  hours_per_week INT,
  savings_usd NUMERIC(10,2) DEFAULT 0,
  payment_plan_available BOOLEAN DEFAULT FALSE,
  payment_installments INT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT uk_package_type UNIQUE (package_type)
);

CREATE TABLE public.pkg_inclusions (
  inclusion_id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES public.pkg_course_packages(package_id) ON DELETE CASCADE,
  inclusion_item VARCHAR(300) NOT NULL,
  inclusion_order INT NOT NULL
);
CREATE INDEX idx_package_inclusions ON public.pkg_inclusions(package_id, inclusion_order);

-- FACULTY & MENTORSHIP (FAC_)
CREATE TABLE public.fac_faculty (
  faculty_id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  years_of_experience INT,
  specialization VARCHAR(200),
  bio TEXT,
  is_lead_faculty BOOLEAN DEFAULT FALSE,
  is_guest_faculty BOOLEAN DEFAULT FALSE,
  traditional_lineage VARCHAR(200),
  published_works TEXT,
  profile_image_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_faculty_updated BEFORE UPDATE ON public.fac_faculty FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fac_mentor_requirements (
  requirement_id BIGSERIAL PRIMARY KEY,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  mentor_type VARCHAR(100) NOT NULL,
  student_ratio VARCHAR(20) NOT NULL,
  description TEXT
);

-- moved down after stu_students
-- CREATE TABLE public.fac_student_mentors (
--   assignment_id BIGSERIAL PRIMARY KEY,
--   student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
--   faculty_id BIGINT NOT NULL REFERENCES public.fac_faculty(faculty_id) ON DELETE CASCADE,
--   level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
--   assigned_date DATE NOT NULL,
--   end_date DATE,
--   is_active BOOLEAN DEFAULT TRUE
-- );
-- CREATE INDEX idx_active_assignments ON public.fac_student_mentors(is_active);
-- CREATE INDEX idx_student_mentor ON public.fac_student_mentors(student_id, faculty_id);
-- 
-- CREATE TABLE public.fac_mentorship_sessions (
--   session_id BIGSERIAL PRIMARY KEY,
--   assignment_id BIGINT NOT NULL REFERENCES public.fac_student_mentors(assignment_id) ON DELETE CASCADE,
--   session_date TIMESTAMPTZ NOT NULL,
--   duration_minutes INT,
--   session_type public.fac_session_type_enum NOT NULL,
--   topic_discussed VARCHAR(300),
--   notes TEXT,
--   student_feedback_rating INT CHECK (student_feedback_rating BETWEEN 1 AND 5)
-- );
-- CREATE INDEX idx_session_date ON public.fac_mentorship_sessions(session_date);

-- STUDENT & ENROLLMENT (STU_)
CREATE TABLE public.stu_students (
  student_id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  country VARCHAR(100),
  enrollment_date DATE NOT NULL,
  current_level_id BIGINT REFERENCES public.cur_certification_levels(level_id),
  sos_astro_account_id VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.stu_students FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_enrollment_date ON public.stu_students(enrollment_date);
CREATE INDEX idx_students_active ON public.stu_students(is_active, current_level_id);

CREATE TABLE public.stu_enrollments (
  enrollment_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  package_id BIGINT NOT NULL REFERENCES public.pkg_course_packages(package_id),
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id),
  enrollment_date DATE NOT NULL,
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  status public.stu_enrollment_status_enum NOT NULL DEFAULT 'Enrolled'::public.stu_enrollment_status_enum,
  payment_status public.stu_payment_status_enum NOT NULL DEFAULT 'Pending'::public.stu_payment_status_enum
);
CREATE INDEX idx_student_status ON public.stu_enrollments(student_id, status);
CREATE INDEX idx_enrollment_date ON public.stu_enrollments(enrollment_date);
CREATE INDEX idx_enrollments_status ON public.stu_enrollments(status, level_id);

CREATE TABLE public.stu_progress (
  progress_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  completion_percentage NUMERIC(5,2) DEFAULT 0,
  status public.stu_progress_status_enum DEFAULT 'Not Started'::public.stu_progress_status_enum,
  started_date DATE,
  completed_date DATE,
  notes TEXT,
  CONSTRAINT uk_student_week UNIQUE (student_id, week_id)
);
CREATE INDEX idx_student_progress ON public.stu_progress(student_id, status);
CREATE INDEX idx_progress_completion ON public.stu_progress(student_id, completion_percentage);

CREATE TABLE public.stu_assessments (
  student_assessment_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  assessment_id BIGINT NOT NULL REFERENCES public.asm_assessments(assessment_id) ON DELETE CASCADE,
  attempt_number INT DEFAULT 1,
  assessment_date DATE,
  marks_obtained NUMERIC(5,2),
  max_marks NUMERIC(5,2),
  percentage NUMERIC(5,2),
  passed BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  evaluated_by BIGINT REFERENCES public.fac_faculty(faculty_id),
  evaluated_date DATE
);
CREATE INDEX idx_student_assessments ON public.stu_assessments(student_id, assessment_id);

CREATE TABLE public.stu_certifications (
  certification_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  issue_date DATE NOT NULL,
  certificate_number VARCHAR(100) NOT NULL UNIQUE,
  blockchain_hash VARCHAR(200),
  verification_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  revoked_date DATE,
  revocation_reason TEXT
);
CREATE INDEX idx_student_certs ON public.stu_certifications(student_id);
CREATE INDEX idx_cert_number ON public.stu_certifications(certificate_number);
CREATE INDEX idx_certifications_issue_date ON public.stu_certifications(issue_date);

-- FACULTY mentorship (moved here after STU_ definitions)
CREATE TABLE public.fac_student_mentors (
  assignment_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  faculty_id BIGINT NOT NULL REFERENCES public.fac_faculty(faculty_id) ON DELETE CASCADE,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_active_assignments ON public.fac_student_mentors(is_active);
CREATE INDEX idx_student_mentor ON public.fac_student_mentors(student_id, faculty_id);

CREATE TABLE public.fac_mentorship_sessions (
  session_id BIGSERIAL PRIMARY KEY,
  assignment_id BIGINT NOT NULL REFERENCES public.fac_student_mentors(assignment_id) ON DELETE CASCADE,
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT,
  session_type public.fac_session_type_enum NOT NULL,
  topic_discussed VARCHAR(300),
  notes TEXT,
  student_feedback_rating INT CHECK (student_feedback_rating BETWEEN 1 AND 5)
);
CREATE INDEX idx_session_date ON public.fac_mentorship_sessions(session_date);

-- RESOURCE LIBRARY (RES_)
CREATE TABLE public.res_types (
  resource_type_id BIGSERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  CONSTRAINT uk_type_name UNIQUE (type_name)
);

CREATE TABLE public.res_resources (
  resource_id BIGSERIAL PRIMARY KEY,
  resource_type_id BIGINT NOT NULL REFERENCES public.res_types(resource_type_id),
  resource_title VARCHAR(300) NOT NULL,
  description TEXT,
  file_url VARCHAR(500),
  duration_minutes INT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_date DATE,
  created_by BIGINT REFERENCES public.fac_faculty(faculty_id)
);
CREATE INDEX idx_resource_type ON public.res_resources(resource_type_id);

CREATE TABLE public.res_week_mapping (
  week_resource_id BIGSERIAL PRIMARY KEY,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  resource_id BIGINT NOT NULL REFERENCES public.res_resources(resource_id) ON DELETE CASCADE,
  resource_order INT NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE
);

-- Views (adapted to prefixed tables present in document)
CREATE OR REPLACE VIEW public.v_active_students_summary AS
SELECT 
  s.student_id,
  (s.first_name || ' ' || s.last_name) AS student_name,
  s.email,
  cl.level_name,
  se.status AS enrollment_status,
  se.start_date,
  se.expected_completion_date,
  COUNT(DISTINCT sp.week_id) AS weeks_completed,
  AVG(sp.completion_percentage) AS avg_completion_percentage
FROM public.stu_students s
JOIN public.stu_enrollments se ON s.student_id = se.student_id
JOIN public.cur_certification_levels cl ON se.level_id = cl.level_id
LEFT JOIN public.stu_progress sp ON s.student_id = sp.student_id AND sp.status = 'Completed'
WHERE s.is_active = TRUE AND se.status = 'In Progress'
GROUP BY s.student_id, s.first_name, s.last_name, s.email, cl.level_name, se.status, se.start_date, se.expected_completion_date;

CREATE OR REPLACE VIEW public.v_student_performance AS
SELECT 
  s.student_id,
  (s.first_name || ' ' || s.last_name) AS student_name,
  cl.level_name,
  COUNT(sa.student_assessment_id) AS total_assessments,
  AVG(sa.percentage) AS avg_score,
  SUM(CASE WHEN sa.passed THEN 1 ELSE 0 END) AS passed_assessments
FROM public.stu_students s
JOIN public.stu_enrollments se ON se.student_id = s.student_id
JOIN public.cur_certification_levels cl ON cl.level_id = se.level_id
LEFT JOIN public.stu_assessments sa ON sa.student_id = s.student_id
GROUP BY s.student_id, s.first_name, s.last_name, cl.level_name;

-- FINANCIAL MANAGEMENT (PAY_)
CREATE TABLE public.pay_payments (
  payment_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES public.stu_students(student_id) ON DELETE SET NULL,
  enrollment_id BIGINT REFERENCES public.stu_enrollments(enrollment_id) ON DELETE SET NULL,
  package_id BIGINT REFERENCES public.pkg_course_packages(package_id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status public.stu_payment_status_enum DEFAULT 'Pending'::public.stu_payment_status_enum,
  payment_date DATE,
  due_date DATE,
  method VARCHAR(50),
  transaction_reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_student ON public.pay_payments(student_id);
CREATE INDEX idx_payments_status ON public.pay_payments(status, payment_date);
CREATE INDEX idx_payments_date ON public.pay_payments(payment_date);

CREATE TABLE public.pay_installments (
  installment_id BIGSERIAL PRIMARY KEY,
  payment_id BIGINT NOT NULL REFERENCES public.pay_payments(payment_id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  due_date DATE,
  amount NUMERIC(10,2) NOT NULL,
  paid_date DATE,
  status public.stu_payment_status_enum DEFAULT 'Pending'::public.stu_payment_status_enum,
  notes TEXT
);
CREATE INDEX idx_installments_payment ON public.pay_installments(payment_id);
CREATE INDEX idx_installments_number ON public.pay_installments(payment_id, installment_number);

-- COMMUNICATION & ENGAGEMENT (COM_)
CREATE TABLE public.com_live_sessions (
  live_session_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  host_faculty_id BIGINT REFERENCES public.fac_faculty(faculty_id) ON DELETE SET NULL,
  level_id BIGINT REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  week_id BIGINT REFERENCES public.cur_weeks(week_id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT,
  recording_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_live_sessions_schedule ON public.com_live_sessions(scheduled_at);

CREATE TABLE public.com_session_attendance (
  attendance_id BIGSERIAL PRIMARY KEY,
  live_session_id BIGINT NOT NULL REFERENCES public.com_live_sessions(live_session_id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  attended BOOLEAN DEFAULT TRUE,
  UNIQUE (live_session_id, student_id)
);
CREATE INDEX idx_session_attendance_session ON public.com_session_attendance(live_session_id);

CREATE TABLE public.com_forum_topics (
  forum_topic_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content_summary TEXT,
  created_by_student_id BIGINT REFERENCES public.stu_students(student_id) ON DELETE SET NULL,
  created_by_faculty_id BIGINT REFERENCES public.fac_faculty(faculty_id) ON DELETE SET NULL,
  level_id BIGINT REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  week_id BIGINT REFERENCES public.cur_weeks(week_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_forum_topics_created ON public.com_forum_topics(created_at);

CREATE TABLE public.com_forum_posts (
  forum_post_id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT NOT NULL REFERENCES public.com_forum_topics(forum_topic_id) ON DELETE CASCADE,
  student_id BIGINT REFERENCES public.stu_students(student_id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  parent_post_id BIGINT REFERENCES public.com_forum_posts(forum_post_id) ON DELETE SET NULL
);
CREATE INDEX idx_forum_posts_topic ON public.com_forum_posts(topic_id);
CREATE INDEX idx_forum_posts_created ON public.com_forum_posts(created_at);

CREATE TABLE public.com_announcements (
  announcement_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  created_by_faculty_id BIGINT REFERENCES public.fac_faculty(faculty_id) ON DELETE SET NULL,
  level_id BIGINT REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  week_id BIGINT REFERENCES public.cur_weeks(week_id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_announcements_published ON public.com_announcements(published_at);

-- QUALITY ASSURANCE (QUA_)
CREATE TABLE public.qua_student_feedback (
  feedback_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  level_id BIGINT REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  week_id BIGINT REFERENCES public.cur_weeks(week_id) ON DELETE SET NULL,
  session_id BIGINT REFERENCES public.com_live_sessions(live_session_id) ON DELETE SET NULL,
  content_quality INT CHECK (content_quality BETWEEN 1 AND 5),
  instructor_effectiveness INT CHECK (instructor_effectiveness BETWEEN 1 AND 5),
  clarity INT CHECK (clarity BETWEEN 1 AND 5),
  usefulness INT CHECK (usefulness BETWEEN 1 AND 5),
  overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feedback_student ON public.qua_student_feedback(student_id);
CREATE INDEX idx_feedback_created ON public.qua_student_feedback(created_at);

-- LEARNING RESOURCES extension
CREATE TABLE public.res_topic_mapping (
  res_topic_map_id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT NOT NULL REFERENCES public.cur_topics(topic_id) ON DELETE CASCADE,
  resource_id BIGINT NOT NULL REFERENCES public.res_resources(resource_id) ON DELETE CASCADE,
  resource_order INT,
  is_mandatory BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_res_topic_map_topic ON public.res_topic_mapping(topic_id);

-- Revenue summary grouped by month and package (USD-only)
CREATE OR REPLACE VIEW public.v_revenue_summary AS
SELECT 
  to_char(p.payment_date, 'YYYY-MM') AS month_year,
  cp.package_name,
  COUNT(DISTINCT se.student_id) AS students_enrolled,
  SUM(p.amount) AS total_revenue
FROM public.pay_payments p
JOIN public.stu_enrollments se ON p.enrollment_id = se.enrollment_id
JOIN public.pkg_course_packages cp ON se.package_id = cp.package_id
WHERE p.status = 'Paid' AND COALESCE(p.currency, 'USD') = 'USD'
GROUP BY month_year, cp.package_name
ORDER BY month_year, cp.package_name;

COMMIT;