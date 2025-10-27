-- Vedic Academy: Learning Resources domain
BEGIN;

-- Resource Types
CREATE TABLE IF NOT EXISTS public.res_types (
  type_id SMALLSERIAL PRIMARY KEY,
  type_name VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO public.res_types(type_name)
  SELECT t FROM (VALUES ('video'),('document'),('quiz'),('link')) AS v(t)
  ON CONFLICT DO NOTHING;

-- Resource Library with metadata
CREATE TABLE IF NOT EXISTS public.res_resources (
  resource_id BIGSERIAL PRIMARY KEY,
  type_id SMALLINT NOT NULL REFERENCES public.res_types(type_id) ON DELETE RESTRICT,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  url TEXT,
  duration_minutes INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.res_resources(type_id);

-- Week-Resource mappings
CREATE TABLE IF NOT EXISTS public.cur_week_resources (
  id BIGSERIAL PRIMARY KEY,
  week_id BIGINT NOT NULL REFERENCES public.cur_weeks(week_id) ON DELETE CASCADE,
  resource_id BIGINT NOT NULL REFERENCES public.res_resources(resource_id) ON DELETE CASCADE,
  ordering INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (week_id, resource_id)
);
CREATE INDEX IF NOT EXISTS idx_week_resources_week ON public.cur_week_resources(week_id);
CREATE INDEX IF NOT EXISTS idx_week_resources_resource ON public.cur_week_resources(resource_id);

COMMIT;