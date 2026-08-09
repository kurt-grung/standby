import { Text, View } from 'react-native';

import { useAppChrome } from '../theme/useAppChrome';
import { nightMode } from './ultra/nightColors';

const wordmarkSize = 28;

export function AppWordmarkHeader() {
  const chrome = useAppChrome();

  return (
    <View className="mb-4 items-end">
      <Text
        accessibilityLabel="StandBy+"
        className="font-extralight tracking-tight"
        style={{ fontSize: wordmarkSize, lineHeight: wordmarkSize + 2 }}
      >
        <Text style={{ color: chrome.colors.primary }}>StandBy</Text>
        <Text style={{ color: nightMode.primary }}>+</Text>
      </Text>
    </View>
  );
}
