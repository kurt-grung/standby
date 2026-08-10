import { memo, useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';

import { ArcGauge, TempComplication, UvComplication } from './ArcGauge';
import { ActivityRings } from './ActivityRings';
import { BatteryComplication, NoiseComplication, SunsetComplication } from './Complications';
import { nightMode } from './nightColors';
import { panelLayout, panelRingSize, panelStatusHeroSize } from './panelLayout';
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
    <View style={{ marginBottom: last ? 0 : panelLayout.metricGap }}>
      <View
        className="flex-row items-end justify-between"
        style={{ marginBottom: panelLayout.metricHeadGap }}
      >
        <Text
          style={{
            color: nightMode.secondary,
            fontSize: panelLayout.metricLabelSize,
            fontWeight: '800',
            letterSpacing: 1.2,
            lineHeight: panelLayout.metricLabelSize + 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: nightMode.primary,
            fontSize: panelLayout.metricValueSize,
            fontWeight: '700',
            fontVariant: ['tabular-nums'],
            lineHeight: panelLayout.metricValueSize + 1,
          }}
        >
          {value}
        </Text>
      </View>
      <View
        className="overflow-hidden rounded-full"
        style={{ height: panelLayout.metricBarHeight, backgroundColor: nightMode.track }}
      >
        <View
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: nightMode.primary }}
        />
      </View>
    </View>
  );
}

export const StatusGaugeFace = memo(function StatusGaugeFace({
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
  const ringSize = panelRingSize(size.height);
  const heroSize = panelStatusHeroSize(size.height);

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
      onLayout={onLayout}
    >
      <View
        className="flex-1"
        style={{
          paddingHorizontal: panelLayout.padX,
          paddingVertical: panelLayout.padY,
        }}
      >
        <View className="flex-row items-start justify-between">
          <TempComplication size={ringSize} value={temperature} low={tempLow} high={tempHigh} />
          <NoiseComplication size={ringSize} db={noiseDb} />
          <BatteryComplication size={ringSize} percent={batteryPercent} />
        </View>

        <View
          className="min-h-0 flex-1 items-center justify-center"
          style={{
            marginTop: panelLayout.sectionGap,
            marginBottom: panelLayout.sectionGap,
          }}
        >
          <Text
            style={{
              color: nightMode.secondary,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
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
                }}
              >
                {dayPercent}
              </Text>
              <Text
                style={{
                  color: nightMode.secondary,
                  fontSize: 11,
                  fontWeight: '800',
                  letterSpacing: 2,
                  marginTop: 2,
                }}
              >
                DAY %
              </Text>
            </View>
          </ArcGauge>
        </View>

        <View style={{ marginBottom: panelLayout.sectionGap }}>
          <MetricRow label="FOCUS" value={`${Math.round(focus * 100)}%`} progress={focus} />
          <MetricRow label="BATTERY" value={`${batteryPercent}%`} progress={batteryPercent / 100} />
          <MetricRow label="NOISE" value={`${noiseDb} dB`} progress={noiseDb / 100} last />
        </View>

        <View className="flex-row items-start justify-between">
          <ActivityRings size={ringSize} />
          <SunsetComplication size={ringSize} label={sunsetLabel} />
          <UvComplication size={ringSize} value={uvIndex} />
        </View>
      </View>
    </View>
  );
});
