import { Link } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import { SfSymbolIcon } from './SfSymbolIcon';
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
import {
  isWebGlassSurface,
  webGlassDarkSurface,
  webGlassLightSurface,
} from '../lib/webGlassSurface';
import { useAppChrome } from '../theme/useAppChrome';
import { PillOutline, derivePillOutlineSize } from './OutlineShape';

const configureGlassFg = '#FFFFFF';
const configureGlassFallback = {
  backgroundColor: 'rgba(255,255,255,0.14)',
  borderColor: 'rgba(255,255,255,0.22)',
} as const;

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
  colorScheme?: 'light' | 'dark';
  showChevron?: boolean;
  onPress?: () => void;
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
        isWebGlassSurface
          ? colorScheme === 'dark'
            ? webGlassDarkSurface
            : webGlassLightSurface
          : [styles.fallbackGlass, fallbackStyle],
        { width, borderRadius },
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
  colorScheme: colorSchemeProp,
  showChevron = !isWebGlassSurface,
  onPress,
}: PreviewGlassLinkButtonProps) {
  const chrome = useAppChrome();
  const systemScheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colorScheme = colorSchemeProp ?? systemScheme;
  const foreground = colorScheme === 'dark' ? configureGlassFg : chrome.colors.primary;
  const outlineBorderColor =
    colorScheme === 'light' ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.28)';
  const fallbackStyle =
    colorScheme === 'dark'
      ? configureGlassFallback
      : { backgroundColor: chrome.colors.accentSoft, borderColor: chrome.colors.border };
  const outline = derivePillOutlineSize(
    width,
    homePreviewGlassHeight,
    homePreviewGlassOutlineInset,
  );

  const content = (
    <>
      <SfSymbolIcon
        name={icon}
        size={homePreviewGlassIconSize}
        tintColor={foreground}
        weight="semibold"
      />
      <Text style={[styles.label, { color: foreground }]}>{label}</Text>
      {showChevron ? (
        <SfSymbolIcon name="chevron.right" size={12} tintColor={foreground} weight="semibold" />
      ) : null}
    </>
  );

  return (
    <View style={[styles.wrap, { width }]}>
      {!isWebGlassSurface ? (
        <PillOutline
          width={outline.width}
          height={outline.height}
          borderRadius={outline.borderRadius}
          borderWidth={1.5}
          borderColor={outlineBorderColor}
        />
      ) : null}
      <GlassPillSurface colorScheme={colorScheme} width={width} fallbackStyle={fallbackStyle}>
        {onPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? label}
            style={styles.pressable}
            onPress={onPress}
          >
            {content}
          </Pressable>
        ) : (
          <Link href={href} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={accessibilityLabel ?? label}
              style={styles.pressable}
            >
              {content}
            </Pressable>
          </Link>
        )}
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
