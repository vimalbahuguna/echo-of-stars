-- Vedic Academy: Seed minimal data for UI verification (guarded)
BEGIN;

-- Seed example resources
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='res_types') THEN
    -- Ensure types exist
    INSERT INTO public.res_types(type_name)
      SELECT t FROM (VALUES ('video'),('document'),('quiz'),('link')) AS v(t)
      ON CONFLICT DO NOTHING;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='res_resources') THEN
    -- Insert example resources using existing type_ids
    INSERT INTO public.res_resources(type_id, title, description, url, duration_minutes, metadata)
    SELECT type_id, title, description, url, duration_minutes, metadata
    FROM (
      SELECT (SELECT type_id FROM public.res_types WHERE type_name='video' LIMIT 1) AS type_id,
             'Intro to Jyotish' AS title,
             'A short welcome video for the Vedic Academy' AS description,
             'https://cdn.example.com/vedic/intro.mp4' AS url,
             5 AS duration_minutes,
             '{}'::jsonb AS metadata
      UNION ALL
      SELECT (SELECT type_id FROM public.res_types WHERE type_name='document' LIMIT 1) AS type_id,
             'Beginner Syllabus' AS title,
             'PDF syllabus for Level 1' AS description,
             'https://cdn.example.com/vedic/level1.pdf' AS url,
             NULL::int AS duration_minutes,
             '{}'::jsonb AS metadata
    ) AS seed
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Seed forum topic and a post
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='com_forum_topics') THEN
    INSERT INTO public.com_forum_topics(title, description, created_by)
    VALUES ('Welcome to Vedic Academy', 'Introduce yourself and share what you wish to learn.', NULL)
    ON CONFLICT DO NOTHING;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='com_forum_posts') THEN
    INSERT INTO public.com_forum_posts(topic_id, author_membership_id, content)
    SELECT t.topic_id, NULL::uuid, 'Namaste! Excited to begin my journey.'
    FROM public.com_forum_topics t
    WHERE t.title = 'Welcome to Vedic Academy'
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

COMMIT;