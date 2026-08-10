import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { webPhoneSafeArea } from '../design-system';

export function useStandbySafeAreaInsets() {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'web') {
    return webPhoneSafeArea;
  }

  return insets;
}
