import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useStandbySafeAreaInsets } from '../hooks/useStandbySafeAreaInsets';

import { parseConfigureWidget, type ConfigureWidget } from '../lib/gaugePresets';
import { groupedScreenPadding } from '../theme/groupedLayout';
import { homePreviewGlassIconSize, homePreviewGlassWidth } from '../theme/standByPreviewLayout';
import { useWidgetConfig } from '../theme/WidgetConfigContext';
import { ConfigureWidgetSegment } from './ConfigureWidgetSegment';
import { GlassIconButton } from './GlassIconButton';
import { PreviewGlassLinkButton } from './PreviewGlassLinkButton';
import { WidgetClockConfigureSection } from './WidgetClockConfigureSection';
import { WidgetGaugeConfigureSection } from './WidgetGaugeConfigureSection';

const configureBg = '#000000';
const configureFg = '#FFFFFF';

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
  const insets = useStandbySafeAreaInsets();
  const { setLastConfigureWidget } = useWidgetConfig();
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
    const nextIndex = Math.max(0, Math.min(index, configureWidgets.length - 1));
    setActiveIndex(nextIndex);
    setLastConfigureWidget(configureWidgets[nextIndex] ?? 'clock');
  };

  const scrollToWidget = useCallback(
    (index: number) => {
      if (pageWidth <= 0) {
        return;
      }

      listRef.current?.scrollToOffset({ offset: pageWidth * index, animated: true });
      setActiveIndex(index);
      setLastConfigureWidget(configureWidgets[index] ?? 'clock');
    },
    [pageWidth, setLastConfigureWidget],
  );

  const openPreview = useCallback(() => {
    router.back();
    queueMicrotask(() => {
      router.push('/preview');
    });
  }, [router]);

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: configureBg, paddingTop: insets.top }}
      onLayout={onLayout}
    >
      <View
        className={`flex-row items-center ${groupedScreenPadding}`}
        style={{ paddingBottom: 16 }}
      >
        <View style={{ width: homePreviewGlassWidth, alignItems: 'flex-start' }}>
          <GlassIconButton
            icon="xmark"
            accessibilityLabel="Close widget configure"
            iconSize={homePreviewGlassIconSize}
            colorScheme="dark"
            onPress={() => router.back()}
          />
        </View>
        <Text
          className="flex-1 text-center text-[17px] font-semibold"
          style={{ color: configureFg }}
        >
          Configure
        </Text>
        <View style={{ width: homePreviewGlassWidth, alignItems: 'flex-end' }}>
          <PreviewGlassLinkButton
            accessibilityLabel="Preview StandBy widgets"
            colorScheme="dark"
            showChevron={false}
            width={homePreviewGlassWidth}
            onPress={openPreview}
          />
        </View>
      </View>

      <View className={`items-center ${groupedScreenPadding}`} style={{ paddingBottom: 20 }}>
        <ConfigureWidgetSegment
          widgets={configureWidgets}
          labels={configureLabels}
          activeIndex={activeIndex}
          onSelect={scrollToWidget}
        />
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
