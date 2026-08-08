import { useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';

import { ArcGauge, TempComplication, UvComplication } from './ArcGauge';
import { ActivityRings } from './ActivityRings';
import { BatteryComplication, NoiseComplication, SunsetComplication } from './Complications';
import { nightMode } from './nightColors';
import { dayProgress } from '../../theme/ultra';

type StatusGaugeFaceProps = {
  now: Date;
  temperature?: number;
  tempLow?: number;
  tempHigh?: number;
  uvIndex?: number;
  sunsetLabel?: string;
  batteryPercent?: number;
  noiseDb?: number;
  focusPercent?: number;
};

type MetricRowProps = {
  label: string;
  value: string;
  progress: number;
  last?: boolean;
};

function MetricRow({ label, value, progress, last = false }: MetricRowProps) {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <View style={{ marginBottom: last ? 0 : 8 }}>
      <View className="mb-1 flex-row items-end justify-between">
        <Text
          style={{
            color: nightMode.secondary,
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 1.2,
          }}>
          {label}
        </Text>
        <Text
          style={{
            color: nightMode.primary,
            fontSize: 13,
            fontWeight: '700',
            fontVariant: ['tabular-nums'],
          }}>
          {value}
        </Text>
      </View>
      <View
        className="overflow-hidden rounded-full"
        style={{ height: 8, backgroundColor: nightMode.track }}>
        <View
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: nightMode.primary }}
        />
      </View>
    </View>
  );
}

export function StatusGaugeFace({
  now,
  temperature = 68,
  tempLow = 49,
  tempHigh = 84,
  uvIndex = 4,
  sunsetLabel = '7:31PM',
  batteryPercent = 74,
  noiseDb = 38,
  focusPercent,
}: StatusGaugeFaceProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const progress = dayProgress(now);
  const dayPercent = Math.round(progress * 100);
  const focus = focusPercent ?? Math.max(0.2, 1 - progress);

  const ringSize =
    size.height > 0
      ? Math.min(50, Math.max(38, size.height * 0.125))
      : 44;
  const heroSize =
    size.height > 0
      ? Math.min(124, Math.max(88, size.height * 0.3))
      : 108;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View
      className="flex-1 overflow-hidden rounded-[34px]"
      style={{
        backgroundColor: nightMode.bg,
        borderWidth: 1.5,
        borderColor: nightMode.border,
      }}
      onLayout={onLayout}>
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-start justify-between">
          <TempComplication
            size={ringSize}
            value={temperature}
            low={tempLow}
            high={tempHigh}
          />
          <NoiseComplication size={ringSize} db={noiseDb} />
          <BatteryComplication size={ringSize} percent={batteryPercent} />
        </View>

        <View className="min-h-0 flex-1 items-center justify-center">
          <Text
            style={{
              color: nightMode.secondary,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 2,
              marginBottom: 4,
            }}>
            STATUS
          </Text>
          <ArcGauge size={heroSize} progress={progress} stroke={heroSize * 0.11}>
            <View className="items-center">
              <Text
                style={{
                  color: nightMode.primary,
                  fontSize: heroSize * 0.28,
                  fontWeight: '600',
                  fontVariant: ['tabular-nums'],
                  lineHeight: heroSize * 0.3,
                }}>
                {dayPercent}
              </Text>
              <Text
                style={{
                  color: nightMode.secondary,
                  fontSize: 11,
                  fontWeight: '800',
                  letterSpacing: 2,
                  marginTop: 2,
                }}>
                DAY %
              </Text>
            </View>
          </ArcGauge>
        </View>

        <View style={{ marginBottom: 10 }}>
          <MetricRow
            label="FOCUS"
            value={`${Math.round(focus * 100)}%`}
            progress={focus}
          />
          <MetricRow
            label="BATTERY"
            value={`${batteryPercent}%`}
            progress={batteryPercent / 100}
          />
          <MetricRow
            label="NOISE"
            value={`${noiseDb} dB`}
            progress={noiseDb / 100}
            last
          />
        </View>

        <View className="flex-row items-start justify-between">
          <ActivityRings size={ringSize} />
          <SunsetComplication size={ringSize} label={sunsetLabel} />
          <UvComplication size={ringSize} value={uvIndex} />
        </View>
      </View>
    </View>
  );
}
