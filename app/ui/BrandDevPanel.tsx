import { Text, View } from 'react-native';

import { useAppChrome } from '../theme/useAppChrome';
import { ComponentsShowcase } from './ComponentsShowcase';
import { GlassButtonsShowcase } from './GlassButtonsShowcase';
import { GroupedInset, GroupedSection } from './GroupedSection';

function ColorSwatch({ name, value }: { name: string; value: string }) {
  const chrome = useAppChrome();

  return (
    <View className="mb-3 mr-3 w-[46%] flex-row items-center">
      <View
        className="mr-2 h-8 w-8 rounded-lg border"
        style={{ backgroundColor: value, borderColor: chrome.colors.border }}
      />
      <View className="flex-1">
        <Text className="text-xs font-semibold" style={{ color: chrome.colors.primary }}>
          {name}
        </Text>
        <Text className="text-[10px]" style={{ color: chrome.colors.muted }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export function BrandDevPanel() {
  const chrome = useAppChrome();

  return (
    <>
      <GroupedSection title="Colors" className="mt-5">
        <GroupedInset style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View className="flex-row flex-wrap">
            {Object.entries(chrome.colors).map(([key, value]) => (
              <ColorSwatch key={key} name={key} value={value} />
            ))}
          </View>
        </GroupedInset>
      </GroupedSection>

      <GroupedSection title="Buttons" className="mt-5">
        <GroupedInset style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <GlassButtonsShowcase
            mutedColor={chrome.colors.muted}
            labelColor={chrome.colors.secondary}
          />
        </GroupedInset>
      </GroupedSection>

      <GroupedSection title="Components" className="mb-0 mt-5">
        <GroupedInset style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <ComponentsShowcase />
        </GroupedInset>
      </GroupedSection>
    </>
  );
}
