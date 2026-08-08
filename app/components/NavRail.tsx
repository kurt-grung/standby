import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavRailProps = {
  children: ReactNode;
};

const INSET = 16;
const GAP = 8;

export function NavRail({ children }: NavRailProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        right: insets.right + INSET,
        top: insets.top,
        bottom: insets.bottom,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: GAP,
      }}>
      {children}
    </View>
  );
}
