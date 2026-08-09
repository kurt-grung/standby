import { Link } from 'expo-router';
import { GlassView } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import { SymbolView } from 'expo-symbols';
import type { ComponentType, ReactNode } from 'react';
import { DynamicColorIOS, Pressable, StyleSheet, View } from 'react-native';

import {
  nativeTabBarIconSize,
  previewBackGlassColorScheme,
  previewBackGlassTintColor,
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
import { nightMode } from './ultra/nightColors';

export type { PreviewBackOutlineShape, PreviewBackShape };

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const iconTint = DynamicColorIOS({
  dark: '#FFFFFF',
  light: '#000000',
});

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

type GlassBackButtonShellProps = {
  width: number;
  height: number;
  borderRadius: number;
  outline: ReactNode;
};

function GlassBackButtonShell({ width, height, borderRadius, outline }: GlassBackButtonShellProps) {
  return (
    <View style={[styles.wrap, { width, height }]}>
      {outline}
      <NativeGlassView
        isInteractive
        glassEffectStyle="clear"
        colorScheme={previewBackGlassColorScheme}
        tintColor={previewBackGlassTintColor}
        borderRadius={borderRadius}
        style={[styles.glass, { width, height }]}
      >
        <Link href="/" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Home" style={styles.pressable}>
            <SymbolView
              name="chevron.left"
              size={nativeTabBarIconSize}
              tintColor={iconTint}
              weight="semibold"
            />
          </Pressable>
        </Link>
      </NativeGlassView>
    </View>
  );
}

type PreviewGlassBackButtonProps = {
  shape?: PreviewBackShape;
  outlineShape?: PreviewBackOutlineShape;
};

export function PreviewGlassBackButton({
  shape = previewBackShape,
  outlineShape = previewBackOutlineShape,
}: PreviewGlassBackButtonProps) {
  const outline = previewBackOutline(resolvePreviewBackOutlineShape(shape, outlineShape));

  if (shape === 'round') {
    return (
      <GlassBackButtonShell
        width={previewBackRoundSize}
        height={previewBackRoundSize}
        borderRadius={previewBackRoundRadius}
        outline={outline}
      />
    );
  }

  return (
    <GlassBackButtonShell
      width={previewBackPillWidth}
      height={previewBackPillHeight}
      borderRadius={previewBackPillRadius}
      outline={outline}
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
    overflow: 'visible',
  },
  pressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
