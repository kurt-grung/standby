import { Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { useAppChrome } from '../theme/useAppChrome';

export function ThemeBadge() {
  const { theme } = useTheme();
  const chrome = useAppChrome();

  return (
    <View
      className="mb-4 flex-row items-center self-start rounded-full border px-3 py-1.5"
      style={{
        borderColor: chrome.colors.border,
        backgroundColor: chrome.colors.surface,
      }}>
      <View className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
      <Text
        className="text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: chrome.colors.secondary }}>
        {theme.badge} widgets
      </Text>
    </View>
  );
}
