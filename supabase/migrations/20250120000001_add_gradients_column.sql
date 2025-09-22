-- Add gradients column to user_themes table
ALTER TABLE public.user_themes 
ADD COLUMN IF NOT EXISTS gradients jsonb NOT NULL DEFAULT '{}';

-- Update existing records to have default gradients if they don't have any
UPDATE public.user_themes 
SET gradients = '{
  "backgroundGradient": "linear-gradient(135deg, hsl(240 100% 2%) 0%, hsl(240 50% 8%) 100%)",
  "foregroundGradient": "linear-gradient(135deg, hsl(45 100% 95%) 0%, hsl(45 90% 92%) 100%)",
  "primaryGradient": "linear-gradient(135deg, hsl(45 100% 65%) 0%, hsl(45 100% 75%) 100%)",
  "secondaryGradient": "linear-gradient(135deg, hsl(270 60% 35%) 0%, hsl(270 60% 45%) 100%)",
  "accentGradient": "linear-gradient(135deg, hsl(220 100% 50%) 0%, hsl(220 100% 60%) 100%)",
  "cardGradient": "linear-gradient(135deg, hsl(240 50% 8%) 0%, hsl(240 40% 12%) 100%)"
}'::jsonb
WHERE gradients IS NULL OR gradients = '{}'::jsonb;