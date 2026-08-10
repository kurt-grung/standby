import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ConfigureWidget } from '../lib/gaugePresets';
import { isWebGlassSurface, webGlassDarkSurface } from '../lib/webGlassSurface';
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
const outlineBorderColor = 'rgba(255, 255, 255, 0.28)';

type ConfigureWidgetSegmentProps = {
  widgets: readonly ConfigureWidget[];
  labels: Record<ConfigureWidget, string>;
  activeIndex: number;
  onSelect: (index: number) => void;
};

type SegmentGlassSurfaceProps = {
  children: ReactNode;
};

function SegmentGlassSurface({ children }: SegmentGlassSurfaceProps) {
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

  return (
    <View style={[styles.glass, isWebGlassSurface ? webGlassDarkSurface : styles.fallbackGlass]}>
      {children}
    </View>
  );
}

export function ConfigureWidgetSegment({
  widgets,
  labels,
  activeIndex,
  onSelect,
}: ConfigureWidgetSegmentProps) {
  const outline = derivePillOutlineSize(
    widgetConfigureSegmentWidth,
    widgetConfigureSegmentHeight,
    widgetConfigureSegmentOutlineInset,
  );

  return (
    <View style={[styles.wrap, { width: widgetConfigureSegmentWidth }]}>
      {!isWebGlassSurface ? (
        <PillOutline
          width={outline.width}
          height={outline.height}
          borderRadius={outline.borderRadius}
          borderWidth={1.5}
          borderColor={outlineBorderColor}
        />
      ) : null}
      <SegmentGlassSurface>
        <View style={styles.row}>
          {widgets.map((widget, index) => {
            const active = index === activeIndex;
            const segmentRadius = borderRadius - widgetConfigureSegmentInset;

            return (
              <Pressable
                key={widget}
                accessibilityRole="button"
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
  fallbackGlass: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    padding: widgetConfigureSegmentInset,
  },
  segmentPressable: {
    flex: 1,
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
  segment: {
    flex: 1,
    height: '100%',
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
