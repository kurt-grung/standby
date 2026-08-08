import { Text, View } from 'react-native';

import { nightMode } from './nightColors';
import { dayProgress } from '../../theme/ultra';

type DayProgressStripProps = {
  now: Date;
  batteryPercent?: number;
};

function formatHourLabel(hour: number): string {
  const h = hour % 24;
  const hour12 = h % 12 || 12;
  const suffix = h < 12 ? 'A' : 'P';
  return `${hour12}${suffix}`;
}

export function DayProgressStrip({ now, batteryPercent = 86 }: DayProgressStripProps) {
  const progress = dayProgress(now);
  const percent = Math.round(progress * 100);
  const marks = [0, 6, 12, 18, 24] as const;

  return (
    <View className="w-full">
      <View className="mb-1.5 flex-row items-end justify-between px-0.5">
        <Text
          style={{
            color: nightMode.primary,
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.3,
            fontVariant: ['tabular-nums'],
          }}>
          DAY {percent}%
        </Text>
        <Text
          style={{
            color: nightMode.secondary,
            fontSize: 12,
            fontWeight: '700',
            fontVariant: ['tabular-nums'],
          }}>
          {batteryPercent}%
        </Text>
      </View>

      <View
        className="overflow-hidden rounded-lg px-2 py-2.5"
        style={{ backgroundColor: '#080202', borderWidth: 1.5, borderColor: nightMode.border }}>
        <View className="mb-2 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: nightMode.track }}>
          <View
            className="h-full rounded-full"
            style={{ width: `${percent}%`, backgroundColor: nightMode.primary }}
          />
        </View>

        <View className="flex-row justify-between">
          {marks.map((hour) => (
            <Text
              key={hour}
              style={{
                color: hour / 24 <= progress ? nightMode.primary : nightMode.muted,
                fontSize: 10,
                fontWeight: '800',
                fontVariant: ['tabular-nums'],
              }}>
              {formatHourLabel(hour === 24 ? 0 : hour)}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
