-- Step 1: Remove the incorrect unique constraint on user_id
ALTER TABLE public.user_birth_data DROP CONSTRAINT IF EXISTS unique_user_birth_data;
-- Step 2: Create RLS policies for user_birth_data

-- Policy for SELECT: Users can read their own birth data
CREATE POLICY "Allow individual read access"
ON public.user_birth_data
FOR SELECT
USING (auth.uid() = user_id);
-- Policy for INSERT: Users can insert their own birth data
CREATE POLICY "Allow individual insert access"
ON public.user_birth_data
FOR INSERT
WITH CHECK (auth.uid() = user_id);
-- Policy for UPDATE: Users can update their own birth data
CREATE POLICY "Allow individual update access"
ON public.user_birth_data
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
-- Policy for DELETE: Users can delete their own birth data
CREATE POLICY "Allow individual delete access"
ON public.user_birth_data
FOR DELETE
USING (auth.uid() = user_id);
