import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { defaultThemeId, type StandbyTheme, type ThemeId, themes } from './themes';

type ThemeContextValue = {
  theme: StandbyTheme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultThemeId);
  const value = useMemo(
    () => ({
      theme: themes[themeId],
      themeId,
      setThemeId,
    }),
    [themeId],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
