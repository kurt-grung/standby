import { Button, Host, HStack } from '@expo/ui/swift-ui';
import {
  buttonBorderShape,
  buttonStyle,
  controlSize,
  frame,
  labelStyle,
} from '@expo/ui/swift-ui/modifiers';
import { Platform, Pressable, Text, View } from 'react-native';

type GaugeValueControlsProps = {
  accent: string;
  border: string;
  surface: string;
  text: string;
  onDecrease: () => void;
  onAuto: () => void;
  onIncrease: () => void;
};

const controlHeight = 52;

export function GaugeValueControls({
  accent,
  border,
  surface,
  text,
  onDecrease,
  onAuto,
  onIncrease,
}: GaugeValueControlsProps) {
  if (Platform.OS !== 'ios') {
    return (
      <View className="flex-row">
        <Pressable
          accessibilityLabel="Decrease gauge value"
          className="mr-2 min-h-[52px] flex-1 items-center justify-center rounded-2xl border active:opacity-70"
          style={{ borderColor: border, backgroundColor: surface }}
          onPress={onDecrease}>
          <Text className="text-2xl font-semibold" style={{ color: text }}>
            −
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Use automatic day progress"
          className="mr-2 min-h-[52px] flex-1 items-center justify-center rounded-2xl border active:opacity-70"
          style={{ borderColor: `${accent}80`, backgroundColor: `${accent}26` }}
          onPress={onAuto}>
          <Text className="text-sm font-semibold uppercase tracking-wide" style={{ color: accent }}>
            Auto
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Increase gauge value"
          className="min-h-[52px] flex-1 items-center justify-center rounded-2xl border active:opacity-70"
          style={{ borderColor: border, backgroundColor: surface }}
          onPress={onIncrease}>
          <Text className="text-2xl font-semibold" style={{ color: text }}>
            +
          </Text>
        </Pressable>
      </View>
    );
  }

  const sharedFrame = frame({ maxWidth: Infinity, minHeight: controlHeight });
  const iconButtonModifiers = [
    sharedFrame,
    controlSize('large'),
    buttonStyle('bordered'),
    buttonBorderShape('roundedRectangle', 16),
    labelStyle('iconOnly'),
  ];
  const autoButtonModifiers = [
    sharedFrame,
    controlSize('large'),
    buttonStyle('borderedProminent'),
    buttonBorderShape('roundedRectangle', 16),
  ];

  return (
    <View style={{ width: '100%', height: controlHeight }}>
      <Host
        colorScheme="dark"
        matchContents={{ horizontal: true, vertical: true }}
        seedColor={accent}
        style={{ flex: 1, width: '100%' }}>
        <HStack spacing={8}>
          <Button
            label="Decrease"
            systemImage="minus"
            onPress={onDecrease}
            modifiers={iconButtonModifiers}
          />
          <Button label="Auto" onPress={onAuto} modifiers={autoButtonModifiers} />
          <Button
            label="Increase"
            systemImage="plus"
            onPress={onIncrease}
            modifiers={iconButtonModifiers}
          />
        </HStack>
      </Host>
    </View>
  );
}
