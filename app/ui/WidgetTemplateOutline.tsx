import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import {
  complicationBottomSlots,
  complicationOptionsForWidget,
  complicationSlotLabels,
  complicationTopSlots,
  type ComplicationSlotId,
} from '../lib/complicationOptions';
import type { ConfigureWidget } from '../lib/gaugePresets';
import { useWidgetConfig } from '../theme/WidgetConfigContext';
import {
  widgetConfigureSlotInsetRatio,
  widgetConfigureTemplateCornerRadius,
  widgetConfigureTemplateStrokeWidth,
  widgetConfigureTemplateVerticalPadding,
} from '../theme/standByPreviewLayout';
import { ComplicationPickerSheet } from './ComplicationPickerSheet';
import { ComplicationSlotButton } from './ComplicationSlotButton';
import { nightMode } from './ultra/nightColors';

type WidgetConfigureTemplateProps = {
  widget: ConfigureWidget;
};

type ActivePicker = {
  slot: ComplicationSlotId;
} | null;

export function WidgetConfigureTemplate({ widget }: WidgetConfigureTemplateProps) {
  const { getComplications, setComplication } = useWidgetConfig();
  const complications = getComplications(widget);
  const [width, setWidth] = useState(0);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const slotInset = Math.round(width * widgetConfigureSlotInsetRatio);
  const cornerRadius = widgetConfigureTemplateCornerRadius(width);
  const pickerSlot = activePicker?.slot ?? null;
  const pickerOptions = complicationOptionsForWidget(widget);

  return (
    <>
      <View
        onLayout={onLayout}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: widgetConfigureTemplateVerticalPadding,
          backgroundColor: nightMode.bg,
        }}
      >
        {width > 0 ? (
          <View
            style={{
              width,
              height: width,
              borderRadius: cornerRadius,
              borderWidth: widgetConfigureTemplateStrokeWidth,
              borderColor: '#FFFFFF',
              backgroundColor: 'transparent',
              padding: slotInset,
            }}
          >
            <View className="flex-row items-start justify-between">
              {complicationTopSlots.map((slot) => (
                <ComplicationSlotButton
                  key={slot}
                  slotLabel={complicationSlotLabels[slot]}
                  complicationId={complications[slot]}
                  onPress={() => setActivePicker({ slot })}
                />
              ))}
            </View>

            <View className="flex-1" />

            <View className="flex-row items-end justify-between">
              {complicationBottomSlots.map((slot) => (
                <ComplicationSlotButton
                  key={slot}
                  slotLabel={complicationSlotLabels[slot]}
                  complicationId={complications[slot]}
                  onPress={() => setActivePicker({ slot })}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <ComplicationPickerSheet
        visible={pickerSlot !== null}
        slotLabel={pickerSlot ? complicationSlotLabels[pickerSlot] : ''}
        options={pickerOptions}
        selectedId={pickerSlot ? complications[pickerSlot] : null}
        onSelect={(id) => {
          if (!pickerSlot) return;
          setComplication(widget, pickerSlot, id);
        }}
        onClose={() => setActivePicker(null)}
      />
    </>
  );
}
