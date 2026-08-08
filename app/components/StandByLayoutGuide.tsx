import { Text, View } from 'react-native';

import { useAppChrome } from '../theme/useAppChrome';
import { nightMode } from './ultra/nightColors';

type StandBySlotProps = {
  side: 'Left' | 'Right';
  widget: string;
};

function StandBySlot({ side, widget }: StandBySlotProps) {
  const chrome = useAppChrome();

  return (
    <View className="flex-1">
      <Text
        className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: chrome.colors.muted }}>
        {side}
      </Text>
      <View
        className="min-h-[112px] items-center justify-center rounded-2xl border px-3 py-4"
        style={{
          borderColor: chrome.colors.border,
          backgroundColor: '#000000',
        }}>
        <View className="mb-3 h-10 w-10 rounded-full border-2" style={{ borderColor: nightMode.primary }} />
        <Text className="text-center text-sm font-medium" style={{ color: '#FFFFFF' }}>
          {widget}
        </Text>
        <Text className="mt-1 text-center text-[11px]" style={{ color: '#8E8E93' }}>
          Small
        </Text>
      </View>
    </View>
  );
}

export function StandByLayoutGuide() {
  const chrome = useAppChrome();

  return (
    <View className="mt-4">
      <View
        className="rounded-3xl border p-4"
        style={{ borderColor: chrome.colors.border, backgroundColor: '#000000' }}>
        <View className="mb-3 flex-row items-center justify-between px-1">
          <StandBySlot side="Left" widget="Ultra Clock" />
          <View className="mx-2 w-px self-stretch" style={{ backgroundColor: chrome.colors.border }} />
          <View className="items-center justify-center px-1" style={{ width: 72 }}>
            <Text
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: chrome.colors.muted }}>
              Center
            </Text>
            <Text className="mt-3 text-2xl font-extralight" style={{ color: '#FFFFFF' }}>
              9:41
            </Text>
          </View>
          <View className="mx-2 w-px self-stretch" style={{ backgroundColor: chrome.colors.border }} />
          <StandBySlot side="Right" widget="Ultra Gauge" />
        </View>
      </View>
      <Text className="mt-3 text-sm leading-5" style={{ color: chrome.colors.secondary }}>
        Use the small size in each side column. The center stays on the clock page unless you swap
        it in Edit.
      </Text>
    </View>
  );
}
