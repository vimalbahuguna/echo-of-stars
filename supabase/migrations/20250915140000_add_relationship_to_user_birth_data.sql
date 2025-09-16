-- Add a 'relationship' column to the user_birth_data table
ALTER TABLE public.user_birth_data
ADD COLUMN relationship TEXT;
