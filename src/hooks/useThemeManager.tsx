import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Theme, ThemeColors, GradientColors } from "@/types/theme";

const DEFAULT_GRADIENT_COLORS: GradientColors = {
  backgroundGradient: "linear-gradient(135deg, hsl(240 100% 2%) 0%, hsl(240 50% 8%) 100%)",
  foregroundGradient: "linear-gradient(135deg, hsl(45 100% 95%) 0%, hsl(45 90% 92%) 100%)",
  primaryGradient: "linear-gradient(135deg, hsl(45 100% 65%) 0%, hsl(45 100% 75%) 100%)",
  secondaryGradient: "linear-gradient(135deg, hsl(270 60% 35%) 0%, hsl(270 60% 45%) 100%)",
  accentGradient: "linear-gradient(135deg, hsl(220 100% 50%) 0%, hsl(220 100% 60%) 100%)",
  cardGradient: "linear-gradient(135deg, hsl(240 50% 8%) 0%, hsl(240 40% 12%) 100%)",
};

const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: "hsl(222.2 47.4% 11.2%)",
  accent: "hsl(217.2 91.2% 59.8%)",
  background: "hsl(222.2 84% 4.9%)",
  foreground: "hsl(210 40% 98%)",
  card: "hsl(222.2 47.4% 11.2%)",
  cardForeground: "hsl(210 40% 98%)",
  popover: "hsl(222.2 47.4% 11.2%)",
  popoverForeground: "hsl(210 40% 98%)",
  primaryForeground: "hsl(210 40% 98%)",
  secondary: "hsl(217.2 32.4% 17.5%)",
  secondaryForeground: "hsl(210 40% 98%)",
  muted: "hsl(217.2 32.4% 17.5%)",
  mutedForeground: "hsl(218 2.2% 67.5%)",
  accentForeground: "hsl(210 40% 98%)",
  destructive: "hsl(0 62.8% 30.6%)",
  destructiveForeground: "hsl(210 40% 98%)",
  border: "hsl(217.2 32.4% 17.5%)",
  input: "hsl(217.2 32.4% 17.5%)",
  ring: "hsl(217.2 91.2% 59.8%)",
};

const SYSTEM_DEFAULT_THEME: Theme = {
  name: "Default Dark",
  is_default: true,
  colors: DEFAULT_THEME_COLORS,
  gradients: DEFAULT_GRADIENT_COLORS,
};

export const useThemeManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme>(SYSTEM_DEFAULT_THEME);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);

  const applyThemeToDOM = useCallback((theme: Theme) => {
    const root = document.documentElement;
    
    // Map theme color keys to CSS variable names
    const cssVariableMap: Record<string, string> = {
      primary: '--primary',
      accent: '--accent', 
      background: '--background',
      foreground: '--foreground',
      card: '--card',
      cardForeground: '--card-foreground',
      popover: '--popover',
      popoverForeground: '--popover-foreground',
      primaryForeground: '--primary-foreground',
      secondary: '--secondary',
      secondaryForeground: '--secondary-foreground',
      muted: '--muted',
      mutedForeground: '--muted-foreground',
      accentForeground: '--accent-foreground',
      destructive: '--destructive',
      destructiveForeground: '--destructive-foreground',
      border: '--border',
      input: '--input',
      ring: '--ring',
    };

    // Map gradient keys to CSS variable names
    const gradientVariableMap: Record<string, string> = {
      backgroundGradient: '--gradient-background',
      foregroundGradient: '--gradient-foreground',
      primaryGradient: '--gradient-primary',
      secondaryGradient: '--gradient-secondary',
      accentGradient: '--gradient-accent',
      cardGradient: '--gradient-card',
    };

    // Apply color variables
    for (const [key, value] of Object.entries(theme.colors)) {
      const cssVar = cssVariableMap[key];
      if (cssVar) {
        // Convert HSL string to just the values (remove 'hsl(' and ')')
        const hslValues = value.replace(/hsl\(|\)/g, '');
        root.style.setProperty(cssVar, hslValues);
      }
    }
    
    // Apply gradient variables if they exist
    if (theme.gradients) {
      for (const [key, value] of Object.entries(theme.gradients)) {
        const cssVar = gradientVariableMap[key];
        if (cssVar) {
          root.style.setProperty(cssVar, value);
        }
      }
    }
    
    localStorage.setItem("activeThemeId", theme.id || "default");
    setActiveTheme(theme);
  }, []);

  const fetchThemes = useCallback(async () => {
    setIsLoadingThemes(true);
    if (!user) {
      setThemes([SYSTEM_DEFAULT_THEME]);
      applyThemeToDOM(SYSTEM_DEFAULT_THEME);
      setIsLoadingThemes(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_themes' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching themes:", error);
      toast({ title: "Error", description: "Failed to load themes.", variant: "destructive" });
      setThemes([SYSTEM_DEFAULT_THEME]);
      applyThemeToDOM(SYSTEM_DEFAULT_THEME);
    } else {
      const userThemes = (data as any[]).map((theme: any) => ({
        id: theme.id,
        name: theme.name,
        is_default: theme.is_default || false,
        colors: theme.colors as ThemeColors,
        gradients: theme.gradients as GradientColors || DEFAULT_GRADIENT_COLORS
      })) as Theme[];
      const allThemes = [SYSTEM_DEFAULT_THEME, ...userThemes];
      setThemes(allThemes);

      const savedThemeId = localStorage.getItem("activeThemeId");
      const themeToApply = allThemes.find(t => t.id === savedThemeId) || SYSTEM_DEFAULT_THEME;
      applyThemeToDOM(themeToApply);
    }
    setIsLoadingThemes(false);
  }, [user, applyThemeToDOM, toast]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const addOrUpdateTheme = useCallback(async (theme: Theme) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save themes.", variant: "destructive" });
      return;
    }

    const themeData = { 
      name: theme.name,
      colors: theme.colors as any,
      gradients: theme.gradients as any || DEFAULT_GRADIENT_COLORS,
      user_id: user.id 
    };
    let error;
    if (theme.id) {
      // Update existing theme
      const { error: updateError } = await supabase
        .from('user_themes' as any)
        .update({
          name: themeData.name,
          colors: themeData.colors,
          gradients: themeData.gradients
        })
        .eq('id', theme.id)
        .eq('user_id', user.id);
      error = updateError;
    } else {
      // Add new theme
      const { error: insertError } = await supabase
        .from('user_themes' as any)
        .insert(themeData);
      error = insertError;
    }

    if (error) {
      console.error("Error saving theme:", error);
      toast({ title: "Error", description: `Failed to save theme: ${error.message}`, variant: "destructive" });
      return false;
    } else {
      toast({ title: "Success", description: "Theme saved successfully!" });
      fetchThemes(); // Re-fetch themes to update the list
      return true;
    }
  }, [user, fetchThemes, toast]);

  const deleteTheme = useCallback(async (themeId: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to delete themes.", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('user_themes' as any)
      .delete()
      .eq('id', themeId)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error deleting theme:", error);
      toast({ title: "Error", description: `Failed to delete theme: ${error.message}`, variant: "destructive" });
      return false;
    } else {
      toast({ title: "Success", description: "Theme deleted successfully!" });
      fetchThemes(); // Re-fetch themes to update the list
      // If the deleted theme was active, revert to default
      if (activeTheme.id === themeId) {
        applyThemeToDOM(SYSTEM_DEFAULT_THEME);
      }
      return true;
    }
  }, [user, activeTheme, applyThemeToDOM, fetchThemes, toast]);

  const selectActiveTheme = useCallback((theme: Theme) => {
    applyThemeToDOM(theme);
    toast({ title: "Theme Applied", description: `Theme "${theme.name}" has been applied.` });
  }, [applyThemeToDOM, toast]);

  return {
    themes,
    activeTheme,
    isLoadingThemes,
    addOrUpdateTheme,
    deleteTheme,
    selectActiveTheme,
  };
};
