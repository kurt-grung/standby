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
  appFallbackGlassFill,
  resolveWebGlassSurface,
  type GlassSurfaceMode,
  webGlassDarkSurface,
  webGlassLightSurface,
} from '../lib/webGlassSurface';
import { useAppChrome } from '../theme/useAppChrome';
import {
  appOutlineGlassFrame,
  appOutlineGlassFrameStyle,
  PillOutline,
  type OutlineGlassFrame,
} from './OutlineShape';

const configureGlassFg = '#FFFFFF';
const configureGlassFallback = {
  backgroundColor: 'rgba(255,255,255,0.14)',
} as const;

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const borderRadius = homePreviewGlassHeight / 2;
const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

type HomeGlassLinkHref = '/' | '/preview';

type PreviewGlassLinkButtonProps = {
  label?: string;
  href?: HomeGlassLinkHref;
  accessibilityLabel?: string;
  width?: number;
  icon?: SFSymbol;
  colorScheme?: 'light' | 'dark';
  showChevron?: boolean;
  surfaceMode?: GlassSurfaceMode;
  onPress?: () => void;
};

type GlassPillSurfaceProps = {
  colorScheme: 'light' | 'dark';
  width: number;
  fallbackFill: { backgroundColor: string };
  children: ReactNode;
  surfaceMode?: GlassSurfaceMode;
  appFrame?: OutlineGlassFrame | null;
};

function GlassPillSurface({
  colorScheme,
  width,
  fallbackFill,
  children,
  surfaceMode = 'auto',
  appFrame = null,
}: GlassPillSurfaceProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const useNativeGlass = liquidGlass && surfaceMode !== 'web';

  if (useNativeGlass) {
    return (
      <NativeGlassView
        isInteractive
        glassEffectStyle="regular"
        colorScheme={colorScheme}
        borderRadius={borderRadius}
        style={[styles.glass, { width, height: homePreviewGlassHeight, borderRadius }]}
      >
        {children}
      </NativeGlassView>
    );
  }

  const frameStyle = appFrame
    ? appOutlineGlassFrameStyle(appFrame)
    : { width, height: homePreviewGlassHeight, borderRadius };

  return (
    <View
      style={[
        styles.glass,
        webSurface
          ? colorScheme === 'dark'
            ? webGlassDarkSurface
            : webGlassLightSurface
          : [appFallbackGlassFill, fallbackFill],
        frameStyle,
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
  showChevron: showChevronProp,
  surfaceMode = 'auto',
  onPress,
}: PreviewGlassLinkButtonProps) {
  const chrome = useAppChrome();
  const systemScheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colorScheme = colorSchemeProp ?? systemScheme;
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const useNativeGlass = liquidGlass && surfaceMode !== 'web';
  const useInsetAppGlass = !webSurface && !useNativeGlass;
  const showChevron = showChevronProp ?? !webSurface;
  const foreground = colorScheme === 'dark' ? configureGlassFg : chrome.colors.primary;
  const outlineBorderColor =
    colorScheme === 'light' ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.28)';
  const fallbackFill =
    colorScheme === 'dark' ? configureGlassFallback : { backgroundColor: chrome.colors.accentSoft };
  const appFrame = useInsetAppGlass
    ? appOutlineGlassFrame(width, homePreviewGlassHeight, homePreviewGlassOutlineInset)
    : null;

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
      {!webSurface && appFrame ? (
        <PillOutline
          width={appFrame.width}
          height={appFrame.height}
          borderRadius={appFrame.borderRadius}
          borderWidth={1.5}
          borderColor={outlineBorderColor}
          style={appOutlineGlassFrameStyle(appFrame)}
        />
      ) : null}
      <GlassPillSurface
        colorScheme={colorScheme}
        width={width}
        fallbackFill={fallbackFill}
        surfaceMode={surfaceMode}
        appFrame={appFrame}
      >
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
    overflow: 'hidden',
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
