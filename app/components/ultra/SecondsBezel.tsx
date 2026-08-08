import { Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { nightMode } from './nightColors';

type SecondsBezelProps = {
  width: number;
  height: number;
  seconds: number;
  inset?: number;
};

export function SecondsBezel({ width, height, seconds, inset = 5 }: SecondsBezelProps) {
  if (width < 40 || height < 40) {
    return null;
  }

  const ticks = 60;
  const cx = width / 2;
  const cy = height / 2;
  const outerRx = width / 2 - inset;
  const outerRy = height / 2 - inset;
  const active = Math.floor(seconds);

  return (
    <View pointerEvents="none" className="absolute inset-0">
      <Svg width={width} height={height}>
        {Array.from({ length: ticks }).map((_, index) => {
          const angle = (index / ticks) * Math.PI * 2 - Math.PI / 2;
          const major = index % 5 === 0;
          const lit = index <= active;
          const innerScale = major ? 0.86 : 0.92;
          const x1 = cx + Math.cos(angle) * outerRx;
          const y1 = cy + Math.sin(angle) * outerRy;
          const x2 = cx + Math.cos(angle) * outerRx * innerScale;
          const y2 = cy + Math.sin(angle) * outerRy * innerScale;
          return (
            <Line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={lit ? nightMode.primary : nightMode.muted}
              strokeWidth={major ? 2.6 : 1.6}
              strokeLinecap="round"
              opacity={lit ? (major ? 1 : 0.8) : major ? 0.5 : 0.32}
            />
          );
        })}
      </Svg>

      <Text
        className="absolute"
        style={{
          top: 4,
          left: 14,
          color: nightMode.secondary,
          fontSize: 9,
          fontWeight: '800',
          fontVariant: ['tabular-nums'],
        }}>
        00
      </Text>
      <Text
        className="absolute"
        style={{
          top: 4,
          right: 14,
          color: nightMode.secondary,
          fontSize: 9,
          fontWeight: '800',
          fontVariant: ['tabular-nums'],
        }}>
        15
      </Text>
      <Text
        className="absolute"
        style={{
          bottom: 4,
          left: 14,
          color: nightMode.secondary,
          fontSize: 9,
          fontWeight: '800',
          fontVariant: ['tabular-nums'],
        }}>
        45
      </Text>
      <Text
        className="absolute"
        style={{
          bottom: 4,
          right: 14,
          color: nightMode.secondary,
          fontSize: 9,
          fontWeight: '800',
          fontVariant: ['tabular-nums'],
        }}>
        30
      </Text>
    </View>
  );
}
