-- Fix the user_birth_data table to have proper auto-increment ID and avoid conflicts
ALTER TABLE public.user_birth_data ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS user_birth_data_id_seq;
CREATE SEQUENCE user_birth_data_id_seq OWNED BY user_birth_data.id;
ALTER TABLE public.user_birth_data ALTER COLUMN id SET DEFAULT nextval('user_birth_data_id_seq');
SELECT setval('user_birth_data_id_seq', COALESCE((SELECT MAX(id) FROM user_birth_data), 0) + 1, false);
-- Add unique constraint on user_id to prevent duplicates
ALTER TABLE public.user_birth_data ADD CONSTRAINT unique_user_birth_data UNIQUE (user_id);
