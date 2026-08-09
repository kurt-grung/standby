import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { standByWidgetSize } from '../theme/standByPreviewLayout';
import { StandByWidgetPair } from './StandByWidgetPair';
import { nightMode } from './ultra/nightColors';

type StandByPreviewProps = {
  gaugeValue?: number;
};

export function StandByPreview({ gaugeValue = 0 }: StandByPreviewProps) {
  const [frame, setFrame] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setFrame({ width, height });
  };

  const size = standByWidgetSize(frame.width, frame.height);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: nightMode.bg }}
      onLayout={onLayout}
    >
      <StandByWidgetPair size={size} gaugeValue={gaugeValue} />
    </View>
  );
}
