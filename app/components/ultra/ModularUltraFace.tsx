import { memo, useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';

import { TempComplication, UvComplication } from './ArcGauge';
import { ActivityRings } from './ActivityRings';
import { BatteryComplication, DateComplication, SunsetComplication } from './Complications';
import { DayProgressStrip } from './DayProgressStrip';
import { nightMode } from './nightColors';
import { panelLayout, panelRingSize, panelTimeSize } from './panelLayout';
import { SecondsBezel } from './SecondsBezel';

type ModularUltraFaceProps = {
  now: Date;
  temperature?: number;
  tempLow?: number;
  tempHigh?: number;
  uvIndex?: number;
  sunsetLabel?: string;
  batteryPercent?: number;
};

function formatTime(date: Date): string {
  const hour12 = date.getHours() % 12 || 12;
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const minuteLabel = minute < 10 ? `0${minute}` : `${minute}`;
  const secondLabel = second < 10 ? `0${second}` : `${second}`;
  return `${hour12}:${minuteLabel}:${secondLabel}`;
}

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const;
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

export const ModularUltraFace = memo(function ModularUltraFace({
  now,
  temperature = 72,
  tempLow = 52,
  tempHigh = 89,
  uvIndex = 5,
  sunsetLabel = '7:29PM',
  batteryPercent = 86,
}: ModularUltraFaceProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const timeLabel = formatTime(now);
  const ringSize = panelRingSize(size.height);
  const timeSize = panelTimeSize(size.height, size.width);
  const dateLabel = `${WEEKDAYS[now.getDay()]} ${MONTHS[now.getMonth()]} ${now.getDate()}`;

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
      <SecondsBezel width={size.width} height={size.height} inset={1.5} cornerRadius={32} />

      <View
        className="flex-1"
        style={{
          paddingHorizontal: panelLayout.padX,
          paddingVertical: panelLayout.padY,
        }}
      >
        <View className="flex-row items-start justify-between">
          <TempComplication size={ringSize} value={temperature} low={tempLow} high={tempHigh} />
          <DateComplication size={ringSize} now={now} />
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
              marginBottom: 4,
            }}
          >
            CLOCK
          </Text>
          <Text
            style={{
              color: nightMode.primary,
              fontSize: timeSize,
              fontWeight: '600',
              letterSpacing: 0.2,
              fontVariant: ['tabular-nums'],
              lineHeight: timeSize + 2,
              textShadowColor: nightMode.glow,
              textShadowRadius: 12,
              textShadowOffset: { width: 0, height: 0 },
            }}
          >
            {timeLabel}
          </Text>
          <Text
            style={{
              marginTop: 4,
              color: nightMode.secondary,
              fontSize: 12,
              fontWeight: '800',
              letterSpacing: 1.4,
            }}
          >
            {dateLabel}
          </Text>
        </View>

        <View style={{ marginBottom: panelLayout.sectionGap }}>
          <DayProgressStrip now={now} batteryPercent={batteryPercent} />
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
