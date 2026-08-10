import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ConfigureWidget } from '../lib/gaugePresets';
import {
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
import { PillOutline, derivePillOutlineSize } from './OutlineShape';

type NativeGlassViewProps = GlassViewProps & {
  borderRadius?: number;
};

const NativeGlassView = GlassView as ComponentType<NativeGlassViewProps>;

const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
const borderRadius = widgetConfigureSegmentHeight / 2;
const segmentInnerHeight = widgetConfigureSegmentHeight - widgetConfigureSegmentInset * 2;
const segmentRadius = borderRadius - widgetConfigureSegmentInset;
const outlineBorderColor = 'rgba(255, 255, 255, 0.28)';

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
  showOutline: boolean;
};

function SegmentGlassSurface({
  children,
  surfaceMode = 'auto',
  showOutline,
}: SegmentGlassSurfaceProps) {
  const webSurface = resolveWebGlassSurface(surfaceMode);

  if (liquidGlass && surfaceMode !== 'web') {
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
    <View
      style={[
        styles.glass,
        webSurface
          ? webGlassDarkSurface
          : showOutline
            ? styles.fallbackGlassPlain
            : styles.fallbackGlass,
      ]}
    >
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
  const webSurface = resolveWebGlassSurface(surfaceMode);
  const showOutline = !webSurface && !liquidGlass;
  const outline = derivePillOutlineSize(
    widgetConfigureSegmentWidth,
    widgetConfigureSegmentHeight,
    widgetConfigureSegmentOutlineInset,
  );

  return (
    <View style={[styles.wrap, { width: widgetConfigureSegmentWidth }]}>
      {showOutline ? (
        <PillOutline
          width={outline.width}
          height={outline.height}
          borderRadius={outline.borderRadius}
          borderWidth={1.5}
          borderColor={outlineBorderColor}
        />
      ) : null}
      <SegmentGlassSurface surfaceMode={surfaceMode} showOutline={showOutline}>
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
                    styles.segment,
                    active
                      ? {
                          backgroundColor: widgetConfigureSegmentActiveFill,
                          borderRadius: segmentRadius,
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
    height: widgetConfigureSegmentHeight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  glass: {
    width: widgetConfigureSegmentWidth,
    height: widgetConfigureSegmentHeight,
    borderRadius,
    overflow: 'hidden',
  },
  fallbackGlassPlain: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  fallbackGlass: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  row: {
    flexDirection: 'row',
    height: widgetConfigureSegmentHeight,
    padding: widgetConfigureSegmentInset,
  },
  segmentPressable: {
    flex: 1,
    height: segmentInnerHeight,
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
  segment: {
    flex: 1,
    height: segmentInnerHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.08 * 13,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: '#FFFFFF',
  },
  labelInactive: {
    color: 'rgba(255,255,255,0.4)',
  },
});
