-- Vedic Academy: Faculty & Mentorship domain
BEGIN;

-- Mentor-Student assignments
CREATE TABLE IF NOT EXISTS public.fac_mentor_assignments (
  assignment_id BIGSERIAL PRIMARY KEY,
  mentor_id BIGINT NOT NULL REFERENCES public.fac_faculty(faculty_id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES public.stu_students(student_id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (mentor_id, student_id, start_date)
);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_mentor ON public.fac_mentor_assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_student ON public.fac_mentor_assignments(student_id);

-- Mentorship sessions with recordings
CREATE TABLE IF NOT EXISTS public.fac_mentorship_sessions (
  session_id BIGSERIAL PRIMARY KEY,
  assignment_id BIGINT NOT NULL REFERENCES public.fac_mentor_assignments(assignment_id) ON DELETE CASCADE,
  session_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  recording_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_assignment ON public.fac_mentorship_sessions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_session_at ON public.fac_mentorship_sessions(session_at);

COMMIT;