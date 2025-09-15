-- Fix the user_birth_data table identity column issue
ALTER TABLE public.user_birth_data ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE public.user_birth_data ALTER COLUMN id SET DEFAULT nextval(pg_get_serial_sequence('user_birth_data', 'id'));

-- Add unique constraint on user_id to prevent duplicates
ALTER TABLE public.user_birth_data DROP CONSTRAINT IF EXISTS unique_user_birth_data;
ALTER TABLE public.user_birth_data ADD CONSTRAINT unique_user_birth_data UNIQUE (user_id);