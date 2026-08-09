import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { groupedWordmarkSize } from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';
import { nightMode } from './ultra/nightColors';

type StandByWordmarkAlign = 'start' | 'center' | 'end';

type StandByWordmarkProps = {
  size?: number;
  align?: StandByWordmarkAlign;
  style?: StyleProp<ViewStyle>;
};

export function standByWordmarkMetrics(size: number) {
  return {
    fontSize: size,
    lineHeight: size + 2,
  };
}

const alignClass: Record<StandByWordmarkAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

export function StandByWordmark({
  size = groupedWordmarkSize,
  align = 'end',
  style,
}: StandByWordmarkProps) {
  const chrome = useAppChrome();
  const metrics = standByWordmarkMetrics(size);

  return (
    <View accessibilityLabel="StandBy+" className={alignClass[align]} style={style}>
      <Text className="font-extralight tracking-tight" style={metrics}>
        <Text style={{ color: chrome.colors.primary, letterSpacing: -0.3, fontWeight: '200' }}>
          StandBy
        </Text>
        <Text style={{ color: nightMode.primary, fontWeight: '300' }}>+</Text>
      </Text>
    </View>
  );
}
