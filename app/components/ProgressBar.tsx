import { View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';

export function ProgressBar({ value }: { value: number }) {
  const { theme } = useTheme();
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <View className="mt-4">
      <View className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: theme.colors.track }}>
        <View
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: theme.colors.accent }}
        />
      </View>
    </View>
  );
}
