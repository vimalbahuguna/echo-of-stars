import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Theme, ThemeColors } from "@/types/theme";

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
};

export const useThemeManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme>(SYSTEM_DEFAULT_THEME);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);

  const applyThemeToDOM = useCallback((theme: Theme) => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme.colors)) {
      root.style.setProperty(`--${key}`, value);
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
      .from('user_themes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching themes:", error);
      toast({ title: "Error", description: "Failed to load themes.", variant: "destructive" });
      setThemes([SYSTEM_DEFAULT_THEME]);
      applyThemeToDOM(SYSTEM_DEFAULT_THEME);
    } else {
      const userThemes = data as Theme[];
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

    const themeData = { ...theme, user_id: user.id };
    let error;
    if (theme.id) {
      // Update existing theme
      const { error: updateError } = await supabase
        .from('user_themes')
        .update(themeData)
        .eq('id', theme.id)
        .eq('user_id', user.id);
      error = updateError;
    } else {
      // Add new theme
      const { error: insertError } = await supabase
        .from('user_themes')
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
      .from('user_themes')
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
