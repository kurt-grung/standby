import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import {
  nativeTabBarEdgePadding,
  webPhoneHeight,
  webPhoneSafeArea,
  webPhoneWidth,
} from '../design-system';

type WebPhoneFrameProps = {
  children: ReactNode;
};

export function WebPhoneFrame({ children }: WebPhoneFrameProps) {
  if (Platform.OS !== 'web') {
    return children;
  }

  return (
    <View style={styles.root}>
      <View nativeID="standby-web-phone" style={[styles.phone, webPhoneChromeVars]}>
        {children}
      </View>
    </View>
  );
}

const webPhoneChromeVars =
  Platform.OS === 'web'
    ? ({
        '--standby-web-safe-bottom': `${webPhoneSafeArea.bottom}px`,
        '--standby-tab-edge': `${nativeTabBarEdgePadding}px`,
      } as Record<string, string>)
    : null;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  phone: {
    flex: 1,
    position: 'relative',
    width: '100%',
    maxWidth: webPhoneWidth,
    minHeight: webPhoneHeight,
    overflow: 'hidden',
  },
});
