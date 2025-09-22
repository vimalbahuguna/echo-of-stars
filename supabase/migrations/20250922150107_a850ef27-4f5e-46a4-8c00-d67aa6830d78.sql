-- Insert SOS Theme Original as a system default theme
INSERT INTO public.user_themes (
  id,
  name,
  is_default,
  colors,
  gradients,
  user_id
) VALUES (
  gen_random_uuid(),
  'SOS Theme Original',
  true,
  '{
    "primary": "hsl(240 10% 3.9%)",
    "accent": "hsl(45 100% 70%)",
    "background": "hsl(240 10% 3.9%)",
    "foreground": "hsl(45 100% 95%)",
    "card": "hsl(240 5.9% 10%)",
    "cardForeground": "hsl(45 100% 95%)",
    "popover": "hsl(240 5.9% 10%)",
    "popoverForeground": "hsl(45 100% 95%)",
    "primaryForeground": "hsl(45 100% 95%)",
    "secondary": "hsl(240 3.7% 15.9%)",
    "secondaryForeground": "hsl(45 100% 95%)",
    "muted": "hsl(240 3.7% 15.9%)",
    "mutedForeground": "hsl(240 5% 64.9%)",
    "accentForeground": "hsl(240 10% 3.9%)",
    "destructive": "hsl(0 62.8% 30.6%)",
    "destructiveForeground": "hsl(45 100% 95%)",
    "border": "hsl(240 3.7% 15.9%)",
    "input": "hsl(240 3.7% 15.9%)",
    "ring": "hsl(45 100% 70%)"
  }'::jsonb,
  '{
    "backgroundGradient": "linear-gradient(135deg, hsl(240 10% 3.9%) 0%, hsl(240 5.9% 10%) 100%)",
    "foregroundGradient": "linear-gradient(135deg, hsl(45 100% 95%) 0%, hsl(45 90% 85%) 100%)",
    "primaryGradient": "linear-gradient(135deg, hsl(240 10% 3.9%) 0%, hsl(240 5.9% 10%) 100%)",
    "secondaryGradient": "linear-gradient(135deg, hsl(240 3.7% 15.9%) 0%, hsl(240 3.7% 20%) 100%)",
    "accentGradient": "linear-gradient(135deg, hsl(45 100% 70%) 0%, hsl(45 100% 80%) 100%)",
    "cardGradient": "linear-gradient(135deg, hsl(240 5.9% 10%) 0%, hsl(240 3.7% 15.9%) 100%)"
  }'::jsonb,
  NULL
);