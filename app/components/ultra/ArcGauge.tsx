import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { nightMode } from './nightColors';

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polar(cx, cy, radius, endAngle);
  const end = polar(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

type ArcGaugeProps = {
  size: number;
  progress: number;
  stroke?: number;
  startAngle?: number;
  sweepAngle?: number;
  children?: ReactNode;
};

export function ArcGauge({
  size,
  progress,
  stroke = 5.5,
  startAngle = -210,
  sweepAngle = 240,
  children,
}: ArcGaugeProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - stroke) / 2;
  const endAngle = startAngle + sweepAngle * clamped;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Path
          d={describeArc(cx, cy, radius, startAngle, startAngle + sweepAngle)}
          stroke={nightMode.track}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
        {clamped > 0.01 ? (
          <Path
            d={describeArc(cx, cy, radius, startAngle, endAngle)}
            stroke={nightMode.primary}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
          />
        ) : null}
      </Svg>
      {children}
    </View>
  );
}

type FullRingProps = {
  size: number;
  progress: number;
  stroke?: number;
  children?: ReactNode;
};

export function FullRing({ size, progress, stroke = 5.5, children }: FullRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={nightMode.track}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={nightMode.primary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference * clamped} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      {children}
    </View>
  );
}

type TempComplicationProps = {
  size: number;
  value: number;
  low: number;
  high: number;
};

export function TempComplication({ size, value, low, high }: TempComplicationProps) {
  const progress = (value - low) / Math.max(1, high - low);

  return (
    <View className="items-center" style={{ width: size + 4 }}>
      <ArcGauge size={size} progress={progress} stroke={size * 0.14}>
        <Text
          style={{
            color: nightMode.primary,
            fontSize: size * 0.34,
            fontWeight: '600',
            fontVariant: ['tabular-nums'],
          }}>
          {value}
        </Text>
      </ArcGauge>
      <View className="mt-0.5 w-full flex-row justify-between px-0.5">
        <Text
          style={{
            color: nightMode.secondary,
            fontSize: 9,
            fontWeight: '700',
            fontVariant: ['tabular-nums'],
          }}>
          {low}
        </Text>
        <Text
          style={{
            color: nightMode.secondary,
            fontSize: 9,
            fontWeight: '700',
            fontVariant: ['tabular-nums'],
          }}>
          {high}
        </Text>
      </View>
    </View>
  );
}

type UvComplicationProps = {
  size: number;
  value: number;
};

export function UvComplication({ size, value }: UvComplicationProps) {
  return (
    <View className="items-center" style={{ width: size + 2 }}>
      <ArcGauge size={size} progress={Math.min(1, value / 11)} stroke={size * 0.14}>
        <View className="items-center">
          <Text
            style={{
              color: nightMode.primary,
              fontSize: size * 0.34,
              fontWeight: '600',
              fontVariant: ['tabular-nums'],
              marginTop: -2,
            }}>
            {value}
          </Text>
          <View
            style={{
              width: size * 0.2,
              height: size * 0.2,
              borderRadius: size,
              backgroundColor: nightMode.primary,
              marginTop: 1,
            }}
          />
        </View>
      </ArcGauge>
    </View>
  );
}
