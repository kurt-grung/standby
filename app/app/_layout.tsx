import '../global.css';

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { refreshStandbyWidgets } from '../lib/refreshStandbyWidgets';
import { ThemeProvider } from '../theme/ThemeContext';
import { useAppChrome } from '../theme/useAppChrome';

function RootNavigation() {
  const chrome = useAppChrome();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: chrome.colors.bg },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="ui" />
    </Stack>
  );
}

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
        <RootNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
