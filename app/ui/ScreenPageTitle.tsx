import { Text, View } from 'react-native';

import { standbyDesignSystem } from '../design-system';
import {
  groupedHomeWordmarkTopSpacing,
  groupedWordmarkBottomSpacing,
  groupedWordmarkSize,
} from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';
import { standByWordmarkMetrics } from './StandByWordmark';

const wordmarkMetrics = standByWordmarkMetrics(groupedWordmarkSize);

type ScreenPageTitleProps = {
  title: string;
};

export function ScreenPageTitle({ title }: ScreenPageTitleProps) {
  const chrome = useAppChrome();

  return (
    <View
      className="flex-row items-baseline justify-end"
      style={{
        marginTop: groupedHomeWordmarkTopSpacing,
        marginBottom: groupedWordmarkBottomSpacing,
      }}
    >
      <Text
        className="font-extralight tracking-tight"
        style={{
          color: chrome.colors.primary,
          letterSpacing: standbyDesignSystem.brand.wordmark.letterSpacing,
          fontWeight: `${standbyDesignSystem.brand.wordmark.weight}`,
          ...wordmarkMetrics,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
