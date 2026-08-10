import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import { homePreviewGlassHeight } from '../theme/standByPreviewLayout';
import { isWebGlassSurface, webGlassDarkSurface } from '../lib/webGlassSurface';
import { CircleOutline, deriveCircleOutlineSize } from './OutlineShape';
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
};

type RoundGlassSurfaceProps = {
  size: number;
  colorScheme: 'light' | 'dark';
  children: ReactNode;
};

function RoundGlassSurface({ size, colorScheme, children }: RoundGlassSurfaceProps) {
  const radius = size / 2;

  if (liquidGlass) {
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

  return (
    <View
      style={[
        styles.glass,
        isWebGlassSurface ? webGlassDarkSurface : styles.fallbackGlass,
        { width: size, height: size, borderRadius: radius },
      ]}
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
}: GlassIconButtonProps) {
  const systemScheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colorScheme = colorSchemeProp ?? systemScheme;
  const outline = deriveCircleOutlineSize(size, outlineInset);
  const iconTint = colorScheme === 'dark' ? configureGlassFg : '#000000';

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {!isWebGlassSurface ? (
        <CircleOutline
          size={outline.size}
          borderWidth={1.5}
          borderColor={colorScheme === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.16)'}
        />
      ) : null}
      <RoundGlassSurface size={size} colorScheme={colorScheme}>
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
});
