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
import { useAppChrome } from '../theme/useAppChrome';
import { WidgetClockConfigureSection } from './WidgetClockConfigureSection';
import { WidgetGaugeConfigureSection } from './WidgetGaugeConfigureSection';

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
  const chrome = useAppChrome();
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
      style={{ backgroundColor: chrome.colors.bg, paddingTop: insets.top }}
      onLayout={onLayout}
    >
      <View
        className={`flex-row items-center justify-between ${groupedScreenPadding}`}
        style={{ paddingBottom: 12 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close widget configure"
          className="active:opacity-70"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <SymbolView name="xmark" size={16} tintColor={chrome.colors.primary} weight="semibold" />
        </Pressable>
        <Text className="text-[17px] font-semibold" style={{ color: chrome.colors.primary }}>
          Configure
        </Text>
        <View style={{ width: 16 }} />
      </View>

      <View
        className={`flex-row justify-center gap-6 ${groupedScreenPadding}`}
        style={{ paddingBottom: 16 }}
      >
        {configureWidgets.map((widget, index) => {
          const active = index === activeIndex;

          return (
            <Pressable
              key={widget}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className="active:opacity-70"
              onPress={() => scrollToWidget(index)}
            >
              <Text
                className="text-[13px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: active ? chrome.colors.primary : chrome.colors.muted }}
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
