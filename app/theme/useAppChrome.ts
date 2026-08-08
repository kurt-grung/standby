import { useColorScheme } from 'react-native';

import { getAppChrome, type AppChrome } from './appChrome';

export function useAppChrome(): AppChrome {
  return getAppChrome(useColorScheme());
}
