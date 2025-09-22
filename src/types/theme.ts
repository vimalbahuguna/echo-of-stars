export interface GradientColors {
  backgroundGradient: string;
  foregroundGradient: string;
  primaryGradient: string;
  secondaryGradient: string;
  accentGradient: string;
  cardGradient: string;
}

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface Theme {
  id?: string; // Supabase ID
  user_id?: string; // Supabase user ID
  name: string;
  is_default: boolean; // Whether this is a system default theme or user-created
  colors: ThemeColors;
  gradients?: GradientColors; // Optional gradient colors
  created_at?: string;
}