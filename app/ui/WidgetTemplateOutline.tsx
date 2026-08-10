import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { complicationSlotLabels, type ComplicationSlotId } from '../lib/complicationOptions';
import type { ConfigureWidget } from '../lib/gaugePresets';
import { widgetConfigureSlotPositions } from '../lib/widgetConfigureLayout';
import { useWidgetConfig } from '../theme/WidgetConfigContext';
import {
  widgetConfigureTemplateCornerRadius,
  widgetConfigureTemplateStrokeWidth,
} from '../theme/standByPreviewLayout';
import { ComplicationSlotButton } from './ComplicationSlotButton';

const configureBg = '#000000';
const configureStroke = '#FFFFFF';

type WidgetConfigureTemplateProps = {
  widget: ConfigureWidget;
};

export function WidgetConfigureTemplate({ widget }: WidgetConfigureTemplateProps) {
  const router = useRouter();
  const { getComplications } = useWidgetConfig();
  const complications = getComplications(widget);
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const cornerRadius = widgetConfigureTemplateCornerRadius(width);
  const slotPositions = width > 0 ? widgetConfigureSlotPositions(width) : [];

  const openPicker = (slot: ComplicationSlotId) => {
    router.push({
      pathname: '/configure/picker',
      params: { widget, slot },
    });
  };

  return (
    <View onLayout={onLayout} style={{ backgroundColor: configureBg }}>
      {width > 0 ? (
        <View
          style={{
            width,
            height: width,
            borderRadius: cornerRadius,
            borderWidth: widgetConfigureTemplateStrokeWidth,
            borderColor: configureStroke,
            backgroundColor: configureBg,
          }}
        >
          {slotPositions.map(({ slot, size, left, right, top, bottom }) => (
            <View
              key={slot}
              pointerEvents="box-none"
              style={{
                position: 'absolute',
                left,
                right,
                top,
                bottom,
              }}
            >
              <ComplicationSlotButton
                slotLabel={complicationSlotLabels[slot]}
                complicationId={complications[slot]}
                size={size}
                onPress={() => openPicker(slot)}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={{ width: '100%', aspectRatio: 1 }} />
      )}
    </View>
  );
}
