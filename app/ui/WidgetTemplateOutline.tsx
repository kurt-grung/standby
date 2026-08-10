import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';

import { complicationSlotLabels, type ComplicationSlotId } from '../lib/complicationOptions';
import type { ConfigureWidget } from '../lib/gaugePresets';
import { widgetConfigureSlotCells } from '../lib/widgetConfigureLayout';
import { useWidgetConfig } from '../theme/WidgetConfigContext';
import {
  widgetConfigureTemplateCornerRadius,
  widgetConfigureTemplateStrokeWidth,
} from '../theme/standByPreviewLayout';
import { ComplicationSlotButton } from './ComplicationSlotButton';
import { WidgetConfigureRegionGrid } from './WidgetConfigureRegionGrid';

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
  const slotCells = width > 0 ? widgetConfigureSlotCells(width) : [];

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
            overflow: 'hidden',
          }}
        >
          <WidgetConfigureRegionGrid size={width} />

          {slotCells.map(
            ({
              slot,
              kind,
              left,
              top,
              width: cellWidth,
              height: cellHeight,
              buttonWidth,
              buttonHeight,
            }) => (
              <Pressable
                key={slot}
                accessibilityRole="button"
                accessibilityLabel={`${complicationSlotLabels[slot]} complication`}
                className="active:opacity-60"
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: cellWidth,
                  height: cellHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => openPicker(slot)}
              >
                <ComplicationSlotButton
                  slotLabel={complicationSlotLabels[slot]}
                  complicationId={complications[slot]}
                  width={buttonWidth}
                  height={buttonHeight}
                  kind={kind}
                  interactive={false}
                />
              </Pressable>
            ),
          )}
        </View>
      ) : (
        <View style={{ width: '100%', aspectRatio: 1 }} />
      )}
    </View>
  );
}
