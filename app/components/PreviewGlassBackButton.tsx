import { Link } from 'expo-router';
import { GlassView } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import { SymbolView } from 'expo-symbols';
import type { ComponentType } from 'react';
import { DynamicColorIOS, Pressable, StyleSheet, View } from 'react-native';

import {
  nativeTabBarIconSize,
  previewBackGlassColorScheme,
  previewBackGlassTintColor,
  previewBackNightOutlineBorderWidth,
  previewBackNightOutlineHeight,
  previewBackNightOutlineOpacity,
  previewBackNightOutlineRadius,
  previewBackNightOutlineWidth,
  previewBackPillHeight,
  previewBackPillRadius,
  previewBackPillWidth,
} from '../theme/nativeTabBarMetrics';
import { nightMode } from './ultra/nightColors';

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const iconTint = DynamicColorIOS({
  dark: '#FFFFFF',
  light: '#000000',
});

export function PreviewGlassBackButton() {
  return (
    <View style={styles.wrap}>
      <View style={styles.nightOutline} />
      <NativeGlassView
        isInteractive
        glassEffectStyle="clear"
        colorScheme={previewBackGlassColorScheme}
        tintColor={previewBackGlassTintColor}
        borderRadius={previewBackPillRadius}
        style={styles.glass}
      >
        <Link href="/" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Home" style={styles.pressable}>
            <SymbolView
              name="chevron.left"
              size={nativeTabBarIconSize}
              tintColor={iconTint}
              weight="semibold"
            />
          </Pressable>
        </Link>
      </NativeGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: previewBackPillWidth,
    height: previewBackPillHeight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  nightOutline: {
    position: 'absolute',
    width: previewBackNightOutlineWidth,
    height: previewBackNightOutlineHeight,
    borderRadius: previewBackNightOutlineRadius,
    borderWidth: previewBackNightOutlineBorderWidth,
    borderColor: nightMode.primary,
    backgroundColor: 'transparent',
    opacity: previewBackNightOutlineOpacity,
  },
  glass: {
    width: previewBackPillWidth,
    height: previewBackPillHeight,
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
