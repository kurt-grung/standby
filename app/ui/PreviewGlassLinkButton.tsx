import { Link } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import { SymbolView } from 'expo-symbols';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { standbyConfig } from '../config';
import {
  homePreviewGlassGap,
  homePreviewGlassHeight,
  homePreviewGlassOutlineInset,
  homePreviewGlassPaddingH,
  homePreviewGlassWidth,
} from '../theme/standByPreviewLayout';
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
const previewGlassForeground = standbyConfig.brand.textColor;
const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

type PreviewGlassLinkButtonProps = {
  label?: string;
  href?: '/preview';
};

function GlassPillSurface({ children }: { children: ReactNode }) {
  if (liquidGlass) {
    return (
      <NativeGlassView
        isInteractive
        glassEffectStyle="regular"
        colorScheme="dark"
        borderRadius={borderRadius}
        style={styles.glass}
      >
        {children}
      </NativeGlassView>
    );
  }

  return <View style={[styles.glass, styles.fallbackGlass, { borderRadius }]}>{children}</View>;
}

export function PreviewGlassLinkButton({
  label = 'Preview',
  href = '/preview',
}: PreviewGlassLinkButtonProps) {
  return (
    <View style={styles.wrap}>
      <PillOutline
        width={outline.width}
        height={outline.height}
        borderRadius={outline.borderRadius}
        borderWidth={1.5}
        borderColor="rgba(255,255,255,0.28)"
      />
      <GlassPillSurface>
        <Link href={href} asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Preview StandBy widgets"
            style={styles.pressable}
          >
            <Text style={styles.label}>{label}</Text>
            <SymbolView
              name="chevron.right"
              size={12}
              tintColor={previewGlassForeground}
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
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
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
    color: previewGlassForeground,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
