import type { ReactNode } from 'react';
import { View } from 'react-native';

type CircularCapacityProps = {
  size: number;
  accent: string;
  track: string;
  stroke?: number;
  children?: ReactNode;
};

export function CircularCapacity({
  size,
  accent,
  track,
  stroke = 4,
  children,
}: CircularCapacityProps) {
  const radius = size / 2;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <View
        className="absolute"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: stroke,
          borderColor: track,
        }}
      />
      <View
        className="absolute"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: stroke,
          borderTopColor: accent,
          borderRightColor: accent,
          borderBottomColor: track,
          borderLeftColor: track,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      {children}
    </View>
  );
}
