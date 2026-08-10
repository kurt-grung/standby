import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { resolveEffectiveColorScheme, type AppearanceMode } from './appearance';

type AppearanceContextValue = {
  mode: AppearanceMode;
  setMode: (mode: AppearanceMode) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<AppearanceMode>('system');
  const effectiveScheme = resolveEffectiveColorScheme(mode, systemScheme);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', effectiveScheme === 'dark');
    }
  }, [effectiveScheme]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
    }),
    [mode],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return context;
}

export function useEffectiveColorScheme() {
  const { mode } = useAppearance();
  const systemScheme = useColorScheme();
  return resolveEffectiveColorScheme(mode, systemScheme);
}
