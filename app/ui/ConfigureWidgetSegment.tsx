import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { GlassViewProps } from 'expo-glass-effect/build/GlassView.types';
import type { ComponentType, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ConfigureWidget } from '../lib/gaugePresets';
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

  return <View style={[styles.glass, styles.fallbackGlass]}>{children}</View>;
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
      <PillOutline
        width={outline.width}
        height={outline.height}
        borderRadius={outline.borderRadius}
        borderWidth={1.5}
        borderColor={outlineBorderColor}
      />
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
                className="flex-1 active:opacity-80"
                style={styles.segmentPressable}
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
                  <Text
                    className="text-[13px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}
                  >
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
    padding: widgetConfigureSegmentInset,
  },
  segmentPressable: {
    flex: 1,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
