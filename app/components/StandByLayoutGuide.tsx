import { Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';

type StandBySlotProps = {
  side: 'Left' | 'Right';
  widget: string;
  accent: string;
};

function StandBySlot({ side, widget, accent }: StandBySlotProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-1">
      <Text
        className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: theme.colors.muted }}>
        {side}
      </Text>
      <View
        className="min-h-[112px] items-center justify-center rounded-2xl border px-3 py-4"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.bg,
        }}>
        <View
          className="mb-3 h-10 w-10 rounded-full border-2"
          style={{ borderColor: accent }}
        />
        <Text className="text-center text-sm font-medium" style={{ color: theme.colors.primary }}>
          {widget}
        </Text>
        <Text className="mt-1 text-center text-[11px]" style={{ color: theme.colors.secondary }}>
          Small
        </Text>
      </View>
    </View>
  );
}

export function StandByLayoutGuide() {
  const { theme } = useTheme();

  return (
    <View className="mt-4">
      <View
        className="rounded-3xl border p-4"
        style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.bg }}>
        <View className="mb-3 flex-row items-center justify-between px-1">
          <StandBySlot side="Left" widget="Ultra Clock" accent={theme.colors.accent} />
          <View className="mx-2 w-px self-stretch" style={{ backgroundColor: theme.colors.border }} />
          <View className="items-center justify-center px-1" style={{ width: 72 }}>
            <Text
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: theme.colors.muted }}>
              Center
            </Text>
            <Text className="mt-3 text-2xl font-extralight" style={{ color: theme.colors.primary }}>
              9:41
            </Text>
          </View>
          <View className="mx-2 w-px self-stretch" style={{ backgroundColor: theme.colors.border }} />
          <StandBySlot side="Right" widget="Ultra Gauge" accent={theme.colors.accent} />
        </View>
      </View>
      <Text className="mt-3 text-sm leading-5" style={{ color: theme.colors.secondary }}>
        Use the small size in each side column. The center stays on the clock page unless you swap
        it in Edit.
      </Text>
    </View>
  );
}
