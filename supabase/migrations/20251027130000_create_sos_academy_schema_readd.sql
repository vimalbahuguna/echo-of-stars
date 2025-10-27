-- Re-add SOS Astro Academy schema objects with IF NOT EXISTS so they appear in remote
BEGIN;

-- Function for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cur_level_type_enum') THEN
    CREATE TYPE public.cur_level_type_enum AS ENUM ('Foundation','Practitioner','Professional','Master');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cur_difficulty_level_enum') THEN
    CREATE TYPE public.cur_difficulty_level_enum AS ENUM ('Beginner','Intermediate','Advanced','Master');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fac_session_type_enum') THEN
    CREATE TYPE public.fac_session_type_enum AS ENUM ('One-on-One','Group','Emergency','Project Review');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stu_enrollment_status_enum') THEN
    CREATE TYPE public.stu_enrollment_status_enum AS ENUM ('Enrolled','In Progress','Completed','Dropped','On Hold');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stu_payment_status_enum') THEN
    CREATE TYPE public.stu_payment_status_enum AS ENUM ('Pending','Partial','Paid','Refunded');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stu_progress_status_enum') THEN
    CREATE TYPE public.stu_progress_status_enum AS ENUM ('Not Started','In Progress','Completed','Skipped');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pkg_package_type_enum') THEN
    CREATE TYPE public.pkg_package_type_enum AS ENUM ('Complete','Level-by-Level','Fast-Track');
  END IF;
END $$;

-- CURRICULUM
CREATE TABLE IF NOT EXISTS public.cur_certification_levels (
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
CREATE INDEX IF NOT EXISTS idx_cur_levels_seq ON public.cur_certification_levels(sequence_order);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_cur_levels_updated' AND c.relname = 'cur_certification_levels'
  ) THEN
    CREATE TRIGGER trg_cur_levels_updated BEFORE UPDATE ON public.cur_certification_levels
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.cur_months (
  month_id BIGSERIAL PRIMARY KEY,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  month_number INT NOT NULL,
  month_title VARCHAR(200) NOT NULL,
  description TEXT,
  UNIQUE(level_id, month_number)
);

CREATE TABLE IF NOT EXISTS public.cur_weeks (
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
CREATE INDEX IF NOT EXISTS idx_month_weeks ON public.cur_weeks(month_id, week_start);

CREATE TABLE IF NOT EXISTS public.cur_topics (
  topic_id BIGSERIAL PRIMARY KEY,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  topic_title VARCHAR(300) NOT NULL,
  topic_order INT NOT NULL,
  topic_description TEXT,
  is_core_topic BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_week_topics ON public.cur_topics(week_id, topic_order);

CREATE TABLE IF NOT EXISTS public.cur_practical_exercises (
  exercise_id BIGSERIAL PRIMARY KEY,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  exercise_title VARCHAR(300) NOT NULL,
  exercise_description TEXT,
  exercise_order INT NOT NULL,
  estimated_duration_hours NUMERIC(5,2),
  difficulty_level public.cur_difficulty_level_enum NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_week_exercises ON public.cur_practical_exercises(week_id, exercise_order);

-- ASSESSMENT
CREATE TABLE IF NOT EXISTS public.asm_types (
  assessment_type_id BIGSERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  CONSTRAINT uk_type_name UNIQUE (type_name)
);

CREATE TABLE IF NOT EXISTS public.asm_assessments (
  assessment_id BIGSERIAL PRIMARY KEY,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  assessment_type_id BIGINT NOT NULL REFERENCES public.asm_types(assessment_type_id) ON DELETE RESTRICT,
  assessment_name VARCHAR(200) NOT NULL,
  duration_hours NUMERIC(5,2),
  max_marks INT,
  quantity INT DEFAULT 1,
  description TEXT
);
CREATE INDEX IF NOT EXISTS idx_level_assessments ON public.asm_assessments(level_id);

-- PACKAGES
CREATE TABLE IF NOT EXISTS public.pkg_course_packages (
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

CREATE TABLE IF NOT EXISTS public.pkg_inclusions (
  inclusion_id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES public.pkg_course_packages(package_id) ON DELETE CASCADE,
  inclusion_item VARCHAR(300) NOT NULL,
  inclusion_order INT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_package_inclusions ON public.pkg_inclusions(package_id, inclusion_order);

-- FACULTY
CREATE TABLE IF NOT EXISTS public.fac_faculty (
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
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_faculty_updated' AND c.relname = 'fac_faculty'
  ) THEN
    CREATE TRIGGER trg_faculty_updated BEFORE UPDATE ON public.fac_faculty
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.fac_mentor_requirements (
  requirement_id BIGSERIAL PRIMARY KEY,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  mentor_type VARCHAR(100) NOT NULL,
  student_ratio VARCHAR(20) NOT NULL,
  description TEXT
);

-- STUDENTS
CREATE TABLE IF NOT EXISTS public.stu_students (
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
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'trg_students_updated' AND c.relname = 'stu_students'
  ) THEN
    CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.stu_students
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_enrollment_date_students ON public.stu_students(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_students_active ON public.stu_students(is_active, current_level_id);

CREATE TABLE IF NOT EXISTS public.stu_enrollments (
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
CREATE INDEX IF NOT EXISTS idx_student_status ON public.stu_enrollments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollment_date_enroll ON public.stu_enrollments(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.stu_enrollments(status, level_id);

CREATE TABLE IF NOT EXISTS public.stu_progress (
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
CREATE INDEX IF NOT EXISTS idx_student_progress ON public.stu_progress(student_id, status);
CREATE INDEX IF NOT EXISTS idx_progress_completion ON public.stu_progress(student_id, completion_percentage);

CREATE TABLE IF NOT EXISTS public.stu_assessments (
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
CREATE INDEX IF NOT EXISTS idx_student_assessments ON public.stu_assessments(student_id, assessment_id);

CREATE TABLE IF NOT EXISTS public.stu_certifications (
  certification_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  issue_date DATE NOT NULL,
  certificate_number VARCHAR(100) NOT NULL UNIQUE,
  blockchain_hash VARCHAR(200),
  verification_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE
);

COMMIT;