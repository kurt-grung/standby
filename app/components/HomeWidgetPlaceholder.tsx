import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import {
  homeWidgetDisplaySize,
  homeWidgetPairWidth,
  homeWidgetPreviewScale,
  homeWidgetReferenceSize,
  homeWidgetStripHeight,
  homeWidgetStripPadding,
} from '../theme/standByPreviewLayout';
import { GroupedLinkRow, GroupedSection } from './GroupedSection';
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
      <GroupedSection title="Widgets" className="mb-2">
        <View
          style={{
            height: stripHeight,
            backgroundColor: nightMode.bg,
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
      </GroupedSection>
      <GroupedSection className="mb-0">
        <GroupedLinkRow
          href="/preview"
          label="Preview"
          accessibilityLabel="Preview StandBy widgets"
        />
      </GroupedSection>
    </View>
  );
}
