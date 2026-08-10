import { Link } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import {
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
  CircleOutline,
  deriveCircleOutlineSize,
  derivePillOutlineSize,
  PillOutline,
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

const previewBackNightOutline = derivePillOutlineSize(
  previewBackPillWidth,
  previewBackPillHeight,
  previewBackNightOutlineInset,
);

const previewBackRoundOutline = deriveCircleOutlineSize(
  previewBackRoundSize,
  previewBackRoundOutlineInset,
);

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

function previewBackOutline(outlineShape: ResolvedPreviewBackOutlineShape): ReactNode {
  if (outlineShape === 'none') return null;

  if (outlineShape === 'round') {
    return <CircleOutline size={previewBackRoundOutline.size} {...outlineProps} />;
  }

  return (
    <PillOutline
      width={previewBackNightOutline.width}
      height={previewBackNightOutline.height}
      borderRadius={previewBackNightOutline.borderRadius}
      {...outlineProps}
    />
  );
}

type BackGlassSurfaceProps = {
  width: number;
  height: number;
  borderRadius: number;
  children: ReactNode;
  surfaceMode?: GlassSurfaceMode;
};

function BackGlassSurface({
  width,
  height,
  borderRadius,
  children,
  surfaceMode = 'auto',
}: BackGlassSurfaceProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);

  if (liquidGlass && surfaceMode !== 'web') {
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

  return (
    <View
      style={[
        styles.glass,
        webSurface ? webGlassDarkSurface : styles.fallbackGlass,
        { width, height, borderRadius },
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
  outline: ReactNode;
  surfaceMode?: GlassSurfaceMode;
  onPress?: () => void;
};

function GlassBackButtonShell({
  width,
  height,
  borderRadius,
  outline,
  surfaceMode = 'auto',
  onPress,
}: GlassBackButtonShellProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);

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
  const outline = previewBackOutline(resolvePreviewBackOutlineShape(shape, outlineShape));

  if (shape === 'round') {
    return (
      <GlassBackButtonShell
        width={previewBackRoundSize}
        height={previewBackRoundSize}
        borderRadius={previewBackRoundRadius}
        outline={outline}
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
      outline={outline}
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
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          userSelect: 'none',
        } as const)
      : null),
  },
});
