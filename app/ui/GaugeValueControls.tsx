import type { ReactNode } from 'react';
import { SfSymbolIcon } from './SfSymbolIcon';
import { Pressable, Text, View } from 'react-native';

type GaugeValueControlsProps = {
  accent: string;
  accentSoft: string;
  increaseAccent: string;
  border: string;
  text: string;
  onDecrease: () => void;
  onAuto: () => void;
  onIncrease: () => void;
};

const controlHeight = 44;

type ControlCellProps = {
  border: string;
  showDivider?: boolean;
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  backgroundColor?: string;
};

function ControlCell({
  border,
  showDivider = true,
  children,
  onPress,
  accessibilityLabel,
  backgroundColor = 'transparent',
}: ControlCellProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="flex-1 items-center justify-center active:opacity-70"
      style={{
        height: controlHeight,
        backgroundColor,
        borderRightWidth: showDivider ? 1 : 0,
        borderRightColor: border,
      }}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

export function GaugeValueControls({
  accent,
  accentSoft,
  increaseAccent,
  border,
  text,
  onDecrease,
  onAuto,
  onIncrease,
}: GaugeValueControlsProps) {
  return (
    <View className="flex-row">
      <ControlCell accessibilityLabel="Decrease gauge value" border={border} onPress={onDecrease}>
        <SfSymbolIcon name="minus" size={16} tintColor={text} weight="semibold" />
      </ControlCell>
      <ControlCell
        accessibilityLabel="Use automatic day progress"
        backgroundColor={accentSoft}
        border={border}
        onPress={onAuto}
      >
        <Text
          className="text-[13px] font-semibold uppercase tracking-wide"
          style={{ color: accent }}
        >
          Auto
        </Text>
      </ControlCell>
      <ControlCell
        accessibilityLabel="Increase gauge value"
        backgroundColor={increaseAccent}
        border={border}
        showDivider={false}
        onPress={onIncrease}
      >
        <SfSymbolIcon name="plus" size={16} tintColor="#FFFFFF" weight="semibold" />
      </ControlCell>
    </View>
  );
}
