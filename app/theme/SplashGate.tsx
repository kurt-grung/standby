import { createContext, useContext, type ReactNode } from 'react';

const SplashGateContext = createContext(true);

type SplashGateProviderProps = {
  splashVisible: boolean;
  children: ReactNode;
};

export function SplashGateProvider({ splashVisible, children }: SplashGateProviderProps) {
  return <SplashGateContext.Provider value={splashVisible}>{children}</SplashGateContext.Provider>;
}

export function useSplashVisible() {
  return useContext(SplashGateContext);
}
