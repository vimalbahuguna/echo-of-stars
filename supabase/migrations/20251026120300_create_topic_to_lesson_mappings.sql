-- Topic-to-Lesson mapping table for reliable linking and multilingual support
-- Supports certification levels and language-specific topic text

BEGIN;

CREATE TABLE IF NOT EXISTS public.topic_to_lesson_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT DEFAULT 'en',
  certification_level TEXT NOT NULL CHECK (certification_level IN ('foundation','practitioner','professional','master')),
  month_number INT, -- optional: which month the topic belongs to
  week_start INT,   -- optional: starting week number
  week_end INT,     -- optional: ending week number
  topic_key TEXT,   -- optional: normalized key for matching
  topic_text TEXT NOT NULL, -- display text in given language
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  lesson_slug TEXT, -- alternative to lesson_id for direct linking
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_topic_mappings_level_lang ON public.topic_to_lesson_mappings(certification_level, language);
CREATE INDEX IF NOT EXISTS idx_topic_mappings_text ON public.topic_to_lesson_mappings(topic_text);

ALTER TABLE public.topic_to_lesson_mappings ENABLE ROW LEVEL SECURITY;

-- Minimal policies: allow reads to all; restrict writes to admins
CREATE POLICY "Public read topic mappings" ON public.topic_to_lesson_mappings
  FOR SELECT USING (true);

-- Admins/faculty manage: leverage existing helper for tenant role if available; otherwise allow only authenticated users
CREATE POLICY "Admins/faculty manage topic mappings" ON public.topic_to_lesson_mappings
  FOR ALL USING (
    COALESCE(public.get_current_user_role(), 'end_user') IN ('super_admin','tenant_admin','organization_admin')
  ) WITH CHECK (
    COALESCE(public.get_current_user_role(), 'end_user') IN ('super_admin','tenant_admin','organization_admin')
  );

COMMIT;