import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  complicationOptionsForWidget,
  complicationSlotLabels,
  parseComplicationSlot,
} from '../../lib/complicationOptions';
import { parseConfigureWidget } from '../../lib/gaugePresets';
import { useWidgetConfig } from '../../theme/WidgetConfigContext';

const sheetBg = '#000000';
const sheetFg = '#FFFFFF';
const sheetLine = 'rgba(255,255,255,0.12)';

export default function ComplicationPickerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { widget: widgetParam, slot: slotParam } = useLocalSearchParams<{
    widget?: string;
    slot?: string;
  }>();
  const { getComplications, setComplication } = useWidgetConfig();

  const widget = parseConfigureWidget(typeof widgetParam === 'string' ? widgetParam : undefined);
  const slot = parseComplicationSlot(typeof slotParam === 'string' ? slotParam : undefined);

  useEffect(() => {
    if (!slot) {
      router.back();
    }
  }, [router, slot]);

  if (!slot) {
    return null;
  }

  const options = complicationOptionsForWidget(widget);
  const selectedId = getComplications(widget)[slot];
  const slotLabel = complicationSlotLabels[slot];

  const select = (id: Parameters<typeof setComplication>[2]) => {
    setComplication(widget, slot, id);
    router.back();
  };

  return (
    <ScrollView
      style={{ backgroundColor: sheetBg }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
        <Text
          style={{
            color: sheetFg,
            fontSize: 13,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            opacity: 0.5,
          }}
        >
          {slotLabel}
        </Text>
      </View>

      {options.map((option, index) => {
        const active = selectedId === option.id;

        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            className="flex-row items-center active:opacity-60"
            style={{
              minHeight: 52,
              paddingHorizontal: 20,
              borderTopWidth: index === 0 ? 1 : 0,
              borderBottomWidth: 1,
              borderColor: sheetLine,
            }}
            onPress={() => select(option.id)}
          >
            <SymbolView
              name={option.icon}
              size={20}
              tintColor={sheetFg}
              weight={active ? 'semibold' : 'regular'}
            />
            <Text className="ml-3 flex-1 text-[17px]" style={{ color: sheetFg }}>
              {option.label}
            </Text>
            {active ? (
              <SymbolView name="checkmark" size={14} tintColor={sheetFg} weight="semibold" />
            ) : null}
          </Pressable>
        );
      })}

      <Pressable
        accessibilityRole="button"
        className="flex-row items-center active:opacity-60"
        style={{
          minHeight: 52,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderColor: sheetLine,
        }}
        onPress={() => select(null)}
      >
        <Text className="text-[17px]" style={{ color: sheetFg }}>
          None
        </Text>
      </Pressable>
    </ScrollView>
  );
}
