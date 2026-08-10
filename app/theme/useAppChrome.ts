import { useAppearance } from './AppearanceContext';
import { getAppChrome, type AppChrome } from './appChrome';

export function useAppChrome(): AppChrome {
  const { mode } = useAppearance();
  return getAppChrome(mode);
}
