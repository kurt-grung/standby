import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  resolveWebGlassSurface,
  type GlassSurfaceMode,
  webGlassDarkSurface,
} from '../lib/webGlassSurface';
import {
  groupedStickyPlusGlassSize,
  groupedStickyPlusHitSlop,
  groupedStickyPlusOutlineInset,
  groupedStickyPlusSize,
} from '../theme/groupedLayout';
import { previewBackGlassColorScheme } from '../theme/nativeTabBarMetrics';
import { CircleOutline, deriveCircleOutlineSize } from './OutlineShape';
import { nightMode } from './ultra/nightColors';

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const radius = groupedStickyPlusGlassSize / 2;
const outline = deriveCircleOutlineSize(groupedStickyPlusGlassSize, groupedStickyPlusOutlineInset);
const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

type StickyPlusGlassButtonProps = {
  onPress: () => void;
  surfaceMode?: GlassSurfaceMode;
};

type RoundGlassSurfaceProps = {
  children: ReactNode;
  surfaceMode?: GlassSurfaceMode;
};

function RoundGlassSurface({ children, surfaceMode = 'auto' }: RoundGlassSurfaceProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);

  if (liquidGlass && surfaceMode !== 'web') {
    return (
      <NativeGlassView
        isInteractive
        glassEffectStyle="regular"
        colorScheme={previewBackGlassColorScheme}
        borderRadius={radius}
        style={[
          styles.glass,
          { width: groupedStickyPlusGlassSize, height: groupedStickyPlusGlassSize },
        ]}
      >
        {children}
      </NativeGlassView>
    );
  }

  return (
    <View
      style={[
        styles.glass,
        webSurface ? webGlassDarkSurface : styles.fallbackGlass,
        {
          width: groupedStickyPlusGlassSize,
          height: groupedStickyPlusGlassSize,
          borderRadius: radius,
        },
      ]}
    >
      {children}
    </View>
  );
}

export function StickyPlusGlassButton({
  onPress,
  surfaceMode = 'auto',
}: StickyPlusGlassButtonProps) {
  const [pressed, setPressed] = useState(false);
  const webSurface = resolveWebGlassSurface(surfaceMode);

  return (
    <View
      style={[
        styles.wrap,
        { width: groupedStickyPlusGlassSize, height: groupedStickyPlusGlassSize },
      ]}
    >
      {!webSurface ? (
        <CircleOutline size={outline.size} borderWidth={1.5} borderColor="rgba(255,255,255,0.28)" />
      ) : null}
      <RoundGlassSurface surfaceMode={surfaceMode}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Expand header"
          hitSlop={groupedStickyPlusHitSlop}
          style={styles.pressable}
          onPress={onPress}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
        >
          <Text style={[styles.plus, pressed ? styles.plusPressed : undefined]}>+</Text>
        </Pressable>
      </RoundGlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  glass: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius,
    overflow: 'hidden',
  },
  fallbackGlass: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  pressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    color: nightMode.primary,
    fontSize: groupedStickyPlusSize,
    lineHeight: groupedStickyPlusSize + 2,
    fontWeight: '300',
  },
  plusPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.94 }],
  },
});
