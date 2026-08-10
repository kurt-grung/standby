import { Pressable, Text, View } from 'react-native';

import { standbyConfig } from '../config';
import { appearanceOptions } from '../theme/appearance';
import { useAppearance } from '../theme/AppearanceContext';
import { groupedUiWordmarkTopSpacing } from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';
import { GroupedDivider, GroupedSection } from './GroupedSection';
import { SfSymbolIcon } from './SfSymbolIcon';

export function SettingsPanel() {
  const chrome = useAppChrome();
  const { mode, setMode } = useAppearance();

  return (
    <View>
      <View className="mb-8" style={{ marginTop: groupedUiWordmarkTopSpacing }}>
        <Text className="text-[34px] font-extralight" style={{ color: chrome.colors.primary }}>
          Settings
        </Text>
      </View>

      <GroupedSection title="Appearance">
        {appearanceOptions.map((option, index) => {
          const active = mode === option.id;

          return (
            <View key={option.id}>
              {index > 0 ? <GroupedDivider /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={option.label}
                className="flex-row items-center justify-between active:opacity-70"
                style={{ minHeight: 44, paddingHorizontal: 16, paddingVertical: 12 }}
                onPress={() => setMode(option.id)}
              >
                <Text className="text-[17px]" style={{ color: chrome.colors.primary }}>
                  {option.label}
                </Text>
                {active ? (
                  <SfSymbolIcon
                    name="checkmark"
                    size={14}
                    tintColor={chrome.colors.accent}
                    weight="semibold"
                  />
                ) : null}
              </Pressable>
            </View>
          );
        })}
      </GroupedSection>

      <GroupedSection title="About" className="mt-5">
        <View
          className="flex-row items-center justify-between"
          style={{ minHeight: 44, paddingHorizontal: 16, paddingVertical: 12 }}
        >
          <Text className="text-[17px]" style={{ color: chrome.colors.primary }}>
            Version
          </Text>
          <Text className="text-[17px]" style={{ color: chrome.colors.secondary }}>
            {standbyConfig.version}
          </Text>
        </View>
      </GroupedSection>
    </View>
  );
}
