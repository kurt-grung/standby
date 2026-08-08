import '../global.css';

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { refreshStandbyWidgets } from '../lib/refreshStandbyWidgets';
import { ThemeProvider } from '../theme/ThemeContext';

export default function RootLayout() {
  useEffect(() => {
    refreshStandbyWidgets();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshStandbyWidgets();
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="ui" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
