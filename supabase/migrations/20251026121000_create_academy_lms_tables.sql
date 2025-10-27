-- Academy LMS schema: courses, lessons, enrollments, certificates
-- Safe to run on an existing project; uses IF NOT EXISTS where possible

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  level text check (level in ('beginner','intermediate','advanced')) default 'beginner',
  category text check (category in ('astrology','meditation','sanskrit','scriptures')) not null,
  language text default 'en',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  slug text unique not null,
  content text,
  order_index int not null default 0,
  duration_minutes int,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Enrollments
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  progress_percent numeric(5,2) default 0,
  completed boolean default false,
  started_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, course_id)
);
-- Certificates
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  issued_at timestamptz not null default now(),
  certificate_number text unique,
  metadata jsonb default '{}'::jsonb
);
-- Lesson Completions (optional granular progress)
create table if not exists public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
-- RLS enablement
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.certificates enable row level security;
alter table public.lesson_completions enable row level security;
-- Policies: allow read for authenticated users; write constrained to owner relations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'courses_read_authenticated'
      AND c.relname = 'courses'
      AND n.nspname = 'public'
  ) THEN
    create policy "courses_read_authenticated" on public.courses
      for select using (auth.uid() is not null);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'lessons_read_authenticated'
      AND c.relname = 'lessons'
      AND n.nspname = 'public'
  ) THEN
    create policy "lessons_read_authenticated" on public.lessons
      for select using (auth.uid() is not null);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'enrollments_read_own'
      AND c.relname = 'enrollments'
      AND n.nspname = 'public'
  ) THEN
    create policy "enrollments_read_own" on public.enrollments
      for select using (user_id = auth.uid());
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'certificates_read_own'
      AND c.relname = 'certificates'
      AND n.nspname = 'public'
  ) THEN
    create policy "certificates_read_own" on public.certificates
      for select using (user_id = auth.uid());
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'lesson_completions_read_own'
      AND c.relname = 'lesson_completions'
      AND n.nspname = 'public'
  ) THEN
    create policy "lesson_completions_read_own" on public.lesson_completions
      for select using (user_id = auth.uid());
  END IF;
END $$;
-- Insert policies for writes (users can manage their own progress)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'enrollments_insert_self'
      AND c.relname = 'enrollments'
      AND n.nspname = 'public'
  ) THEN
    create policy "enrollments_insert_self" on public.enrollments
      for insert with check (user_id = auth.uid());
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'enrollments_update_self'
      AND c.relname = 'enrollments'
      AND n.nspname = 'public'
  ) THEN
    create policy "enrollments_update_self" on public.enrollments
      for update using (user_id = auth.uid()) with check (user_id = auth.uid());
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'lesson_completions_insert_self'
      AND c.relname = 'lesson_completions'
      AND n.nspname = 'public'
  ) THEN
    create policy "lesson_completions_insert_self" on public.lesson_completions
      for insert with check (user_id = auth.uid());
  END IF;
END $$;
-- Admin roles can manage courses and lessons (assuming 'service_role' on server side)
-- For client-side, we restrict to read only; writes are expected via admin backend.;
