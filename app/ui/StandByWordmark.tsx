import { Text, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

import { groupedWordmarkSize } from '../theme/groupedLayout';
import { standbyDesignSystem } from '../design-system';
import { useAppChrome } from '../theme/useAppChrome';
import { nightMode } from './ultra/nightColors';

type StandByWordmarkAlign = 'start' | 'center' | 'end';

type StandByWordmarkProps = {
  size?: number;
  align?: StandByWordmarkAlign;
  style?: StyleProp<ViewStyle>;
  primaryColor?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
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
  primaryColor,
  onLayout,
}: StandByWordmarkProps) {
  const chrome = useAppChrome();
  const metrics = standByWordmarkMetrics(size);
  const standByColor = primaryColor ?? chrome.colors.primary;

  return (
    <View
      accessibilityLabel="StandBy+"
      className={alignClass[align]}
      style={style}
      onLayout={onLayout}
    >
      <Text className="font-extralight tracking-tight" style={metrics}>
        <Text
          style={{
            color: standByColor,
            letterSpacing: standbyDesignSystem.brand.wordmark.letterSpacing,
            fontWeight: `${standbyDesignSystem.brand.wordmark.weight}`,
          }}
        >
          StandBy
        </Text>
        <Text
          style={{
            color: nightMode.primary,
            fontWeight: `${standbyDesignSystem.brand.wordmark.plusWeight}`,
          }}
        >
          +
        </Text>
      </Text>
    </View>
  );
}
