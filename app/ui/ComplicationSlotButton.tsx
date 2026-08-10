import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import type { ComplicationId } from '../lib/complicationOptions';
import { complicationOptionById } from '../lib/complicationOptions';
import {
  widgetConfigurePlusSize,
  widgetConfigureSlotBorderWidth,
} from '../lib/widgetConfigureLayout';

const configureFg = '#FFFFFF';

type ComplicationSlotButtonProps = {
  slotLabel: string;
  complicationId: ComplicationId | null;
  size: number;
  onPress: () => void;
};

export function ComplicationSlotButton({
  slotLabel,
  complicationId,
  size,
  onPress,
}: ComplicationSlotButtonProps) {
  const option = complicationOptionById(complicationId);
  const plusSize = widgetConfigurePlusSize(size);
  const borderWidth = widgetConfigureSlotBorderWidth(size);

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
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: configureFg,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      >
        {option ? (
          <SymbolView
            name={option.icon}
            size={size * 0.42}
            tintColor={configureFg}
            weight="semibold"
          />
        ) : (
          <SymbolView name="plus" size={plusSize} tintColor={configureFg} weight="semibold" />
        )}
      </View>
    </Pressable>
  );
}
