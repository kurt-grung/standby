import { Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { FullRing } from './ArcGauge';
import { nightMode } from './nightColors';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

export function DateComplication({ size = 44, now }: { size?: number; now: Date }) {
  const day = now.getDate();
  const weekday = WEEKDAYS[now.getDay()] ?? 'MON';

  return (
    <View className="items-center" style={{ width: size }}>
      <FullRing size={size} progress={day / 31} stroke={size * 0.14}>
        <View className="items-center">
          <Text
            style={{
              color: nightMode.secondary,
              fontSize: 9,
              fontWeight: '800',
              letterSpacing: 0.6,
            }}>
            {weekday}
          </Text>
          <Text
            style={{
              color: nightMode.primary,
              fontSize: size * 0.3,
              fontWeight: '600',
              fontVariant: ['tabular-nums'],
              marginTop: -1,
            }}>
            {day}
          </Text>
        </View>
      </FullRing>
      <View style={{ height: 14, marginTop: 2 }} />
    </View>
  );
}

export function BatteryComplication({ size = 44, percent = 86 }: { size?: number; percent?: number }) {
  const bodyW = size * 0.44;
  const bodyH = size * 0.28;
  const tipW = size * 0.08;
  const fillW = Math.max(3, (bodyW - 6) * Math.min(1, Math.max(0, percent / 100)));

  return (
    <View className="items-center" style={{ width: size }}>
      <FullRing size={size} progress={percent / 100} stroke={size * 0.14}>
        <View className="flex-row items-center">
          <View
            style={{
              width: bodyW,
              height: bodyH,
              borderRadius: 4,
              borderWidth: 2.4,
              borderColor: nightMode.primary,
              justifyContent: 'center',
              paddingHorizontal: 2.5,
            }}>
            <View
              style={{
                width: fillW,
                height: bodyH - 7,
                borderRadius: 2,
                backgroundColor: nightMode.primary,
              }}
            />
          </View>
          <View
            style={{
              width: tipW,
              height: bodyH * 0.5,
              marginLeft: 1.5,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: nightMode.primary,
            }}
          />
        </View>
      </FullRing>
      <View style={{ height: 14, marginTop: 2 }} />
    </View>
  );
}

export function SunsetComplication({ size = 44, label }: { size?: number; label: string }) {
  const cx = size / 2;
  const sunR = size * 0.15;
  const stroke = Math.max(2.6, size * 0.06);

  return (
    <View className="items-center" style={{ width: size }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cx}
            r={(size - stroke) / 2}
            stroke={nightMode.primary}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle cx={cx} cy={size * 0.42} r={sunR} fill={nightMode.primary} />
          <Line
            x1={size * 0.2}
            y1={size * 0.62}
            x2={size * 0.8}
            y2={size * 0.62}
            stroke={nightMode.primary}
            strokeWidth={2.8}
            strokeLinecap="round"
          />
          <Path
            d={`M ${size * 0.2} ${size * 0.62} Q ${cx} ${size * 0.8} ${size * 0.8} ${size * 0.62}`}
            stroke={nightMode.secondary}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      </View>
      <View style={{ height: 14, marginTop: 2, justifyContent: 'center' }}>
        <Text
          style={{
            color: nightMode.primary,
            fontSize: 10,
            fontWeight: '800',
            fontVariant: ['tabular-nums'],
            letterSpacing: 0.2,
          }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

export function NoiseComplication({ size = 44, db = 42 }: { size?: number; db?: number }) {
  return (
    <View className="items-center" style={{ width: size }}>
      <FullRing size={size} progress={Math.min(1, db / 100)} stroke={size * 0.14}>
        <View className="items-center">
          <Svg width={size * 0.42} height={size * 0.3}>
            <Rect x={0} y={size * 0.1} width={4} height={size * 0.14} fill={nightMode.primary} rx={1.5} />
            <Rect x={7} y={size * 0.04} width={4} height={size * 0.22} fill={nightMode.primary} rx={1.5} />
            <Rect x={14} y={0} width={4} height={size * 0.3} fill={nightMode.secondary} rx={1.5} />
          </Svg>
          <Text
            style={{
              color: nightMode.primary,
              fontSize: 11,
              fontWeight: '700',
              fontVariant: ['tabular-nums'],
              marginTop: 1,
            }}>
            {db}
          </Text>
        </View>
      </FullRing>
      <View style={{ height: 14, marginTop: 2 }} />
    </View>
  );
}
