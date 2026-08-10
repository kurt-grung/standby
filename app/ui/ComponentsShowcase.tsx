import type { ReactNode } from 'react';
import { useState } from 'react';
import { Text, View } from 'react-native';

import type { ConfigureWidget } from '../lib/gaugePresets';
import { useAppChrome } from '../theme/useAppChrome';
import { ComplicationSlotButton } from './ComplicationSlotButton';
import { ConfigureWidgetSegment } from './ConfigureWidgetSegment';
import {
  GroupedDivider,
  GroupedInset,
  GroupedLinkRow,
  GroupedSection,
  GroupedStepRows,
} from './GroupedSection';
import { ProgressBar } from './ProgressBar';
import { SectionCard } from './SectionCard';
import { SfSymbolIcon } from './SfSymbolIcon';
import { nightMode } from './ultra/nightColors';

const configureWidgets: ConfigureWidget[] = ['clock', 'gauge'];
const configureLabels: Record<ConfigureWidget, string> = {
  clock: 'Left',
  gauge: 'Right',
};

const setupSteps = [
  'Plug in and rotate to landscape',
  'Long-press StandBy, tap Edit',
  'Add StandBy+ widgets to each side',
] as const;

const symbolSamples = [
  'house.fill',
  'play.rectangle.fill',
  'gearshape.fill',
  'sun.max.fill',
  'moon.fill',
  'checkmark',
] as const;

const complicationSlotSize = 52;

const noop = () => undefined;

function ShowcaseLabel({ children }: { children: string }) {
  const chrome = useAppChrome();

  return (
    <Text
      className="mb-3 text-[11px] font-semibold uppercase tracking-widest"
      style={{ color: chrome.colors.muted }}
    >
      {children}
    </Text>
  );
}

function NightSurface({ children }: { children: ReactNode }) {
  return (
    <View
      className="items-center rounded-2xl px-4 py-5"
      style={{ backgroundColor: nightMode.bg, gap: 16 }}
    >
      {children}
    </View>
  );
}

export function ComponentsShowcase() {
  const chrome = useAppChrome();
  const [segmentIndex, setSegmentIndex] = useState(0);

  return (
    <View style={{ gap: 28 }}>
      <View>
        <ShowcaseLabel>Grouped list</ShowcaseLabel>
        <GroupedSection>
          <GroupedLinkRow href="/settings" label="Link row" />
          <GroupedDivider />
          <GroupedInset style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text className="text-[17px]" style={{ color: chrome.colors.primary }}>
              Static row
            </Text>
          </GroupedInset>
        </GroupedSection>
      </View>

      <View>
        <ShowcaseLabel>Setup steps</ShowcaseLabel>
        <GroupedSection>
          <GroupedStepRows steps={setupSteps} />
        </GroupedSection>
      </View>

      <View>
        <ShowcaseLabel>Section card</ShowcaseLabel>
        <SectionCard label="Example" className="mb-0">
          <Text className="mt-4 text-base leading-5" style={{ color: chrome.colors.secondary }}>
            Rounded card surface for long-form reference content.
          </Text>
        </SectionCard>
      </View>

      <View>
        <ShowcaseLabel>Widget configure</ShowcaseLabel>
        <NightSurface>
          <View className="flex-row" style={{ gap: 12 }}>
            <ComplicationSlotButton
              slotLabel="Top left"
              complicationId={null}
              width={complicationSlotSize}
              height={complicationSlotSize}
              onPress={noop}
            />
            <ComplicationSlotButton
              slotLabel="Top right"
              complicationId="battery"
              width={complicationSlotSize}
              height={complicationSlotSize}
              onPress={noop}
            />
          </View>
          <ConfigureWidgetSegment
            widgets={configureWidgets}
            labels={configureLabels}
            activeIndex={segmentIndex}
            onSelect={setSegmentIndex}
          />
        </NightSurface>
      </View>

      <View>
        <ShowcaseLabel>Chips</ShowcaseLabel>
        <View className="flex-row flex-wrap">
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
      </View>

      <View>
        <ShowcaseLabel>Progress</ShowcaseLabel>
        <ProgressBar value={0.68} />
      </View>

      <View>
        <ShowcaseLabel>Symbols</ShowcaseLabel>
        <View className="flex-row flex-wrap" style={{ gap: 16 }}>
          {symbolSamples.map((name) => (
            <SfSymbolIcon
              key={name}
              name={name}
              size={22}
              tintColor={chrome.colors.primary}
              weight="semibold"
            />
          ))}
        </View>
      </View>
    </View>
  );
}
