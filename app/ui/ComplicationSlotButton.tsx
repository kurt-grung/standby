import { SfSymbolIcon } from './SfSymbolIcon';
import { Pressable, View } from 'react-native';

import type { ComplicationId, ComplicationSlotKind } from '../lib/complicationOptions';
import { complicationOptionById } from '../lib/complicationOptions';
import {
  widgetConfigurePlusSize,
  widgetConfigureSlotBorderWidth,
  widgetConfigureSlotCornerRadius,
} from '../lib/widgetConfigureLayout';

const configureFg = '#FFFFFF';

type ComplicationSlotButtonProps = {
  slotLabel: string;
  complicationId: ComplicationId | null;
  width: number;
  height: number;
  kind?: ComplicationSlotKind;
  interactive?: boolean;
  onPress?: () => void;
};

export function ComplicationSlotButton({
  slotLabel,
  complicationId,
  width,
  height,
  kind = 'small',
  interactive = true,
  onPress,
}: ComplicationSlotButtonProps) {
  const option = complicationOptionById(complicationId);
  const referenceSize = Math.min(width, height);
  const plusSize = widgetConfigurePlusSize(referenceSize);
  const borderWidth = widgetConfigureSlotBorderWidth();
  const cornerRadius = widgetConfigureSlotCornerRadius(height);
  const iconSize = kind === 'large' ? referenceSize * 0.34 : Math.min(height * 0.55, width * 0.32);

  const content = (
    <View
      style={{
        width,
        height,
        borderRadius: cornerRadius,
        borderWidth,
        borderColor: configureFg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      {option ? (
        <SfSymbolIcon
          name={option.icon}
          size={iconSize}
          tintColor={configureFg}
          weight="semibold"
        />
      ) : (
        <SfSymbolIcon name="plus" size={plusSize} tintColor={configureFg} weight="semibold" />
      )}
    </View>
  );

  if (!interactive) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        option
          ? `Change ${option.label} complication, ${slotLabel}`
          : `Add complication, ${slotLabel}`
      }
      className="active:opacity-60"
      hitSlop={6}
      onPress={onPress}
    >
      {content}
    </Pressable>
  );
}
