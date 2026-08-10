import { Image, Text, View } from 'react-native';

import { standbyConfig } from '../config';
import { standbyDesignSystem } from '../design-system';
import { groupedWordmarkSize } from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';
import { BrandDevPanel } from './BrandDevPanel';
import { GroupedDivider, GroupedInset, GroupedSection } from './GroupedSection';
import { HomePhoneRefGallery } from './HomePhoneRefGallery';
import { ScreenPageTitle } from './ScreenPageTitle';
import { SectionCard } from './SectionCard';
import { StandByWordmark } from './StandByWordmark';
import { nightMode } from './ultra/nightColors';

const typography = standbyDesignSystem.typography;
const wordmark = standbyDesignSystem.brand.wordmark;
const iconPreviewSize = 112;

const typographyScale = [
  {
    name: 'Screen title',
    sample: 'Branding',
    style: {
      fontSize: groupedWordmarkSize,
      fontWeight: `${wordmark.weight}` as const,
      letterSpacing: wordmark.letterSpacing,
    },
  },
  {
    name: 'Setup title',
    sample: 'How StandBy+ works',
    style: {
      fontSize: standbyDesignSystem.layout.homeSetup.titleSize,
      fontWeight: '600' as const,
      lineHeight: standbyDesignSystem.layout.homeSetup.titleLineHeight,
    },
  },
  {
    name: 'Body',
    sample: 'Plug in and rotate to landscape.',
    style: {
      fontSize: typography.body,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
  },
  {
    name: 'Grouped header',
    sample: 'Appearance',
    style: {
      fontSize: typography.sectionTitle,
      fontWeight: '400' as const,
      letterSpacing: typography.sectionTitle * 0.04,
      textTransform: 'uppercase' as const,
    },
  },
  {
    name: 'Section label',
    sample: 'Typography',
    style: {
      fontSize: typography.sectionLabel,
      fontWeight: '600' as const,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
  },
  {
    name: 'Caption',
    sample: 'Version 1.0.0',
    style: {
      fontSize: typography.caption,
      fontWeight: '400' as const,
    },
  },
] as const;

const brandColors = [
  { name: 'StandBy night', value: nightMode.primary },
  { name: 'Background', value: standbyConfig.brand.backgroundColor },
] as const;

type BrandPanelProps = {
  showPageTitle?: boolean;
};

function TypeLabel({ children }: { children: string }) {
  const chrome = useAppChrome();

  return (
    <Text
      className="mb-1 text-[11px] font-semibold uppercase tracking-widest"
      style={{ color: chrome.colors.muted }}
    >
      {children}
    </Text>
  );
}

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

export function BrandPanel({ showPageTitle = true }: BrandPanelProps) {
  const chrome = useAppChrome();

  return (
    <View>
      {showPageTitle ? <ScreenPageTitle title="Branding" /> : null}

      <SectionCard label="Typography">
        <View className="mt-4 border-b pb-5" style={{ borderColor: chrome.colors.border }}>
          <TypeLabel>Logo</TypeLabel>
          <StandByWordmark align="start" size={groupedWordmarkSize} />
        </View>
        <View className="mt-5">
          {typographyScale.map((item, index) => (
            <View
              key={item.name}
              className={`${index > 0 ? 'mt-5 border-t pt-5' : ''}`}
              style={{ borderColor: chrome.colors.border }}
            >
              <TypeLabel>{item.name}</TypeLabel>
              <Text style={{ color: chrome.colors.primary, ...item.style }}>{item.sample}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <GroupedSection title="Identity">
        <GroupedInset
          className="items-center"
          style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 }}
        >
          <Image
            source={require('../assets/icon.png')}
            style={{
              width: iconPreviewSize,
              height: iconPreviewSize,
              borderRadius: standbyDesignSystem.radius.iconPreview,
            }}
            resizeMode="cover"
          />
          <Text
            className="mt-4 text-center text-sm leading-5"
            style={{ color: chrome.colors.secondary }}
          >
            S+ monogram. White S, night red plus on pure black.
          </Text>
        </GroupedInset>
        <GroupedDivider inset="full" />
        <GroupedInset style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View className="flex-row flex-wrap">
            {brandColors.map((swatch) => (
              <ColorSwatch key={swatch.name} name={swatch.name} value={swatch.value} />
            ))}
          </View>
        </GroupedInset>
      </GroupedSection>

      <View className={`mt-5${__DEV__ ? '' : 'mb-0'}`}>
        <Text
          className="mb-1.5 text-[13px] font-normal uppercase tracking-[0.04em]"
          style={{ color: chrome.colors.secondary }}
        >
          Home scenes
        </Text>
        <HomePhoneRefGallery />
      </View>

      {__DEV__ ? <BrandDevPanel /> : null}
    </View>
  );
}
