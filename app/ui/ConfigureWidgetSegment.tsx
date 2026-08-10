import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ConfigureWidget } from '../lib/gaugePresets';
import {
  appFallbackGlassFill,
  resolveWebGlassSurface,
  type GlassSurfaceMode,
  webGlassDarkSurface,
} from '../lib/webGlassSurface';
import {
  widgetConfigureSegmentActiveFill,
  widgetConfigureSegmentHeight,
  widgetConfigureSegmentInset,
  widgetConfigureSegmentOutlineInset,
  widgetConfigureSegmentWidth,
} from '../design-system';

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
const borderRadius = widgetConfigureSegmentHeight / 2;
const segmentRadius = borderRadius - widgetConfigureSegmentInset;
const outlineBorderColor = 'rgba(255, 255, 255, 0.28)';
const innerOutlineRadius =
  (widgetConfigureSegmentHeight - widgetConfigureSegmentOutlineInset * 2) / 2;

type ConfigureWidgetSegmentProps = {
  widgets: readonly ConfigureWidget[];
  labels: Record<ConfigureWidget, string>;
  activeIndex: number;
  onSelect: (index: number) => void;
  surfaceMode?: GlassSurfaceMode;
};

type SegmentGlassSurfaceProps = {
  children: ReactNode;
  surfaceMode?: GlassSurfaceMode;
};

function SegmentOutline() {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.outlineRing,
        {
          borderRadius: innerOutlineRadius,
        },
      ]}
    />
  );
}

function SegmentGlassSurface({ children, surfaceMode = 'auto' }: SegmentGlassSurfaceProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const useLiquidGlass = liquidGlass && surfaceMode !== 'web';

  if (useLiquidGlass) {
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

  return (
    <View style={[styles.glass, webSurface ? webGlassDarkSurface : appFallbackGlassFill]}>
      {children}
    </View>
  );
}

export function ConfigureWidgetSegment({
  widgets,
  labels,
  activeIndex,
  onSelect,
  surfaceMode = 'auto',
}: ConfigureWidgetSegmentProps) {
  const useLiquidGlass = liquidGlass && surfaceMode !== 'web';
  const showOutline = !useLiquidGlass;

  return (
    <View style={styles.wrap}>
      {showOutline ? <SegmentOutline /> : null}
      <SegmentGlassSurface surfaceMode={surfaceMode}>
        <View style={styles.row}>
          {widgets.map((widget, index) => {
            const active = index === activeIndex;

            return (
              <Pressable
                key={widget}
                accessibilityRole="button"
                accessibilityLabel={labels[widget]}
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [
                  styles.segmentPressable,
                  pressed ? styles.segmentPressablePressed : null,
                ]}
                onPress={() => onSelect(index)}
              >
                <View
                  style={[
                    styles.segmentLabel,
                    active
                      ? {
                          backgroundColor: widgetConfigureSegmentActiveFill,
                        }
                      : null,
                  ]}
                >
                  <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
                    {labels[widget]}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </SegmentGlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: widgetConfigureSegmentWidth,
    height: widgetConfigureSegmentHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineRing: {
    position: 'absolute',
    top: widgetConfigureSegmentOutlineInset,
    right: widgetConfigureSegmentOutlineInset,
    bottom: widgetConfigureSegmentOutlineInset,
    left: widgetConfigureSegmentOutlineInset,
    borderWidth: 1.5,
    borderColor: outlineBorderColor,
  },
  glass: {
    width: '100%',
    height: '100%',
    borderRadius,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    height: '100%',
    padding: widgetConfigureSegmentInset,
  },
  segmentPressable: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          userSelect: 'none',
        } as const)
      : null),
  },
  segmentPressablePressed: {
    opacity: 0.8,
  },
  segmentLabel: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: segmentRadius,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.04,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: '#FFFFFF',
  },
  labelInactive: {
    color: 'rgba(255,255,255,0.4)',
  },
});
