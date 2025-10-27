-- Vedic Academy: Add RLS policies to sensitive tables (guarded, minimal defaults)
BEGIN;

-- Helper: enable RLS if table exists
DO $$ BEGIN
  -- com_forum_topics
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='com_forum_topics') THEN
    ALTER TABLE public.com_forum_topics ENABLE ROW LEVEL SECURITY;
    -- Read for authenticated users
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'forum_topics_read_authenticated' AND c.relname = 'com_forum_topics' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY forum_topics_read_authenticated ON public.com_forum_topics
        FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    -- Writes restricted to service role
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'forum_topics_write_service' AND c.relname = 'com_forum_topics' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY forum_topics_write_service ON public.com_forum_topics
        FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;

  -- com_forum_posts
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='com_forum_posts') THEN
    ALTER TABLE public.com_forum_posts ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'forum_posts_read_authenticated' AND c.relname = 'com_forum_posts' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY forum_posts_read_authenticated ON public.com_forum_posts
        FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'forum_posts_write_service' AND c.relname = 'com_forum_posts' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY forum_posts_write_service ON public.com_forum_posts
        FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;

  -- stu_payment_installments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stu_payment_installments') THEN
    ALTER TABLE public.stu_payment_installments ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'installments_read_service' AND c.relname = 'stu_payment_installments' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY installments_read_service ON public.stu_payment_installments
        FOR SELECT USING (auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'installments_write_service' AND c.relname = 'stu_payment_installments' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY installments_write_service ON public.stu_payment_installments
        FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;

  -- asm_assessment_results
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='asm_assessment_results') THEN
    ALTER TABLE public.asm_assessment_results ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'assessment_results_read_authenticated' AND c.relname = 'asm_assessment_results' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY assessment_results_read_authenticated ON public.asm_assessment_results
        FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'assessment_results_write_service' AND c.relname = 'asm_assessment_results' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY assessment_results_write_service ON public.asm_assessment_results
        FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;

  -- cert_certifications_awarded
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='cert_certifications_awarded') THEN
    ALTER TABLE public.cert_certifications_awarded ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'cert_awarded_read_authenticated' AND c.relname = 'cert_certifications_awarded' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY cert_awarded_read_authenticated ON public.cert_certifications_awarded
        FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'cert_awarded_write_service' AND c.relname = 'cert_certifications_awarded' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY cert_awarded_write_service ON public.cert_certifications_awarded
        FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
  END IF;

  -- qa_student_feedback
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='qa_student_feedback') THEN
    ALTER TABLE public.qa_student_feedback ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'student_feedback_read_service' AND c.relname = 'qa_student_feedback' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY student_feedback_read_service ON public.qa_student_feedback
        FOR SELECT USING (auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE p.polname = 'student_feedback_insert_authenticated' AND c.relname = 'qa_student_feedback' AND n.nspname = 'public'
    ) THEN
      CREATE POLICY student_feedback_insert_authenticated ON public.qa_student_feedback
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
  END IF;
END $$;

COMMIT;