import '../global.css';

import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { AppState, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashBrandScreen } from '../ui/SplashBrandScreen';
import { WebPhoneFrame } from '../ui/WebPhoneFrame';
import { standbyConfig } from '../config';
import { disableDevToolsButton } from '../lib/disableDevToolsButton';
import { refreshStandbyWidgets } from '../lib/refreshStandbyWidgets';
import { useSyncWebColorScheme } from '../lib/syncWebColorScheme';
import { SplashGateProvider } from '../theme/SplashGate';
import { ThemeProvider as StandbyThemeProvider } from '../theme/ThemeContext';
import { WidgetConfigProvider } from '../theme/WidgetConfigContext';

SplashScreen.preventAutoHideAsync().catch(() => {});
disableDevToolsButton();

export default function RootLayout() {
  const router = useRouter();
  const [splashVisible, setSplashVisible] = useState(true);
  useSyncWebColorScheme();

  const onSplashFinish = useCallback(() => {
    setSplashVisible(false);
  }, []);

  useEffect(() => {
    router.replace(standbyConfig.launch.initialRoute);
  }, [router]);

  useEffect(() => {
    disableDevToolsButton();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshStandbyWidgets();
        disableDevToolsButton();
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StandbyThemeProvider>
        <WidgetConfigProvider>
          <SplashGateProvider splashVisible={splashVisible}>
            <WebPhoneFrame>
              <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="configure"
                    options={{
                      presentation: 'modal',
                      animation: 'slide_from_bottom',
                    }}
                  />
                </Stack>
                {splashVisible ? <SplashBrandScreen onFinish={onSplashFinish} /> : null}
              </View>
            </WebPhoneFrame>
          </SplashGateProvider>
        </WidgetConfigProvider>
      </StandbyThemeProvider>
    </SafeAreaProvider>
  );
}
