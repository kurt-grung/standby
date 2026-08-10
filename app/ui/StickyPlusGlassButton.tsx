import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import {
  appFallbackGlassFill,
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
import {
  appOutlineGlassFrame,
  appOutlineGlassFrameStyle,
  CircleOutline,
  type OutlineGlassFrame,
} from './OutlineShape';
import { SfSymbolIcon } from './SfSymbolIcon';
import { nightMode } from './ultra/nightColors';

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const radius = groupedStickyPlusGlassSize / 2;
const plusIconSize = Math.round(groupedStickyPlusSize * 0.58);
const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

type StickyPlusGlassButtonProps = {
  onPress: () => void;
  surfaceMode?: GlassSurfaceMode;
};

type RoundGlassSurfaceProps = {
  children: ReactNode;
  surfaceMode?: GlassSurfaceMode;
  appFrame?: OutlineGlassFrame | null;
};

function RoundGlassSurface({
  children,
  surfaceMode = 'auto',
  appFrame = null,
}: RoundGlassSurfaceProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const useNativeGlass = liquidGlass && surfaceMode !== 'web';

  if (useNativeGlass) {
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

  const frameStyle = appFrame
    ? appOutlineGlassFrameStyle(appFrame)
    : {
        width: groupedStickyPlusGlassSize,
        height: groupedStickyPlusGlassSize,
        borderRadius: radius,
      };

  return (
    <View
      style={[styles.glass, webSurface ? webGlassDarkSurface : appFallbackGlassFill, frameStyle]}
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
  const useNativeGlass = liquidGlass && surfaceMode !== 'web';
  const useInsetAppGlass = !webSurface && !useNativeGlass;
  const appFrame = useInsetAppGlass
    ? appOutlineGlassFrame(
        groupedStickyPlusGlassSize,
        groupedStickyPlusGlassSize,
        groupedStickyPlusOutlineInset,
      )
    : null;

  return (
    <View
      style={[
        styles.wrap,
        { width: groupedStickyPlusGlassSize, height: groupedStickyPlusGlassSize },
      ]}
    >
      {!webSurface && appFrame ? (
        <CircleOutline
          size={appFrame.width}
          borderWidth={1.5}
          borderColor="rgba(255,255,255,0.28)"
          style={appOutlineGlassFrameStyle(appFrame)}
        />
      ) : null}
      <RoundGlassSurface surfaceMode={surfaceMode} appFrame={appFrame}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Expand header"
          hitSlop={groupedStickyPlusHitSlop}
          style={styles.pressable}
          onPress={onPress}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
        >
          <SfSymbolIcon
            name="plus"
            size={plusIconSize}
            tintColor={nightMode.primary}
            weight="light"
            style={pressed ? styles.plusPressed : undefined}
          />
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
    overflow: 'hidden',
  },
  pressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.94 }],
  },
});
