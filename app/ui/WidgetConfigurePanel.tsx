import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { parseConfigureWidget, type ConfigureWidget } from '../lib/gaugePresets';
import { groupedScreenPadding } from '../theme/groupedLayout';
import { WidgetClockConfigureSection } from './WidgetClockConfigureSection';
import { WidgetGaugeConfigureSection } from './WidgetGaugeConfigureSection';

const configureBg = '#000000';
const configureFg = '#FFFFFF';
const configureMuted = 'rgba(255,255,255,0.4)';

const configureWidgets: ConfigureWidget[] = ['clock', 'gauge'];

const configureLabels: Record<ConfigureWidget, string> = {
  clock: 'Left',
  gauge: 'Right',
};

type ConfigurePageProps = {
  widget: ConfigureWidget;
};

function ConfigurePage({ widget }: ConfigurePageProps) {
  if (widget === 'gauge') {
    return <WidgetGaugeConfigureSection />;
  }

  return <WidgetClockConfigureSection />;
}

export function WidgetConfigurePanel() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { widget: widgetParam } = useLocalSearchParams<{ widget?: string }>();
  const initialWidget = parseConfigureWidget(
    typeof widgetParam === 'string' ? widgetParam : undefined,
  );
  const initialIndex = configureWidgets.indexOf(initialWidget);

  const listRef = useRef<FlatList<ConfigureWidget>>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  const onLayout = (event: LayoutChangeEvent) => {
    setPageWidth(event.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (pageWidth <= 0 || initialIndex < 0) {
      return;
    }

    listRef.current?.scrollToOffset({ offset: pageWidth * initialIndex, animated: false });
    setActiveIndex(initialIndex);
  }, [initialIndex, pageWidth]);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth <= 0) {
      return;
    }

    const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setActiveIndex(Math.max(0, Math.min(index, configureWidgets.length - 1)));
  };

  const scrollToWidget = useCallback(
    (index: number) => {
      if (pageWidth <= 0) {
        return;
      }

      listRef.current?.scrollToOffset({ offset: pageWidth * index, animated: true });
      setActiveIndex(index);
    },
    [pageWidth],
  );

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: configureBg, paddingTop: insets.top }}
      onLayout={onLayout}
    >
      <View
        className={`flex-row items-center justify-between ${groupedScreenPadding}`}
        style={{ paddingBottom: 16 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close widget configure"
          className="active:opacity-60"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <SymbolView name="xmark" size={16} tintColor={configureFg} weight="semibold" />
        </Pressable>
        <Text className="text-[17px] font-semibold" style={{ color: configureFg }}>
          Configure
        </Text>
        <View style={{ width: 16 }} />
      </View>

      <View
        className={`flex-row justify-center gap-8 ${groupedScreenPadding}`}
        style={{ paddingBottom: 20 }}
      >
        {configureWidgets.map((widget, index) => {
          const active = index === activeIndex;

          return (
            <Pressable
              key={widget}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className="active:opacity-60"
              onPress={() => scrollToWidget(index)}
            >
              <Text
                className="text-[13px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: active ? configureFg : configureMuted }}
              >
                {configureLabels[widget]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {pageWidth > 0 ? (
        <FlatList
          ref={listRef}
          data={configureWidgets}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          keyExtractor={(widget) => widget}
          renderItem={({ item }) => (
            <View style={{ width: pageWidth, paddingHorizontal: 16 }}>
              <ConfigurePage widget={item} />
            </View>
          )}
          getItemLayout={(_, index) => ({
            length: pageWidth,
            offset: pageWidth * index,
            index,
          })}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
      ) : null}
    </View>
  );
}
