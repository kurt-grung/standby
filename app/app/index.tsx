import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { GaugeValueControls } from '../components/GaugeValueControls';
import { NavLink } from '../components/NavLink';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { StandByLayoutGuide } from '../components/StandByLayoutGuide';
import { ThemeBadge } from '../components/ThemeBadge';
import { refreshStandbyWidgets } from '../lib/refreshStandbyWidgets';
import { useTheme } from '../theme/ThemeContext';
import { dayProgress, formatNightTime } from '../theme/ultra';
import { type UltraGaugeWidgetProps } from '../widgets/UltraGaugeWidget';

const GAUGE_STEP = 0.05;

const standBySteps = [
  'Run make standby on your Mac (best) or make device, then open Standby once on the phone',
  'Wait for the home screen to load (registers widget layouts)',
  'Plug in your iPhone and rotate to landscape',
  'Long-press StandBy, then tap Edit',
  'Tap the left column and add Ultra Clock (Small)',
  'Tap the right column and add Ultra Gauge (Small)',
  'Open StandBy settings and choose Night or Mono',
] as const;

const gaugePresets = [
  { label: 'DAY', icon: 'sun.max.fill' },
  { label: 'ENERGY', icon: 'bolt.fill' },
  { label: 'FOCUS', icon: 'scope' },
] as const satisfies readonly Pick<UltraGaugeWidgetProps, 'label' | 'icon'>[];

export default function HomeScreen() {
  const { theme } = useTheme();
  const [gaugeValue, setGaugeValue] = useState(0);
  const [presetIndex, setPresetIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const preset = gaugePresets[presetIndex] ?? gaugePresets[0];
    refreshStandbyWidgets(gaugeValue, preset);
  }, [gaugeValue, presetIndex]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const activePreset = gaugePresets[presetIndex] ?? gaugePresets[0];
  const displayValue = gaugeValue > 0 ? gaugeValue : dayProgress(new Date());
  const percent = Math.round(displayValue * 100);

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <ScreenShell>
        <View className="mb-6 flex-row items-start justify-between pr-2">
          <View className="flex-1 pr-4">
            <ThemeBadge />
            <Text className="text-[42px] font-extralight tracking-tight" style={{ color: theme.colors.primary }}>
              Standby
            </Text>
            <Text className="mt-1 text-base" style={{ color: theme.colors.secondary }}>
              Ultra Night widgets for iPhone StandBy
            </Text>
            <Text className="mt-4 text-3xl font-extralight" style={{ color: theme.colors.accent }}>
              {formatNightTime(now)}
            </Text>
          </View>
          <NavLink href="/ui" label="UI" />
        </View>

        <SectionCard label="Gauge">
          <View className="mt-2 flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-6xl font-extralight" style={{ color: theme.colors.primary }}>
                {percent}%
              </Text>
            </View>
            <View
              className="h-16 w-16 items-center justify-center rounded-full border-2"
              style={{ borderColor: theme.colors.border }}>
              <Text className="text-xs font-semibold" style={{ color: theme.colors.secondary }}>
                {activePreset.label}
              </Text>
            </View>
          </View>

          <ProgressBar value={displayValue} />

          <Text className="mt-4 text-sm leading-5" style={{ color: theme.colors.muted }}>
            Leave at 0% to mirror day progress automatically in the widget.
          </Text>

          <View className="mt-5 flex-row">
            {gaugePresets.map((preset, index) => {
              const active = presetIndex === index;
              return (
                <Pressable
                  key={preset.label}
                  className={`mr-2 flex-1 items-center rounded-full border py-2.5 ${index === gaugePresets.length - 1 ? 'mr-0' : ''}`}
                  style={{
                    borderColor: active ? theme.colors.accent : theme.colors.border,
                    backgroundColor: active ? theme.colors.accentSoft : theme.colors.surface,
                  }}
                  onPress={() => setPresetIndex(index)}>
                  <Text
                    className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: active ? theme.colors.accent : theme.colors.muted }}>
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-4">
            <GaugeValueControls
              accent={theme.colors.accent}
              border={theme.colors.border}
              surface={theme.colors.bg}
              text={theme.colors.primary}
              onDecrease={() => setGaugeValue((value) => Math.max(0, value - GAUGE_STEP))}
              onAuto={() => setGaugeValue(0)}
              onIncrease={() => setGaugeValue((value) => Math.min(1, value + GAUGE_STEP))}
            />
          </View>
        </SectionCard>

        <SectionCard label="StandBy" title="Left and right widgets" className="mb-0">
          <StandByLayoutGuide />
          <View className="mt-5">
            {standBySteps.map((step, index) => (
              <View key={step} className={`flex-row ${index > 0 ? 'mt-3' : ''}`}>
                <Text className="mr-3 w-5 text-sm font-semibold" style={{ color: theme.colors.accent }}>
                  {index + 1}.
                </Text>
                <Text className="flex-1 text-sm leading-5" style={{ color: theme.colors.secondary }}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </SectionCard>
      </ScreenShell>
    </>
  );
}
