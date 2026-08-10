import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  usePathname,
} from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { dynamicSystemColor } from '../../lib/dynamicSystemColor';
import { ThemeProvider as StandbyThemeProvider } from '../../theme/ThemeContext';
import { WebNativeTabBar } from '../../ui/WebNativeTabBar';
import { nightMode } from '../../ui/ultra/nightColors';

const tabTint = dynamicSystemColor({
  dark: '#FFFFFF',
  light: '#000000',
});

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const tabBarHidden = pathname === '/preview';

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    if (tabBarHidden) {
      void ScreenOrientation.unlockAsync();
      return;
    }

    void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, [tabBarHidden]);

  return (
    <StandbyThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
        {Platform.OS === 'web' && !tabBarHidden ? <WebNativeTabBar /> : null}
      </NavigationThemeProvider>
    </StandbyThemeProvider>
  );
}
