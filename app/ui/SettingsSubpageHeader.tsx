import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { standbyDesignSystem } from '../design-system';
import { groupedWordmarkBottomSpacing } from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';
import { standByWordmarkMetrics } from './StandByWordmark';
import { SfSymbolIcon } from './SfSymbolIcon';

const wordmarkMetrics = standByWordmarkMetrics(standbyDesignSystem.brand.wordmark.size);

type SettingsSubpageHeaderProps = {
  title: string;
};

export function SettingsSubpageHeader({ title }: SettingsSubpageHeaderProps) {
  const router = useRouter();
  const chrome = useAppChrome();

  return (
    <View
      className="flex-row items-center"
      style={{
        marginTop: 16,
        marginBottom: groupedWordmarkBottomSpacing,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Settings"
        className="active:opacity-70"
        hitSlop={12}
        onPress={() => router.back()}
      >
        <SfSymbolIcon
          name="chevron.left"
          size={20}
          tintColor={chrome.colors.primary}
          weight="semibold"
        />
      </Pressable>
      <Text
        className="ml-2 flex-1 text-right font-extralight tracking-tight"
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
