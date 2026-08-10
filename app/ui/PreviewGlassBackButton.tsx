import { Link } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import {
  appFallbackGlassBordered,
  appFallbackGlassFill,
  resolveWebGlassSurface,
  type GlassSurfaceMode,
  webGlassDarkSurface,
} from '../lib/webGlassSurface';
import {
  nativeTabBarIconSize,
  previewBackNightOutlineBorderWidth,
  previewBackNightOutlineInset,
  previewBackNightOutlineOpacity,
  previewBackOutlineShape,
  previewBackPillHeight,
  previewBackPillRadius,
  previewBackPillWidth,
  previewBackRoundOutlineInset,
  previewBackRoundRadius,
  previewBackRoundSize,
  previewBackShape,
  type PreviewBackOutlineShape,
  type PreviewBackShape,
} from '../theme/nativeTabBarMetrics';
import {
  appOutlineGlassFrame,
  appOutlineGlassFrameStyle,
  CircleOutline,
  PillOutline,
  type OutlineGlassFrame,
} from './OutlineShape';
import { SfSymbolIcon } from './SfSymbolIcon';
import { nightMode } from './ultra/nightColors';

export type { PreviewBackOutlineShape, PreviewBackShape };

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
const previewIconTint = '#FFFFFF';

const outlineProps = {
  borderWidth: previewBackNightOutlineBorderWidth,
  borderColor: nightMode.primary,
  opacity: previewBackNightOutlineOpacity,
} as const;

type ResolvedPreviewBackOutlineShape = Exclude<PreviewBackOutlineShape, 'auto'>;

function resolvePreviewBackOutlineShape(
  shape: PreviewBackShape,
  outlineShape: PreviewBackOutlineShape,
): ResolvedPreviewBackOutlineShape {
  if (outlineShape === 'auto') return shape === 'pill' ? 'pill' : 'none';
  return outlineShape;
}

function resolvePreviewBackAppFrame(
  outlineShape: ResolvedPreviewBackOutlineShape,
  width: number,
  height: number,
): OutlineGlassFrame | null {
  if (outlineShape === 'none') return null;
  if (outlineShape === 'round') {
    return appOutlineGlassFrame(width, height, previewBackRoundOutlineInset);
  }
  return appOutlineGlassFrame(width, height, previewBackNightOutlineInset);
}

function previewBackOutline(
  outlineShape: ResolvedPreviewBackOutlineShape,
  width: number,
  height: number,
): ReactNode {
  const appFrame = resolvePreviewBackAppFrame(outlineShape, width, height);
  if (!appFrame) return null;

  if (outlineShape === 'round') {
    return (
      <CircleOutline
        size={appFrame.width}
        {...outlineProps}
        style={appOutlineGlassFrameStyle(appFrame)}
      />
    );
  }

  return (
    <PillOutline
      width={appFrame.width}
      height={appFrame.height}
      borderRadius={appFrame.borderRadius}
      {...outlineProps}
      style={appOutlineGlassFrameStyle(appFrame)}
    />
  );
}

type BackGlassSurfaceProps = {
  width: number;
  height: number;
  borderRadius: number;
  children: ReactNode;
  surfaceMode?: GlassSurfaceMode;
  appFrame?: OutlineGlassFrame | null;
};

function BackGlassSurface({
  width,
  height,
  borderRadius,
  children,
  surfaceMode = 'auto',
  appFrame = null,
}: BackGlassSurfaceProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const useNativeGlass = liquidGlass && surfaceMode !== 'web';

  if (useNativeGlass) {
    return (
      <NativeGlassView
        isInteractive
        glassEffectStyle="clear"
        colorScheme="dark"
        borderRadius={borderRadius}
        style={[styles.glass, { width, height, borderRadius }]}
      >
        {children}
      </NativeGlassView>
    );
  }

  const frameStyle = appFrame
    ? appOutlineGlassFrameStyle(appFrame)
    : { width, height, borderRadius };

  return (
    <View
      style={[
        styles.glass,
        webSurface
          ? webGlassDarkSurface
          : appFrame
            ? appFallbackGlassFill
            : appFallbackGlassBordered,
        frameStyle,
      ]}
    >
      {children}
    </View>
  );
}

type GlassBackButtonShellProps = {
  width: number;
  height: number;
  borderRadius: number;
  outlineShape: ResolvedPreviewBackOutlineShape;
  surfaceMode?: GlassSurfaceMode;
  onPress?: () => void;
};

function GlassBackButtonShell({
  width,
  height,
  borderRadius,
  outlineShape,
  surfaceMode = 'auto',
  onPress,
}: GlassBackButtonShellProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const useNativeGlass = liquidGlass && surfaceMode !== 'web';
  const useInsetAppGlass = !webSurface && !useNativeGlass;
  const appFrame = useInsetAppGlass
    ? resolvePreviewBackAppFrame(outlineShape, width, height)
    : null;
  const outline = previewBackOutline(outlineShape, width, height);

  const pressable = (
    <Pressable accessibilityRole="button" accessibilityLabel="Home" style={styles.pressable}>
      <SfSymbolIcon
        name="chevron.left"
        size={nativeTabBarIconSize}
        tintColor={previewIconTint}
        weight="semibold"
      />
    </Pressable>
  );

  return (
    <View style={[styles.wrap, { width, height }]}>
      {!webSurface ? outline : null}
      <BackGlassSurface
        width={width}
        height={height}
        borderRadius={borderRadius}
        surfaceMode={surfaceMode}
        appFrame={appFrame}
      >
        {onPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Home"
            style={styles.pressable}
            onPress={onPress}
          >
            <SfSymbolIcon
              name="chevron.left"
              size={nativeTabBarIconSize}
              tintColor={previewIconTint}
              weight="semibold"
            />
          </Pressable>
        ) : (
          <Link href="/" asChild>
            {pressable}
          </Link>
        )}
      </BackGlassSurface>
    </View>
  );
}

type PreviewGlassBackButtonProps = {
  shape?: PreviewBackShape;
  outlineShape?: PreviewBackOutlineShape;
  surfaceMode?: GlassSurfaceMode;
  onPress?: () => void;
};

export function PreviewGlassBackButton({
  shape = previewBackShape,
  outlineShape = previewBackOutlineShape,
  surfaceMode = 'auto',
  onPress,
}: PreviewGlassBackButtonProps) {
  const resolvedOutlineShape = resolvePreviewBackOutlineShape(shape, outlineShape);

  if (shape === 'round') {
    return (
      <GlassBackButtonShell
        width={previewBackRoundSize}
        height={previewBackRoundSize}
        borderRadius={previewBackRoundRadius}
        outlineShape={resolvedOutlineShape}
        surfaceMode={surfaceMode}
        onPress={onPress}
      />
    );
  }

  return (
    <GlassBackButtonShell
      width={previewBackPillWidth}
      height={previewBackPillHeight}
      borderRadius={previewBackPillRadius}
      outlineShape={resolvedOutlineShape}
      surfaceMode={surfaceMode}
      onPress={onPress}
    />
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
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          userSelect: 'none',
        } as const)
      : null),
  },
});
