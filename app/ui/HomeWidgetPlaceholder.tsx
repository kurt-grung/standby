import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import {
  homePreviewGlassBottomGap,
  homePreviewGlassInset,
  homePreviewGlassRowGap,
  homeWidgetDisplaySize,
  homeWidgetPairWidth,
  homeWidgetPreviewScale,
  homeWidgetReferenceSize,
  homeWidgetStripHeight,
  homeWidgetStripPadding,
} from '../theme/standByPreviewLayout';
import { GroupedSection } from './GroupedSection';
import { PreviewGlassLinkButton } from './PreviewGlassLinkButton';
import { StandByWidgetPair } from './StandByWidgetPair';
import { nightMode } from './ultra/nightColors';

type HomeWidgetPlaceholderProps = {
  gaugeValue?: number;
};

export function HomeWidgetPlaceholder({ gaugeValue = 0 }: HomeWidgetPlaceholderProps) {
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
      <GroupedSection title="Widgets" className="mb-0">
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
          </View>
        </View>
      </GroupedSection>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingTop: homePreviewGlassRowGap,
          paddingBottom: homePreviewGlassBottomGap,
          paddingRight: homePreviewGlassInset,
        }}
      >
        <PreviewGlassLinkButton />
      </View>
    </View>
  );
}
