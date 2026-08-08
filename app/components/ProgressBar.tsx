import { View } from 'react-native';

import { useAppChrome } from '../theme/useAppChrome';

export function ProgressBar({ value }: { value: number }) {
  const chrome = useAppChrome();
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <View className="mt-4">
      <View className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: chrome.colors.track }}>
        <View
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: chrome.colors.primary }}
        />
      </View>
    </View>
  );
}
