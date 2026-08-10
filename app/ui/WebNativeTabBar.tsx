import { usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import { SfSymbolIcon } from './SfSymbolIcon';

type WebTab = {
  href: '/' | '/preview' | '/settings';
  accessibilityLabel: string;
  icon: SFSymbol;
  selectedIcon: SFSymbol;
  isActive: (pathname: string) => boolean;
};

const webTabs: WebTab[] = [
  {
    href: '/',
    accessibilityLabel: 'Home',
    icon: 'house',
    selectedIcon: 'house.fill',
    isActive: (pathname) => pathname === '/' || pathname === '/index',
  },
  {
    href: '/preview',
    accessibilityLabel: 'Preview',
    icon: 'play.rectangle',
    selectedIcon: 'play.rectangle.fill',
    isActive: (pathname) => pathname === '/preview',
  },
  {
    href: '/settings',
    accessibilityLabel: 'Settings',
    icon: 'gearshape',
    selectedIcon: 'gearshape.fill',
    isActive: (pathname) => pathname === '/settings' || pathname.startsWith('/settings/'),
  },
];

const tabIconSize = 20;
const tabInactiveColor = '#8b8b8b';
const tabActiveColor = '#ffffff';

export function WebNativeTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View nativeID="standby-web-tab-bar" style={styles.root} pointerEvents="box-none">
      <View style={styles.pill}>
        {webTabs.map((tab) => {
          const active = tab.isActive(pathname);
          return (
            <Pressable
              key={tab.href}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.accessibilityLabel}
              style={({ pressed }) => [styles.trigger, pressed ? styles.triggerPressed : null]}
              onPress={() => router.push(tab.href)}
            >
              <View style={[styles.triggerInner, active ? styles.triggerInnerActive : null]}>
                <SfSymbolIcon
                  name={active ? tab.selectedIcon : tab.icon}
                  size={tabIconSize}
                  tintColor={active ? tabActiveColor : tabInactiveColor}
                  weight="semibold"
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    zIndex: 21,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 25,
    padding: 5,
    backgroundColor: '#272727',
    gap: 2,
  },
  trigger: {
    height: '100%',
    borderRadius: 20,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          userSelect: 'none',
        } as const)
      : null),
  },
  triggerPressed: {
    opacity: 0.8,
  },
  triggerInner: {
    height: '100%',
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  triggerInnerActive: {
    backgroundColor: '#444444',
  },
});
