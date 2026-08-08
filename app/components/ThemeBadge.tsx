import { Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';

export function ThemeBadge() {
  const { theme } = useTheme();

  return (
    <View
      className="mb-4 flex-row items-center self-start rounded-full border px-3 py-1.5"
      style={{
        borderColor: `${theme.colors.accent}66`,
        backgroundColor: theme.colors.accentSoft,
      }}>
      <View className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
      <Text
        className="text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: theme.colors.accent }}>
        {theme.badge}
      </Text>
    </View>
  );
}
