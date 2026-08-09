import { useRouter } from 'expo-router';
import { GlassView } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import { SymbolView } from 'expo-symbols';
import type { ComponentType } from 'react';
import { DynamicColorIOS, Pressable, StyleSheet } from 'react-native';

import { nativeTabBarHeight, nativeTabBarIconSize } from '../theme/nativeTabBarMetrics';

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const iconTint = DynamicColorIOS({
  dark: '#FFFFFF',
  light: '#000000',
});

export function PreviewGlassBackButton() {
  const router = useRouter();
  const radius = nativeTabBarHeight / 2;

  return (
    <NativeGlassView
      isInteractive
      glassEffectStyle="clear"
      colorScheme="dark"
      borderRadius={radius}
      style={styles.glass}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Home"
        onPress={() => router.push('/')}
        style={styles.pressable}
      >
        <SymbolView
          name="chevron.left"
          size={nativeTabBarIconSize}
          tintColor={iconTint}
          weight="semibold"
        />
      </Pressable>
    </NativeGlassView>
  );
}

const styles = StyleSheet.create({
  glass: {
    width: nativeTabBarHeight,
    height: nativeTabBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  pressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
