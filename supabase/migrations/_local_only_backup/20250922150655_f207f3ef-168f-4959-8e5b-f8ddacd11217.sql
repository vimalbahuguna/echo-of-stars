-- Update RLS policy to allow reading system themes (default themes with user_id = null)
DROP POLICY IF EXISTS "Users can view their own themes." ON public.user_themes;

CREATE POLICY "Users can view their own themes and system themes" 
ON public.user_themes 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR (user_id IS NULL AND is_default = true)
);