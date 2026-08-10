import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ComplicationId, ComplicationOption } from '../lib/complicationOptions';
import { useAppChrome } from '../theme/useAppChrome';

type ComplicationPickerSheetProps = {
  visible: boolean;
  slotLabel: string;
  options: ComplicationOption[];
  selectedId: ComplicationId | null;
  onSelect: (id: ComplicationId | null) => void;
  onClose: () => void;
};

export function ComplicationPickerSheet({
  visible,
  slotLabel,
  options,
  selectedId,
  onSelect,
  onClose,
}: ComplicationPickerSheetProps) {
  const chrome = useAppChrome();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: chrome.colors.card,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            paddingBottom: insets.bottom + 8,
          }}
        >
          <View className="items-center px-4 pb-2 pt-3">
            <View
              className="mb-3 h-1 w-9 rounded-full"
              style={{ backgroundColor: chrome.colors.border }}
            />
            <Text
              className="text-[13px] font-semibold uppercase tracking-[0.04em]"
              style={{ color: chrome.colors.secondary }}
            >
              {slotLabel}
            </Text>
            <Text
              className="mt-0.5 text-[17px] font-semibold"
              style={{ color: chrome.colors.primary }}
            >
              Complications
            </Text>
          </View>

          {options.map((option, index) => {
            const active = selectedId === option.id;

            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className="flex-row items-center px-4 active:opacity-70"
                style={{
                  minHeight: 52,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: chrome.colors.border,
                }}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
              >
                <SymbolView
                  name={option.icon}
                  size={22}
                  tintColor={active ? chrome.colors.primary : chrome.colors.muted}
                  weight={active ? 'semibold' : 'regular'}
                />
                <Text
                  className="ml-3 flex-1 text-[17px]"
                  style={{ color: active ? chrome.colors.primary : chrome.colors.primary }}
                >
                  {option.label}
                </Text>
                {active ? (
                  <SymbolView
                    name="checkmark"
                    size={16}
                    tintColor={chrome.colors.primary}
                    weight="semibold"
                  />
                ) : null}
              </Pressable>
            );
          })}

          <Pressable
            accessibilityRole="button"
            className="flex-row items-center px-4 active:opacity-70"
            style={{
              minHeight: 52,
              borderTopWidth: 1,
              borderTopColor: chrome.colors.border,
            }}
            onPress={() => {
              onSelect(null);
              onClose();
            }}
          >
            <SymbolView
              name="minus.circle"
              size={22}
              tintColor={chrome.colors.muted}
              weight="regular"
            />
            <Text className="ml-3 text-[17px]" style={{ color: chrome.colors.secondary }}>
              None
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
