-- Drop the existing unique constraint that prevents multiple birth records per user
ALTER TABLE public.user_birth_data DROP CONSTRAINT IF EXISTS unique_user_birth_data;
-- Create a composite unique index to prevent exact duplicates while allowing multiple family members
CREATE UNIQUE INDEX IF NOT EXISTS unique_birth_data_composite 
ON public.user_birth_data (user_id, lower(name), date, time, lower(location));
-- Add a comment to explain the constraint
COMMENT ON INDEX unique_birth_data_composite IS 'Prevents exact duplicate birth records while allowing multiple family members per user';
