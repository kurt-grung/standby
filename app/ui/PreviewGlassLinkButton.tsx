import { Link } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import { SymbolView } from 'expo-symbols';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import {
  homePreviewGlassGap,
  homePreviewGlassHeight,
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
const outline = derivePillOutlineSize(
  homePreviewGlassWidth,
  homePreviewGlassHeight,
  homePreviewGlassOutlineInset,
);
const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

type PreviewGlassLinkButtonProps = {
  label?: string;
  href?: '/preview';
};

type GlassPillSurfaceProps = {
  colorScheme: 'light' | 'dark';
  fallbackStyle: { backgroundColor: string; borderColor: string };
  children: ReactNode;
};

function GlassPillSurface({ colorScheme, fallbackStyle, children }: GlassPillSurfaceProps) {
  if (liquidGlass) {
    return (
      <NativeGlassView
        isInteractive
        glassEffectStyle="regular"
        colorScheme={colorScheme}
        borderRadius={borderRadius}
        style={styles.glass}
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
}: PreviewGlassLinkButtonProps) {
  const chrome = useAppChrome();
  const colorScheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const outlineBorderColor =
    colorScheme === 'light' ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.28)';

  return (
    <View style={styles.wrap}>
      <PillOutline
        width={outline.width}
        height={outline.height}
        borderRadius={outline.borderRadius}
        borderWidth={1.5}
        borderColor={outlineBorderColor}
      />
      <GlassPillSurface
        colorScheme={colorScheme}
        fallbackStyle={{
          backgroundColor: chrome.colors.accentSoft,
          borderColor: chrome.colors.border,
        }}
      >
        <Link href={href} asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Preview StandBy widgets"
            style={styles.pressable}
          >
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
    width: homePreviewGlassWidth,
    height: homePreviewGlassHeight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  glass: {
    width: homePreviewGlassWidth,
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
