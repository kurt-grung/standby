import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import { homePreviewGlassHeight } from '../theme/standByPreviewLayout';
import {
  appFallbackGlassFill,
  resolveWebGlassSurface,
  type GlassSurfaceMode,
  webGlassDarkSurface,
} from '../lib/webGlassSurface';
import {
  appOutlineGlassFrame,
  appOutlineGlassFrameStyle,
  CircleOutline,
  type OutlineGlassFrame,
} from './OutlineShape';
import { SfSymbolIcon } from './SfSymbolIcon';

const configureGlassFg = '#FFFFFF';

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

type GlassIconButtonProps = {
  icon: SFSymbol;
  accessibilityLabel: string;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  colorScheme?: 'light' | 'dark';
  outlineInset?: number;
  surfaceMode?: GlassSurfaceMode;
};

type RoundGlassSurfaceProps = {
  size: number;
  colorScheme: 'light' | 'dark';
  children: ReactNode;
  surfaceMode?: GlassSurfaceMode;
  appFrame?: OutlineGlassFrame | null;
};

function RoundGlassSurface({
  size,
  colorScheme,
  children,
  surfaceMode = 'auto',
  appFrame = null,
}: RoundGlassSurfaceProps) {
  const radius = size / 2;
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const useNativeGlass = liquidGlass && surfaceMode !== 'web';

  if (useNativeGlass) {
    return (
      <NativeGlassView
        isInteractive
        glassEffectStyle="regular"
        colorScheme={colorScheme}
        borderRadius={radius}
        style={[styles.glass, { width: size, height: size, borderRadius: radius }]}
      >
        {children}
      </NativeGlassView>
    );
  }

  const frameStyle = appFrame
    ? appOutlineGlassFrameStyle(appFrame)
    : { width: size, height: size, borderRadius: radius };

  return (
    <View
      style={[styles.glass, webSurface ? webGlassDarkSurface : appFallbackGlassFill, frameStyle]}
    >
      {children}
    </View>
  );
}

export function GlassIconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = homePreviewGlassHeight,
  iconSize = 16,
  colorScheme: colorSchemeProp,
  outlineInset = 4,
  surfaceMode = 'auto',
}: GlassIconButtonProps) {
  const systemScheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colorScheme = colorSchemeProp ?? systemScheme;
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const useNativeGlass = liquidGlass && surfaceMode !== 'web';
  const useInsetAppGlass = !webSurface && !useNativeGlass;
  const appFrame = useInsetAppGlass ? appOutlineGlassFrame(size, size, outlineInset) : null;
  const iconTint = colorScheme === 'dark' ? configureGlassFg : '#000000';

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {!webSurface && appFrame ? (
        <CircleOutline
          size={appFrame.width}
          borderWidth={1.5}
          borderColor={colorScheme === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.16)'}
          style={appOutlineGlassFrameStyle(appFrame)}
        />
      ) : null}
      <RoundGlassSurface
        size={size}
        colorScheme={colorScheme}
        surfaceMode={surfaceMode}
        appFrame={appFrame}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={styles.pressable}
          onPress={onPress}
        >
          <SfSymbolIcon name={icon} size={iconSize} tintColor={iconTint} weight="semibold" />
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
});
