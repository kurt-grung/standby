import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import type { ComplicationId } from '../lib/complicationOptions';
import { complicationOptionById } from '../lib/complicationOptions';
import {
  widgetConfigureSlotButtonSize,
  widgetConfigureSlotPlusSize,
} from '../theme/standByPreviewLayout';

const configureSlotColor = '#FFFFFF';

type ComplicationSlotButtonProps = {
  slotLabel: string;
  complicationId: ComplicationId | null;
  onPress: () => void;
};

export function ComplicationSlotButton({
  slotLabel,
  complicationId,
  onPress,
}: ComplicationSlotButtonProps) {
  const option = complicationOptionById(complicationId);
  const size = widgetConfigureSlotButtonSize;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        option
          ? `Change ${option.label} complication, ${slotLabel}`
          : `Add complication, ${slotLabel}`
      }
      className="items-center justify-center active:opacity-70"
      hitSlop={6}
      onPress={onPress}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: configureSlotColor,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      >
        {option ? (
          <SymbolView
            name={option.icon}
            size={size * 0.42}
            tintColor={configureSlotColor}
            weight="semibold"
          />
        ) : (
          <SymbolView
            name="plus"
            size={widgetConfigureSlotPlusSize}
            tintColor={configureSlotColor}
            weight="semibold"
          />
        )}
      </View>
    </Pressable>
  );
}
