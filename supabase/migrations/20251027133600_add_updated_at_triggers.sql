-- Vedic Academy: Attach set_updated_at triggers to new tables (guarded)
BEGIN;

-- Ensure helper function exists
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Helper to attach trigger if table exists
DO $$ BEGIN
  -- cur_level_requirements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='cur_level_requirements') THEN
    ALTER TABLE public.cur_level_requirements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.cur_level_requirements'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.cur_level_requirements;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cur_level_requirements
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- asm_assessment_results
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='asm_assessment_results') THEN
    ALTER TABLE public.asm_assessment_results ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.asm_assessment_results'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.asm_assessment_results;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.asm_assessment_results
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- cert_certifications_awarded
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='cert_certifications_awarded') THEN
    ALTER TABLE public.cert_certifications_awarded ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.cert_certifications_awarded'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.cert_certifications_awarded;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cert_certifications_awarded
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- fac_mentor_assignments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='fac_mentor_assignments') THEN
    ALTER TABLE public.fac_mentor_assignments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.fac_mentor_assignments'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.fac_mentor_assignments;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.fac_mentor_assignments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- fac_mentorship_sessions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='fac_mentorship_sessions') THEN
    ALTER TABLE public.fac_mentorship_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.fac_mentorship_sessions'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.fac_mentorship_sessions;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.fac_mentorship_sessions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- res_types
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='res_types') THEN
    ALTER TABLE public.res_types ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.res_types'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.res_types;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.res_types
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- res_resources
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='res_resources') THEN
    ALTER TABLE public.res_resources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.res_resources'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.res_resources;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.res_resources
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- cur_week_resources
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='cur_week_resources') THEN
    ALTER TABLE public.cur_week_resources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.cur_week_resources'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.cur_week_resources;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cur_week_resources
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- stu_payment_installments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_payment_installments') THEN
    ALTER TABLE public.stu_payment_installments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.stu_payment_installments'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.stu_payment_installments;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.stu_payment_installments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- cur_session_recordings
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='cur_session_recordings') THEN
    ALTER TABLE public.cur_session_recordings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.cur_session_recordings'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.cur_session_recordings;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cur_session_recordings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- com_forum_topics
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='com_forum_topics') THEN
    ALTER TABLE public.com_forum_topics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.com_forum_topics'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.com_forum_topics;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.com_forum_topics
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- com_forum_posts
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='com_forum_posts') THEN
    ALTER TABLE public.com_forum_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.com_forum_posts'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.com_forum_posts;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.com_forum_posts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- qa_student_feedback
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qa_student_feedback') THEN
    ALTER TABLE public.qa_student_feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_updated_at' AND tgrelid='public.qa_student_feedback'::regclass) THEN
      DROP TRIGGER set_updated_at ON public.qa_student_feedback;
    END IF;
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.qa_student_feedback
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

COMMIT;