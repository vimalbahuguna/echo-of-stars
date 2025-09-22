import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeManager } from '@/hooks/useThemeManager';
import { Theme } from '@/types/theme';

interface ThemeContextType {
  themes: Theme[];
  activeTheme: Theme;
  isLoadingThemes: boolean;
  addOrUpdateTheme: (theme: Theme) => Promise<boolean | undefined>;
  deleteTheme: (themeId: string) => Promise<boolean | undefined>;
  selectActiveTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeManager = useThemeManager();

  return (
    <ThemeContext.Provider value={themeManager}>
      {children}
    </ThemeContext.Provider>
  );
};