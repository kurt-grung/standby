import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider, usePathname } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { AppState, DynamicColorIOS, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashBrandScreen } from '../components/SplashBrandScreen';
import { nightMode } from '../components/ultra/nightColors';
import { refreshStandbyWidgets } from '../lib/refreshStandbyWidgets';
import { ThemeProvider as StandbyThemeProvider } from '../theme/ThemeContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

const tabTint = DynamicColorIOS({
  dark: '#FFFFFF',
  light: '#000000',
});

function TabNavigation() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const tabBarHidden = pathname === '/preview';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NativeTabs minimizeBehavior="onScrollDown" tintColor={tabTint} hidden={tabBarHidden}>
        <NativeTabs.Trigger name="index" accessibilityLabel="Home" disableTransparentOnScrollEdge>
          <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
          <NativeTabs.Trigger.Label hidden />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger
          name="preview"
          accessibilityLabel="Preview"
          contentStyle={{ backgroundColor: nightMode.bg }}
          disableTransparentOnScrollEdge
        >
          <NativeTabs.Trigger.Icon
            sf={{ default: 'play.rectangle', selected: 'play.rectangle.fill' }}
            md="live_tv"
          />
          <NativeTabs.Trigger.Label hidden />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="ui" accessibilityLabel="UI" disableTransparentOnScrollEdge>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }}
            md="grid_view"
          />
          <NativeTabs.Trigger.Label hidden />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [splashVisible, setSplashVisible] = useState(true);

  const onRootLayout = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
    setSplashVisible(false);
  }, []);

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
    <SafeAreaProvider onLayout={onRootLayout}>
      <StandbyThemeProvider>
        <TabNavigation />
      </StandbyThemeProvider>
      {splashVisible ? <SplashBrandScreen /> : null}
    </SafeAreaProvider>
  );
}
