import { useEffectiveColorScheme } from './AppearanceContext';
import { getAppChrome, type AppChrome } from './appChrome';

export function useAppChrome(): AppChrome {
  const effectiveScheme = useEffectiveColorScheme();
  return getAppChrome(effectiveScheme);
}
