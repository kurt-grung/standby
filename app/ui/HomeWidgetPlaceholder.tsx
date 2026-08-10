import { useState } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';

import {
  homePreviewGlassBottomGap,
  homePreviewGlassConfigureWidth,
  homePreviewGlassInset,
  homePreviewGlassRowGap,
  homeWidgetDisplaySize,
  homeWidgetPairWidth,
  homeWidgetPreviewScale,
  homeWidgetReferenceSize,
  homeWidgetStripHeight,
  homeWidgetStripBleed,
  homeWidgetStripPadding,
} from '../theme/standByPreviewLayout';
import { useOpenWidgetConfigure, useWidgetConfig } from '../theme/WidgetConfigContext';
import { GroupedSection } from './GroupedSection';
import { PreviewGlassLinkButton } from './PreviewGlassLinkButton';
import { StandByWidgetPair } from './StandByWidgetPair';
import { nightMode } from './ultra/nightColors';

type HomeWidgetPlaceholderProps = {
  gaugeValue?: number;
};

export function HomeWidgetPlaceholder({ gaugeValue = 0 }: HomeWidgetPlaceholderProps) {
  const openConfigure = useOpenWidgetConfigure();
  const { lastConfigureWidget } = useWidgetConfig();
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const displaySize = homeWidgetDisplaySize(containerWidth);
  const referenceSize = homeWidgetReferenceSize;
  const scale = homeWidgetPreviewScale(displaySize);
  const referencePairWidth = homeWidgetPairWidth(referenceSize);
  const scaledPairWidth = referencePairWidth * scale;
  const scaledPairHeight = referenceSize * scale;
  const stripHeight = homeWidgetStripHeight(containerWidth);

  return (
    <View className="mb-5">
      <View style={{ marginHorizontal: -homeWidgetStripBleed }}>
        <GroupedSection className="mb-0">
          <View style={{ backgroundColor: nightMode.bg }}>
            <View
              style={{
                height: stripHeight,
                padding: homeWidgetStripPadding,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onLayout={onLayout}
            >
              {displaySize > 0 ? (
                <View
                  style={{
                    width: scaledPairWidth,
                    height: scaledPairHeight,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      left: (scaledPairWidth - referencePairWidth) / 2,
                      top: (scaledPairHeight - referenceSize) / 2,
                      width: referencePairWidth,
                      height: referenceSize,
                      transform: [{ scale }],
                    }}
                  >
                    <StandByWidgetPair size={referenceSize} gaugeValue={gaugeValue} />
                  </View>
                </View>
              ) : null}
              <View
                pointerEvents="box-none"
                style={{ position: 'absolute', inset: 0, flexDirection: 'row' }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Configure left widget"
                  style={{ flex: 1 }}
                  onPress={() => openConfigure('clock')}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Configure right widget"
                  style={{ flex: 1 }}
                  onPress={() => openConfigure('gauge')}
                />
              </View>
            </View>
          </View>
        </GroupedSection>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: homePreviewGlassRowGap,
          paddingBottom: homePreviewGlassBottomGap,
          paddingHorizontal: homePreviewGlassInset,
        }}
      >
        <PreviewGlassLinkButton
          label="Configure"
          icon="square.grid.2x2"
          width={homePreviewGlassConfigureWidth}
          accessibilityLabel="Configure widgets"
          onPress={() => openConfigure(lastConfigureWidget)}
        />
        <PreviewGlassLinkButton accessibilityLabel="Preview StandBy widgets" />
      </View>
    </View>
  );
}
