import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, Text, View } from 'react-native';

import { NavLink } from '../components/NavLink';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { useTheme } from '../theme/ThemeContext';
import { themeList, type ThemeId } from '../theme/themes';

const typographyScale = [
  { name: 'Display', sample: 'Standby', className: 'text-[42px] font-extralight tracking-tight' },
  { name: 'Title', sample: 'Ultra Night', className: 'text-2xl font-light' },
  { name: 'Headline', sample: 'Add to StandBy', className: 'text-lg font-medium' },
  { name: 'Body', sample: 'Widgets for iPhone StandBy mode.', className: 'text-base font-normal' },
  { name: 'Caption', sample: 'Leave at 0% to mirror day progress.', className: 'text-sm leading-5' },
  { name: 'Label', sample: 'GAUGE', className: 'text-[11px] font-semibold uppercase tracking-widest' },
] as const;

const brandPrinciples = [
  'Less, but better — Dieter Rams restraint',
  'Pure black surfaces, one accent per theme',
  'Rounded geometry, precise spacing, no ornament',
  'StandBy-first: glanceable, night-safe, Ultra-inspired',
] as const;

export default function UiScreen() {
  const { theme, themeId, setThemeId } = useTheme();

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <ScreenShell>
        <View className="mb-8 flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: theme.colors.accent }}>
              Design System
            </Text>
            <Text className="mt-2 text-[34px] font-extralight" style={{ color: theme.colors.primary }}>
              UI
            </Text>
            <Text className="mt-1 text-base" style={{ color: theme.colors.secondary }}>
              Icon, typography, branding, and themes
            </Text>
          </View>
          <NavLink href="/" label="Home" />
        </View>

        <SectionCard label="Themes" title="Appearance">
          <View className="mt-4 flex-row flex-wrap">
            {themeList.map((item) => {
              const active = themeId === item.id;
              return (
                <Pressable
                  key={item.id}
                  className="mb-2 mr-2 rounded-2xl border px-4 py-3 active:opacity-70"
                  style={{
                    borderColor: active ? item.colors.accent : theme.colors.border,
                    backgroundColor: active ? item.colors.accentSoft : theme.colors.surface,
                  }}
                  onPress={() => setThemeId(item.id as ThemeId)}>
                  <View className="mb-2 flex-row items-center">
                    <View
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.colors.accent }}
                    />
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: active ? item.colors.accent : theme.colors.primary }}>
                      {item.name}
                    </Text>
                  </View>
                  <Text className="text-xs leading-4" style={{ color: theme.colors.muted }}>
                    {item.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View className="mt-4">
            <ProgressBar value={0.42} />
          </View>
        </SectionCard>

        <SectionCard label="Icon" title="App mark">
          <View className="mt-4 items-center">
            <Image
              source={require('../assets/icon.png')}
              className="h-28 w-28 rounded-[22px]"
              resizeMode="cover"
            />
            <Text className="mt-4 text-center text-sm leading-5" style={{ color: theme.colors.secondary }}>
              Minimal ring, red night dot, landscape shelf. Dieter Rams clarity with Apple flat precision.
            </Text>
          </View>
          <View className="mt-5 flex-row justify-center">
            <View
              className="mx-1 h-14 w-14 items-center justify-center rounded-2xl border"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.bg }}>
              <View
                className="h-8 w-8 rounded-full border-2"
                style={{ borderColor: theme.colors.primary }}
              />
            </View>
            <View
              className="mx-1 h-14 w-14 items-center justify-center rounded-2xl border"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.bg }}>
              <View
                className="h-8 w-8 rounded-full border-2"
                style={{ borderColor: theme.colors.accent }}
              />
            </View>
            <View
              className="mx-1 h-14 w-14 items-center justify-center rounded-2xl border"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.bg }}>
              <View className="h-0.5 w-6 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
            </View>
          </View>
        </SectionCard>

        <SectionCard label="Typography" title="Type scale">
          <View className="mt-4">
            {typographyScale.map((item, index) => (
              <View
                key={item.name}
                className={`${index > 0 ? 'mt-5 border-t pt-5' : ''}`}
                style={{ borderColor: theme.colors.border }}>
                <Text
                  className="mb-1 text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: theme.colors.muted }}>
                  {item.name}
                </Text>
                <Text className={item.className} style={{ color: theme.colors.primary }}>
                  {item.sample}
                </Text>
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard label="Branding" title="Standby identity">
          <Text className="mt-2 text-5xl font-extralight tracking-tight" style={{ color: theme.colors.primary }}>
            Standby
          </Text>
          <Text className="mt-2 text-base" style={{ color: theme.colors.secondary }}>
            Ultra Night widgets for iPhone StandBy
          </Text>
          <View className="mt-5 flex-row flex-wrap">
            {Object.entries(theme.colors).map(([key, value]) => (
              <View key={key} className="mb-3 mr-3 w-[46%] flex-row items-center">
                <View
                  className="mr-2 h-8 w-8 rounded-lg border"
                  style={{ backgroundColor: value, borderColor: theme.colors.border }}
                />
                <View>
                  <Text className="text-xs font-semibold capitalize" style={{ color: theme.colors.primary }}>
                    {key}
                  </Text>
                  <Text className="text-[10px]" style={{ color: theme.colors.muted }}>
                    {value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View className="mt-2">
            {brandPrinciples.map((line, index) => (
              <Text
                key={line}
                className={`text-sm leading-5 ${index > 0 ? 'mt-2' : ''}`}
                style={{ color: theme.colors.secondary }}>
                · {line}
              </Text>
            ))}
          </View>
        </SectionCard>

        <SectionCard label="Components" title="UI kit" className="mb-0">
          <View className="mt-4 flex-row flex-wrap">
            <View
              className="mb-2 mr-2 rounded-full border px-4 py-2"
              style={{ borderColor: theme.colors.accent, backgroundColor: theme.colors.accentSoft }}>
              <Text className="text-xs font-semibold uppercase" style={{ color: theme.colors.accent }}>
                Badge
              </Text>
            </View>
            <View
              className="mb-2 mr-2 rounded-xl border px-4 py-2"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.bg }}>
              <Text className="text-xs font-semibold" style={{ color: theme.colors.primary }}>
                Button
              </Text>
            </View>
            <View
              className="mb-2 rounded-xl border px-4 py-2"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
              <Text className="text-xs font-semibold" style={{ color: theme.colors.secondary }}>
                Surface
              </Text>
            </View>
          </View>
          <ProgressBar value={0.68} />
        </SectionCard>
      </ScreenShell>
    </>
  );
}
