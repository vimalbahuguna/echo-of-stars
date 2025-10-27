-- Vedic Academy: Student & Certification domain
BEGIN;

-- Level Requirements (complements cur_certification_levels)
CREATE TABLE IF NOT EXISTS public.cur_level_requirements (
  requirement_id BIGSERIAL PRIMARY KEY,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  requirement_text TEXT NOT NULL,
  required_hours INTEGER,
  prerequisite TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_level_requirements_level ON public.cur_level_requirements(level_id);

-- Assessment Results per student
CREATE TABLE IF NOT EXISTS public.asm_assessment_results (
  result_id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES public.asm_assessments(assessment_id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  score NUMERIC(5,2),
  passed BOOLEAN,
  graded_at TIMESTAMPTZ,
  grader_faculty_id BIGINT REFERENCES public.fac_faculty(faculty_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment ON public.asm_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_student ON public.asm_assessment_results(student_id);

-- Certifications Awarded
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cert_status_enum') THEN
    CREATE TYPE public.cert_status_enum AS ENUM ('awarded','revoked');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.cert_certifications_awarded (
  award_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  level_id BIGINT NOT NULL REFERENCES public.cur_certification_levels(level_id) ON DELETE CASCADE,
  certificate_code VARCHAR(50),
  status public.cert_status_enum NOT NULL DEFAULT 'awarded',
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, level_id)
);
CREATE INDEX IF NOT EXISTS idx_cert_awarded_student ON public.cert_certifications_awarded(student_id);
CREATE INDEX IF NOT EXISTS idx_cert_awarded_level ON public.cert_certifications_awarded(level_id);

COMMIT;