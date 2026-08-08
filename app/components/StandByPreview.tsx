import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { CircularCapacity } from './CircularCapacity';
import { dayProgress } from '../theme/ultra';
import { useTheme } from '../theme/ThemeContext';

function formatWidgetTime(date: Date): string {
  const hour12 = date.getHours() % 12 || 12;
  const minute = date.getMinutes();
  const minuteLabel = minute < 10 ? `0${minute}` : `${minute}`;
  return `${hour12}:${minuteLabel}`;
}

type StandByPreviewProps = {
  gaugeValue?: number;
  gaugeLabel?: string;
};

export function StandByPreview({ gaugeValue = 0, gaugeLabel = 'DAY' }: StandByPreviewProps) {
  const { theme } = useTheme();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(timer);
  }, []);

  const progress = dayProgress(now);
  const displayValue = gaugeValue > 0 ? gaugeValue : progress;
  const percent = Math.round(displayValue * 100);
  const accent = theme.colors.accent;
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const track = theme.colors.track;

  return (
    <View className="flex-1 flex-row items-stretch" style={{ backgroundColor: theme.colors.bg }}>
      <View
        className="flex-1 items-center justify-center rounded-[36px] border"
        style={{
          backgroundColor: theme.colors.bg,
          borderColor: theme.colors.border,
        }}>
        <CircularCapacity size={56} accent={accent} track={track} stroke={5} />
        <Text
          className="mt-5 text-[56px] font-light tracking-tight"
          style={{ color: primary, fontVariant: ['tabular-nums'] }}>
          {formatWidgetTime(now)}
        </Text>
      </View>

      <View className="w-4" />

      <View
        className="flex-1 items-center justify-center rounded-[36px] border"
        style={{
          backgroundColor: theme.colors.bg,
          borderColor: theme.colors.border,
        }}>
        <CircularCapacity size={120} accent={accent} track={track} stroke={8}>
          <Text
            className="text-[36px] font-light"
            style={{ color: primary, fontVariant: ['tabular-nums'] }}>
            {percent}
          </Text>
        </CircularCapacity>
        <Text
          className="mt-4 text-sm font-bold tracking-widest"
          style={{ color: secondary }}>
          {gaugeLabel}
        </Text>
      </View>
    </View>
  );
}
