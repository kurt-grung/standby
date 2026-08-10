import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, Text, View } from 'react-native';

import { GaugeValueControls } from '../../ui/GaugeValueControls';
import { PreviewGlassBackButton } from '../../ui/PreviewGlassBackButton';
import { StandByWordmark } from '../../ui/StandByWordmark';
import { nightMode } from '../../ui/ultra/nightColors';
import { ProgressBar } from '../../ui/ProgressBar';
import { ScreenShell } from '../../ui/ScreenShell';
import { SectionCard } from '../../ui/SectionCard';
import { useTheme } from '../../theme/ThemeContext';
import {
  groupedScreenPadding,
  groupedWordmarkSize,
  groupedUiWordmarkTopSpacing,
} from '../../theme/groupedLayout';
import { useAppChrome } from '../../theme/useAppChrome';
import { themeList, type ThemeId } from '../../theme/themes';

const typographyScale = [
  {
    name: 'Display',
    sample: 'Ultra Night',
    className: 'text-[42px] font-extralight tracking-tight',
  },
  { name: 'Title', sample: 'Ultra Night', className: 'text-2xl font-light' },
  { name: 'Headline', sample: 'Add to StandBy', className: 'text-lg font-medium' },
  { name: 'Body', sample: 'Widgets for iPhone StandBy mode.', className: 'text-base font-normal' },
  {
    name: 'Caption',
    sample: 'Leave at 0% to mirror day progress.',
    className: 'text-sm leading-5',
  },
  {
    name: 'Label',
    sample: 'GAUGE',
    className: 'text-[11px] font-semibold uppercase tracking-widest',
  },
] as const;

const brandPrinciples = [
  'Less, but better — Dieter Rams restraint',
  'Pure black surfaces, one accent per theme',
  'Rounded geometry, precise spacing, no ornament',
  'StandBy-first: glanceable, night-safe, Ultra-inspired',
] as const;

const iconVariants = [
  { label: 'Night', source: require('../../../designs/icons/icon-night.png') },
  { label: 'Ultra', source: require('../../../designs/icons/icon-ultra.png') },
  { label: 'Graphite', source: require('../../../designs/icons/icon-graphite.png') },
  { label: 'Mono', source: require('../../assets/adaptive-icon.png') },
] as const;

const marketingPalette = [
  { name: 'Stone', value: '#F2F2F0' },
  { name: 'Graphite', value: '#1D1D1D' },
  { name: 'Concrete', value: '#8E8E8E' },
  { name: 'Signal', value: '#FF5A1F' },
] as const;

const appPalette = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Night', value: '#FF453A' },
  { name: 'Ultra', value: '#FF9F0A' },
] as const;

const advertGenerations = [
  {
    label: 'A — medium concrete',
    source: require('../../../designs/generations/adverts/advert-a-medium-concrete.png'),
  },
  {
    label: 'K — red glow',
    source: require('../../../designs/generations/adverts/advert-k-red-glow.png'),
  },
  {
    label: 'M — tech noir',
    source: require('../../../designs/generations/adverts/advert-m-tech-noir.png'),
  },
  {
    label: 'L — side rim light',
    source: require('../../../designs/generations/adverts/advert-l-side-rim-light.png'),
  },
  {
    label: 'N — Japanese minimal',
    source: require('../../../designs/generations/adverts/advert-n-japanese-minimal.png'),
  },
] as const;

export default function UiScreen() {
  const { theme, themeId, setThemeId } = useTheme();
  const chrome = useAppChrome();

  return (
    <>
      <StatusBar style={chrome.statusBar} />
      <ScreenShell contentClassName={groupedScreenPadding}>
        <View className="mb-8" style={{ marginTop: groupedUiWordmarkTopSpacing }}>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text
                className="text-[34px] font-extralight"
                style={{ color: chrome.colors.primary }}
              >
                UI
              </Text>
              <Text
                className="mt-2 text-[28px] font-extralight tracking-tight"
                style={{ color: chrome.colors.secondary }}
              >
                Design System
              </Text>
              <Text className="mt-1 text-base" style={{ color: chrome.colors.secondary }}>
                Icon, typography, branding, and themes
              </Text>
            </View>
            <PreviewGlassBackButton />
          </View>
        </View>

        <SectionCard label="Themes">
          <View className="mt-3 flex-row flex-wrap">
            {themeList.map((item) => {
              const active = themeId === item.id;
              return (
                <Pressable
                  key={item.id}
                  className="mb-1.5 mr-1.5 flex-row items-center rounded-full border px-3 py-1.5 active:opacity-70"
                  style={{
                    borderColor: active ? item.colors.accent : chrome.colors.border,
                    backgroundColor: active ? item.colors.accentSoft : chrome.colors.surface,
                  }}
                  onPress={() => setThemeId(item.id as ThemeId)}
                >
                  <View
                    className="mr-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.colors.accent }}
                  />
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: active ? item.colors.accent : chrome.colors.primary }}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text className="mt-2 text-xs leading-4" style={{ color: chrome.colors.muted }}>
            {theme.description}
          </Text>
          <View className="mt-3">
            <ProgressBar value={0.42} />
          </View>
        </SectionCard>

        <SectionCard label="Typography" title="Type scale">
          <View className="mt-4 border-b pb-5" style={{ borderColor: chrome.colors.border }}>
            <Text
              className="mb-1 text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: chrome.colors.muted }}
            >
              Logo
            </Text>
            <StandByWordmark align="start" size={groupedWordmarkSize} />
          </View>
          <View className="mt-5">
            {typographyScale.map((item, index) => (
              <View
                key={item.name}
                className={`${index > 0 ? 'mt-5 border-t pt-5' : ''}`}
                style={{ borderColor: chrome.colors.border }}
              >
                <Text
                  className="mb-1 text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: chrome.colors.muted }}
                >
                  {item.name}
                </Text>
                <Text className={item.className} style={{ color: chrome.colors.primary }}>
                  {item.sample}
                </Text>
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard label="Icon" title="App mark">
          <View className="mt-4 items-center">
            <Image
              source={require('../../assets/icon.png')}
              className="h-28 w-28 rounded-[22px]"
              resizeMode="cover"
            />
            <Text
              className="mt-4 text-center text-sm leading-5"
              style={{ color: chrome.colors.secondary }}
            >
              S+ monogram. White S, night red plus on pure black.
            </Text>
          </View>
          <View className="mt-5 flex-row flex-wrap justify-center">
            {iconVariants.map((item) => (
              <View key={item.label} className="mx-1 mb-2 items-center">
                <Image source={item.source} className="h-14 w-14 rounded-2xl" resizeMode="cover" />
                <Text
                  className="mt-1 text-[10px] font-semibold uppercase"
                  style={{ color: chrome.colors.muted }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard label="Branding" title="StandBy+ identity">
          <Image
            source={require('../../assets/branding/wordmark.png')}
            className="mt-2 h-16 w-full"
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/splash.png')}
            className="mt-5 h-32 w-full rounded-2xl"
            resizeMode="contain"
          />
          <Text className="mt-2 text-base" style={{ color: chrome.colors.secondary }}>
            StandBy, refined. Widgets for iPhone StandBy at a glance.
          </Text>
          <View className="mt-5 flex-row flex-wrap">
            {Object.entries(theme.colors).map(([key, value]) => (
              <View key={key} className="mb-3 mr-3 w-[46%] flex-row items-center">
                <View
                  className="mr-2 h-8 w-8 rounded-lg border"
                  style={{ backgroundColor: value, borderColor: chrome.colors.border }}
                />
                <View>
                  <Text
                    className="text-xs font-semibold capitalize"
                    style={{ color: chrome.colors.primary }}
                  >
                    {key}
                  </Text>
                  <Text className="text-[10px]" style={{ color: chrome.colors.muted }}>
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
                style={{ color: chrome.colors.secondary }}
              >
                · {line}
              </Text>
            ))}
          </View>
        </SectionCard>

        <SectionCard label="Components" title="UI kit">
          <View className="mt-4">
            <GaugeValueControls
              accent={chrome.colors.accent}
              accentSoft={chrome.colors.accentSoft}
              increaseAccent={nightMode.primary}
              border={chrome.colors.border}
              text={chrome.colors.primary}
              onDecrease={() => undefined}
              onAuto={() => undefined}
              onIncrease={() => undefined}
            />
          </View>
          <View className="mt-4 flex-row flex-wrap">
            <View
              className="mb-2 mr-2 rounded-full border px-4 py-2"
              style={{
                borderColor: chrome.colors.accent,
                backgroundColor: chrome.colors.accentSoft,
              }}
            >
              <Text
                className="text-xs font-semibold uppercase"
                style={{ color: chrome.colors.accent }}
              >
                Badge
              </Text>
            </View>
            <View
              className="mb-2 mr-2 rounded-xl border px-4 py-2"
              style={{ borderColor: chrome.colors.border, backgroundColor: chrome.colors.bg }}
            >
              <Text className="text-xs font-semibold" style={{ color: chrome.colors.primary }}>
                Button
              </Text>
            </View>
            <View
              className="mb-2 rounded-xl border px-4 py-2"
              style={{ borderColor: chrome.colors.border, backgroundColor: chrome.colors.surface }}
            >
              <Text className="text-xs font-semibold" style={{ color: chrome.colors.secondary }}>
                Surface
              </Text>
            </View>
          </View>
          <ProgressBar value={0.68} />
        </SectionCard>

        <SectionCard label="Review" title="Dark app · Light marketing">
          <View className="mt-4 flex-row">
            <View className="mr-3 flex-1">
              <Text
                className="mb-2 text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: chrome.colors.muted }}
              >
                Dark — App
              </Text>
              <View
                className="items-center rounded-2xl border p-4"
                style={{ borderColor: chrome.colors.border, backgroundColor: '#000000' }}
              >
                <Image
                  source={require('../../assets/icon.png')}
                  className="h-20 w-20 rounded-[18px]"
                  resizeMode="cover"
                />
                <Image
                  source={require('../../assets/branding/wordmark.png')}
                  className="mt-3 h-10 w-full"
                  resizeMode="contain"
                />
              </View>
              <View className="mt-3 flex-row flex-wrap">
                {appPalette.map((swatch) => (
                  <View key={swatch.name} className="mb-2 mr-2 flex-row items-center">
                    <View
                      className="mr-1.5 h-5 w-5 rounded-md border"
                      style={{ backgroundColor: swatch.value, borderColor: chrome.colors.border }}
                    />
                    <Text className="text-[10px]" style={{ color: chrome.colors.muted }}>
                      {swatch.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="flex-1">
              <Text
                className="mb-2 text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: chrome.colors.muted }}
              >
                Light — Marketing
              </Text>
              <View
                className="items-center rounded-2xl border p-4"
                style={{ borderColor: chrome.colors.border, backgroundColor: '#F2F2F0' }}
              >
                <Image
                  source={require('../../../designs/icons/icon-light.png')}
                  className="h-20 w-20 rounded-[18px]"
                  resizeMode="cover"
                />
                <Image
                  source={require('../../../designs/wordmarks/wordmark-light.png')}
                  className="mt-3 h-10 w-full"
                  resizeMode="contain"
                />
              </View>
              <View className="mt-3 flex-row flex-wrap">
                {marketingPalette.map((swatch) => (
                  <View key={swatch.name} className="mb-2 mr-2 flex-row items-center">
                    <View
                      className="mr-1.5 h-5 w-5 rounded-md border"
                      style={{ backgroundColor: swatch.value, borderColor: chrome.colors.border }}
                    />
                    <Text className="text-[10px]" style={{ color: chrome.colors.muted }}>
                      {swatch.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Text className="mt-4 text-sm leading-5" style={{ color: chrome.colors.secondary }}>
            Same S+ mark on device; Stone palette for App Store and web.
          </Text>
        </SectionCard>

        <SectionCard label="Boards" title="Brand sheets" className="mb-0">
          <Text
            className="mt-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: chrome.colors.muted }}
          >
            Dark — merged
          </Text>
          <Image
            source={require('../../assets/branding/brand-board-dark.png')}
            className="mt-2 h-44 w-full rounded-2xl"
            resizeMode="cover"
          />
          <Text
            className="mt-4 text-xs font-semibold uppercase tracking-widest"
            style={{ color: chrome.colors.muted }}
          >
            Light — marketing
          </Text>
          <Image
            source={require('../../../designs/boards/brand-board-light.png')}
            className="mt-2 h-44 w-full rounded-2xl"
            resizeMode="cover"
          />
          <Text
            className="mt-4 text-xs font-semibold uppercase tracking-widest"
            style={{ color: chrome.colors.muted }}
          >
            ChatGPT reference
          </Text>
          <Image
            source={require('../../../designs/boards/chatgpt-reference.png')}
            className="mt-2 h-44 w-full rounded-2xl"
            resizeMode="cover"
          />
          <Text
            className="mt-4 text-xs font-semibold uppercase tracking-widest"
            style={{ color: chrome.colors.muted }}
          >
            Adverts — full bleed
          </Text>
          {advertGenerations.map((item) => (
            <View key={item.label} className="mt-2">
              <Text
                className="mb-1 text-[10px] font-semibold uppercase"
                style={{ color: chrome.colors.muted }}
              >
                {item.label}
              </Text>
              <Image source={item.source} className="h-44 w-full rounded-2xl" resizeMode="cover" />
            </View>
          ))}
        </SectionCard>
      </ScreenShell>
    </>
  );
}
