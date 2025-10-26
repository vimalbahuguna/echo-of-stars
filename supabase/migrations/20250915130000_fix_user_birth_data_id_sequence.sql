-- This migration fixes the auto-incrementing ID on the user_birth_data table.
-- It ensures a sequence is correctly attached and the default value is set.

-- 1. Drop any existing incorrect default on the 'id' column.
ALTER TABLE public.user_birth_data ALTER COLUMN id DROP DEFAULT;
-- 2. Create a sequence for the 'id' column if it doesn't exist.
CREATE SEQUENCE IF NOT EXISTS user_birth_data_id_seq;
-- 3. Set the default value of the 'id' column to use the sequence.
ALTER TABLE public.user_birth_data ALTER COLUMN id SET DEFAULT nextval('user_birth_data_id_seq');
-- 4. Make sure the sequence is owned by the 'id' column.
ALTER SEQUENCE user_birth_data_id_seq OWNED BY public.user_birth_data.id;
-- 5. Set the sequence's current value to be one greater than the max existing id.
-- This prevents errors if there's already data in the table.
SELECT setval('user_birth_data_id_seq', COALESCE((SELECT MAX(id) FROM public.user_birth_data), 0) + 1, false);
