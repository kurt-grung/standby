import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

export function useSyncWebColorScheme() {
  const scheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle('dark', scheme === 'dark');
  }, [scheme]);
}
