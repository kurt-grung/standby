import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useEffect, useMemo, useState } from 'react';
import { AppState, DynamicColorIOS, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { nightMode } from '../components/ultra/nightColors';
import { refreshStandbyWidgets } from '../lib/refreshStandbyWidgets';
import { TabBarContext } from '../theme/TabBarContext';
import { ThemeProvider as StandbyThemeProvider } from '../theme/ThemeContext';

const tabTint = DynamicColorIOS({
  dark: '#FFFFFF',
  light: '#000000',
});

function TabNavigation() {
  const colorScheme = useColorScheme();
  const [tabBarHidden, setTabBarHidden] = useState(false);
  const tabBarContext = useMemo(() => ({ setHidden: setTabBarHidden }), []);

  return (
    <TabBarContext value={tabBarContext}>
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
    </TabBarContext>
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
      <StandbyThemeProvider>
        <TabNavigation />
      </StandbyThemeProvider>
    </SafeAreaProvider>
  );
}
