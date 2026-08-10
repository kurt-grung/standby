import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Easing, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import { standbyConfig } from '../config';

type SplashGateContextValue = {
  splashVisible: boolean;
  reveal: SharedValue<number>;
  beginHomeReveal: () => void;
};

const SplashGateContext = createContext<SplashGateContextValue | null>(null);

type SplashGateProviderProps = {
  splashVisible: boolean;
  children: ReactNode;
};

export function SplashGateProvider({ splashVisible, children }: SplashGateProviderProps) {
  const reveal = useSharedValue(0);

  const beginHomeReveal = useCallback(() => {
    reveal.value = withTiming(1, {
      duration: standbyConfig.launch.homeRevealDurationMs,
      easing: Easing.out(Easing.cubic),
    });
  }, [reveal]);

  useEffect(() => {
    if (!splashVisible) {
      beginHomeReveal();
    }
  }, [splashVisible, beginHomeReveal]);

  const value = useMemo(
    () => ({ splashVisible, reveal, beginHomeReveal }),
    [splashVisible, reveal, beginHomeReveal],
  );

  return <SplashGateContext.Provider value={value}>{children}</SplashGateContext.Provider>;
}

function useSplashGateContext() {
  const value = useContext(SplashGateContext);
  if (!value) {
    throw new Error('SplashGate hooks must be used within SplashGateProvider');
  }
  return value;
}

export function useSplashVisible() {
  return useSplashGateContext().splashVisible;
}

export function useHomeRevealProgress() {
  return useSplashGateContext().reveal;
}

export function useBeginHomeReveal() {
  return useSplashGateContext().beginHomeReveal;
}
