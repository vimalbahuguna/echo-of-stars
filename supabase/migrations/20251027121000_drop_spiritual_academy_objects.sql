-- Drop legacy Spiritual Academy / LMS objects, keeping Vedic mappings intact
BEGIN;

-- Drop policies (safe-if-exist)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE 'spa_%'
  ) THEN
    -- Drop any spa_* policies generically
    -- Note: PostgreSQL requires explicit policy names; we attempt known patterns
    BEGIN
      EXECUTE 'ALTER TABLE public.spa_modules DROP POLICY IF EXISTS spa_modules_read';
      EXECUTE 'ALTER TABLE public.spa_modules DROP POLICY IF EXISTS spa_modules_manage';
      EXECUTE 'ALTER TABLE public.spa_levels DROP POLICY IF EXISTS spa_levels_read';
      EXECUTE 'ALTER TABLE public.spa_levels DROP POLICY IF EXISTS spa_levels_manage';
      EXECUTE 'ALTER TABLE public.spa_months DROP POLICY IF EXISTS spa_months_read';
      EXECUTE 'ALTER TABLE public.spa_months DROP POLICY IF EXISTS spa_months_manage';
      EXECUTE 'ALTER TABLE public.spa_weeks DROP POLICY IF EXISTS spa_weeks_read';
      EXECUTE 'ALTER TABLE public.spa_weeks DROP POLICY IF EXISTS spa_weeks_manage';
      EXECUTE 'ALTER TABLE public.spa_topics DROP POLICY IF EXISTS spa_topics_read';
      EXECUTE 'ALTER TABLE public.spa_topics DROP POLICY IF EXISTS spa_topics_manage';
    EXCEPTION WHEN others THEN NULL; END;
  END IF;
END $$;

-- Drop spa_* tables if present
DROP TABLE IF EXISTS public.spa_topics CASCADE;
DROP TABLE IF EXISTS public.spa_weeks CASCADE;
DROP TABLE IF EXISTS public.spa_months CASCADE;
DROP TABLE IF EXISTS public.spa_levels CASCADE;
DROP TABLE IF EXISTS public.spa_modules CASCADE;

-- Drop older Academy/LMS tables/policies/functions from previous iterations
DROP TABLE IF EXISTS public.academy_modules CASCADE;
DROP TABLE IF EXISTS public.academy_levels CASCADE;
DROP TABLE IF EXISTS public.academy_months CASCADE;
DROP TABLE IF EXISTS public.academy_weeks CASCADE;
DROP TABLE IF EXISTS public.academy_topics CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.course_enrollments CASCADE;
DROP TABLE IF EXISTS public.student_progress CASCADE;
DROP TABLE IF EXISTS public.faculty CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;

-- Drop helper function/trigger if exists
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;

-- Preserve Vedic mappings table explicitly
-- NOTE: Intentionally NOT dropping public.topic_to_lesson_mappings

COMMIT;