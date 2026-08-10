import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ConfigureWidget } from '../lib/gaugePresets';
import { webGlassDarkSurface } from '../lib/webGlassSurface';
import {
  widgetConfigureSegmentActiveFill,
  widgetConfigureSegmentHeight,
  widgetConfigureSegmentInset,
  widgetConfigureSegmentWidth,
} from '../design-system';

const borderRadius = widgetConfigureSegmentHeight / 2;
const segmentInnerHeight = widgetConfigureSegmentHeight - widgetConfigureSegmentInset * 2;
const segmentInnerWidth = widgetConfigureSegmentWidth - widgetConfigureSegmentInset * 2;
const segmentRadius = borderRadius - widgetConfigureSegmentInset;

type ConfigureWidgetSegmentProps = {
  widgets: readonly ConfigureWidget[];
  labels: Record<ConfigureWidget, string>;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function ConfigureWidgetSegment({
  widgets,
  labels,
  activeIndex,
  onSelect,
}: ConfigureWidgetSegmentProps) {
  const segmentWidth = segmentInnerWidth / widgets.length;

  return (
    <View style={styles.wrap}>
      <View style={[styles.glass, webGlassDarkSurface]}>
        <View style={styles.row}>
          {widgets.map((widget, index) => {
            const active = index === activeIndex;

            return (
              <View key={widget} style={{ width: segmentWidth, height: segmentInnerHeight }}>
                <Pressable
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
                            borderRadius: segmentRadius,
                          }
                        : null,
                    ]}
                  >
                    <Text
                      style={[styles.label, active ? styles.labelActive : styles.labelInactive]}
                    >
                      {labels[widget]}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: widgetConfigureSegmentWidth,
    height: widgetConfigureSegmentHeight,
  },
  glass: {
    width: widgetConfigureSegmentWidth,
    height: widgetConfigureSegmentHeight,
    borderRadius,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    width: widgetConfigureSegmentWidth,
    height: widgetConfigureSegmentHeight,
    padding: widgetConfigureSegmentInset,
  },
  segmentPressable: {
    width: '100%',
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
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
