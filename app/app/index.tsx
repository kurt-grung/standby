import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { GaugeValueControls } from '../ui/GaugeValueControls';
import { AppWordmarkHeader, StickyWordmarkPlus } from '../ui/AppWordmarkHeader';
import {
  GroupedDivider,
  GroupedInset,
  GroupedSection,
  GroupedStepRows,
} from '../ui/GroupedSection';
import { useLiveClock } from '../hooks/useLiveClock';
import { ScreenShell } from '../ui/ScreenShell';
import { HomePhoneRefGallery } from '../ui/HomePhoneRefGallery';
import { HomeRevealSection } from '../ui/HomeRevealSection';
import { HomeWidgetPlaceholder } from '../ui/HomeWidgetPlaceholder';
import { ArcGauge } from '../ui/ultra/ArcGauge';
import { nightMode } from '../ui/ultra/nightColors';
import { refreshStandbyWidgets } from '../lib/refreshStandbyWidgets';
import {
  groupedHeroInset,
  groupedGaugeTopPadding,
  groupedGaugeBottomClearance,
  groupedPresetRowInset,
  groupedScreenPadding,
} from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';
import { dayProgress } from '../theme/ultra';
import { type UltraGaugeWidgetProps } from '../widgets/UltraGaugeWidget';

const GAUGE_STEP = 0.05;
const GAUGE_RING_SIZE = 144;

const standBySteps = [
  'Deploy widgets with make standby or make device, then open StandBy+ on your iPhone',
  'Plug in, rotate to landscape, and long-press StandBy',
  'Tap Edit, then add Ultra Clock (left) and Ultra Gauge (right)',
  'Choose Night or Mono in StandBy settings',
] as const;

const gaugePresets = [
  { label: 'DAY', icon: 'sun.max.fill' },
  { label: 'ENERGY', icon: 'bolt.fill' },
  { label: 'FOCUS', icon: 'scope' },
] as const satisfies readonly Pick<UltraGaugeWidgetProps, 'label' | 'icon'>[];

export default function HomeScreen() {
  const chrome = useAppChrome();
  const [gaugeValue, setGaugeValue] = useState(0);
  const [presetIndex, setPresetIndex] = useState(0);
  const now = useLiveClock();

  useEffect(() => {
    const preset = gaugePresets[presetIndex] ?? gaugePresets[0];
    refreshStandbyWidgets(gaugeValue, preset);
  }, [gaugeValue, presetIndex]);

  const isAuto = gaugeValue === 0;
  const displayValue = isAuto ? dayProgress(now) : gaugeValue;
  const percent = Math.round(displayValue * 100);
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <>
      <StatusBar style={chrome.statusBar} />
      <ScreenShell
        scrollRef={scrollRef}
        contentClassName={groupedScreenPadding}
        overlay={<StickyWordmarkPlus scrollRef={scrollRef} scrollY={scrollY} />}
        onScroll={onScroll}
      >
        <HomeRevealSection step={0}>
          <AppWordmarkHeader scrollRef={scrollRef} scrollY={scrollY} />
        </HomeRevealSection>
        <HomeRevealSection step={1}>
          <HomeWidgetPlaceholder gaugeValue={displayValue} />
        </HomeRevealSection>
        <HomeRevealSection step={2}>
          <HomePhoneRefGallery />
        </HomeRevealSection>

        <GroupedSection title="Gauge" footer="Auto mirrors day progress in the Ultra Gauge widget.">
          <GroupedInset className={groupedHeroInset} style={{ paddingTop: groupedGaugeTopPadding }}>
            <ArcGauge
              size={GAUGE_RING_SIZE}
              progress={displayValue}
              stroke={8}
              bottomClearance={groupedGaugeBottomClearance}
              trackColor={chrome.colors.track}
              progressColor={chrome.colors.primary}
            >
              <View className="items-center">
                <View className="flex-row items-baseline">
                  <Text
                    className="text-[38px] font-light leading-none"
                    style={{ color: chrome.colors.primary, fontVariant: ['tabular-nums'] }}
                  >
                    {percent}
                  </Text>
                  <Text
                    className="ml-0.5 text-[18px] font-light leading-none"
                    style={{ color: chrome.colors.secondary }}
                  >
                    %
                  </Text>
                </View>
                {isAuto ? (
                  <Text
                    className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: chrome.colors.secondary }}
                  >
                    Auto
                  </Text>
                ) : null}
              </View>
            </ArcGauge>
          </GroupedInset>

          <GroupedDivider />

          <View className="flex-row">
            {gaugePresets.map((preset, index) => {
              const active = presetIndex === index;
              return (
                <Pressable
                  key={preset.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  className={`flex-1 items-center justify-center active:opacity-70 ${groupedPresetRowInset} ${index < gaugePresets.length - 1 ? 'border-r' : ''}`}
                  style={
                    index < gaugePresets.length - 1
                      ? { borderRightColor: chrome.colors.border }
                      : undefined
                  }
                  onPress={() => setPresetIndex(index)}
                >
                  <SymbolView
                    name={preset.icon}
                    size={20}
                    tintColor={active ? chrome.colors.primary : chrome.colors.muted}
                    weight={active ? 'semibold' : 'regular'}
                  />
                  <Text
                    className="mt-1 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: active ? chrome.colors.primary : chrome.colors.muted }}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <GroupedDivider />

          <GaugeValueControls
            accent={chrome.colors.primary}
            accentSoft={chrome.colors.accentSoft}
            increaseAccent={nightMode.primary}
            border={chrome.colors.border}
            text={chrome.colors.primary}
            onDecrease={() => setGaugeValue((value) => Math.max(0, value - GAUGE_STEP))}
            onAuto={() => setGaugeValue(0)}
            onIncrease={() => setGaugeValue((value) => Math.min(1, value + GAUGE_STEP))}
          />
        </GroupedSection>

        <GroupedSection
          title="StandBy"
          footer="Add both widgets at the small size — one in each side column."
          className="mb-0"
        >
          <GroupedStepRows steps={standBySteps} />
        </GroupedSection>
      </ScreenShell>
    </>
  );
}
