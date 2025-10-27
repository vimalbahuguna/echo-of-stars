-- Vedic Academy: Communication & Engagement domain
BEGIN;

-- Session recordings for live sessions
CREATE TABLE IF NOT EXISTS public.cur_session_recordings (
  recording_id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.cur_sessions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  duration_minutes INTEGER,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_session_recordings_session ON public.cur_session_recordings(session_id);

-- Discussion forum topics
CREATE TABLE IF NOT EXISTS public.com_forum_topics (
  topic_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  level_id BIGINT REFERENCES public.cur_certification_levels(level_id) ON DELETE SET NULL,
  week_id BIGINT REFERENCES public.cur_weeks(week_id) ON DELETE SET NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_forum_topics_level ON public.com_forum_topics(level_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_week ON public.com_forum_topics(week_id);

-- Discussion forum posts
CREATE TABLE IF NOT EXISTS public.com_forum_posts (
  post_id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT NOT NULL REFERENCES public.com_forum_topics(topic_id) ON DELETE CASCADE,
  author_membership_id UUID,
  parent_post_id BIGINT REFERENCES public.com_forum_posts(post_id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic ON public.com_forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent ON public.com_forum_posts(parent_post_id);

COMMIT;