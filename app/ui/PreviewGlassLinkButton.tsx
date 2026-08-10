import { Link } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import { SymbolView } from 'expo-symbols';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import {
  homePreviewGlassGap,
  homePreviewGlassHeight,
  homePreviewGlassIconSize,
  homePreviewGlassOutlineInset,
  homePreviewGlassPaddingH,
  homePreviewGlassWidth,
} from '../theme/standByPreviewLayout';
import { useAppChrome } from '../theme/useAppChrome';
import { PillOutline, derivePillOutlineSize } from './OutlineShape';

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const borderRadius = homePreviewGlassHeight / 2;
const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

type HomeGlassLinkHref = '/' | '/preview' | '/ui';

type PreviewGlassLinkButtonProps = {
  label?: string;
  href?: HomeGlassLinkHref;
  accessibilityLabel?: string;
  width?: number;
  icon?: SFSymbol;
};

type GlassPillSurfaceProps = {
  colorScheme: 'light' | 'dark';
  width: number;
  fallbackStyle: { backgroundColor: string; borderColor: string };
  children: ReactNode;
};

function GlassPillSurface({ colorScheme, width, fallbackStyle, children }: GlassPillSurfaceProps) {
  if (liquidGlass) {
    return (
      <NativeGlassView
        isInteractive
        glassEffectStyle="regular"
        colorScheme={colorScheme}
        borderRadius={borderRadius}
        style={[styles.glass, { width }]}
      >
        {children}
      </NativeGlassView>
    );
  }

  return (
    <View
      style={[
        styles.glass,
        styles.fallbackGlass,
        {
          width,
          borderRadius,
          backgroundColor: fallbackStyle.backgroundColor,
          borderColor: fallbackStyle.borderColor,
        },
      ]}
    >
      {children}
    </View>
  );
}

export function PreviewGlassLinkButton({
  label = 'Preview',
  href = '/preview',
  accessibilityLabel,
  width = homePreviewGlassWidth,
  icon = 'play.rectangle',
}: PreviewGlassLinkButtonProps) {
  const chrome = useAppChrome();
  const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const outlineBorderColor =
    colorScheme === 'light' ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.28)';
  const outline = derivePillOutlineSize(
    width,
    homePreviewGlassHeight,
    homePreviewGlassOutlineInset,
  );

  return (
    <View style={[styles.wrap, { width }]}>
      <PillOutline
        width={outline.width}
        height={outline.height}
        borderRadius={outline.borderRadius}
        borderWidth={1.5}
        borderColor={outlineBorderColor}
      />
      <GlassPillSurface
        colorScheme={colorScheme}
        width={width}
        fallbackStyle={{
          backgroundColor: chrome.colors.accentSoft,
          borderColor: chrome.colors.border,
        }}
      >
        <Link href={href} asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? label}
            style={styles.pressable}
          >
            <SymbolView
              name={icon}
              size={homePreviewGlassIconSize}
              tintColor={chrome.colors.primary}
              weight="semibold"
            />
            <Text style={[styles.label, { color: chrome.colors.primary }]}>{label}</Text>
            <SymbolView
              name="chevron.right"
              size={12}
              tintColor={chrome.colors.primary}
              weight="semibold"
            />
          </Pressable>
        </Link>
      </GlassPillSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: homePreviewGlassHeight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  glass: {
    height: homePreviewGlassHeight,
    borderRadius,
    overflow: 'hidden',
  },
  fallbackGlass: {
    borderWidth: 1,
  },
  pressable: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: homePreviewGlassGap,
    paddingHorizontal: homePreviewGlassPaddingH,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
