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
};

function MetricRow({ label, value, progress }: MetricRowProps) {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <View className="mb-2.5">
      <View className="mb-1 flex-row items-end justify-between">
        <Text
          style={{
            color: nightMode.secondary,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 1.2,
          }}>
          {label}
        </Text>
        <Text
          style={{
            color: nightMode.primary,
            fontSize: 14,
            fontWeight: '700',
            fontVariant: ['tabular-nums'],
          }}>
          {value}
        </Text>
      </View>
      <View className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: nightMode.track }}>
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
  const ringSize = size.width > 360 ? 52 : 44;
  const heroSize = size.width > 360 ? 148 : 128;

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
      <View className="flex-1 justify-between px-6 py-5">
        <View className="flex-row items-center justify-between">
          <Text
            style={{
              color: nightMode.secondary,
              fontSize: 12,
              fontWeight: '800',
              letterSpacing: 2,
            }}>
            STATUS
          </Text>
          <Text
            style={{
              color: nightMode.primary,
              fontSize: 12,
              fontWeight: '800',
              letterSpacing: 1.2,
              fontVariant: ['tabular-nums'],
            }}>
            {batteryPercent}% BAT
          </Text>
        </View>

        <View className="items-center py-1">
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
                  fontSize: 12,
                  fontWeight: '800',
                  letterSpacing: 2,
                  marginTop: 2,
                }}>
                DAY %
              </Text>
            </View>
          </ArcGauge>
        </View>

        <View>
          <MetricRow label="FOCUS" value={`${Math.round(focus * 100)}%`} progress={focus} />
          <MetricRow label="BATTERY" value={`${batteryPercent}%`} progress={batteryPercent / 100} />
          <MetricRow label="NOISE" value={`${noiseDb} dB`} progress={noiseDb / 100} />
        </View>

        <View className="flex-row items-end justify-between">
          <TempComplication
            size={ringSize}
            value={temperature}
            low={tempLow}
            high={tempHigh}
          />
          <ActivityRings size={ringSize + 4} />
          <SunsetComplication size={ringSize} label={sunsetLabel} />
          <UvComplication size={ringSize} value={uvIndex} />
        </View>

        <View className="flex-row items-center justify-between px-1">
          <BatteryComplication size={36} percent={batteryPercent} />
          <Text
            style={{
              color: nightMode.muted,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 2,
            }}>
            ULTRA NIGHT
          </Text>
          <NoiseComplication size={36} db={noiseDb} />
        </View>
      </View>
    </View>
  );
}
