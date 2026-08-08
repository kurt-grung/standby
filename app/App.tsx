import './global.css';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  buildMinuteTimeline,
  dayProgress,
  formatNightTime,
} from './theme/ultra';
import UltraClockWidget from './widgets/UltraClockWidget';
import UltraGaugeWidget, { type UltraGaugeWidgetProps } from './widgets/UltraGaugeWidget';

const TIMELINE_HOURS = 24;

const gaugePresets = [
  { label: 'DAY', icon: 'sun.max.fill' },
  { label: 'ENERGY', icon: 'bolt.fill' },
  { label: 'FOCUS', icon: 'scope' },
] as const satisfies readonly Pick<UltraGaugeWidgetProps, 'label' | 'icon'>[];

function refreshWidgets(gaugeValue: number, presetIndex: number) {
  const preset = gaugePresets[presetIndex] ?? gaugePresets[0];

  UltraClockWidget.updateTimeline(buildMinuteTimeline(TIMELINE_HOURS, () => ({})));

  UltraGaugeWidget.updateTimeline(
    buildMinuteTimeline(TIMELINE_HOURS, (date) => ({
      label: preset.label,
      icon: preset.icon,
      unit: '%',
      value: gaugeValue > 0 ? gaugeValue : dayProgress(date),
    })),
  );
}

function NightBadge() {
  return (
    <View className="mb-4 flex-row items-center self-start rounded-full border border-night-red/40 bg-night-red/10 px-3 py-1.5">
      <View className="mr-2 h-2 w-2 rounded-full bg-night-red" />
      <Text className="text-[11px] font-semibold uppercase tracking-ultra text-night-red">
        Night
      </Text>
    </View>
  );
}

function ProgressBar({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  return (
    <View className="mt-4">
      <View className="h-1.5 overflow-hidden rounded-full bg-night-track">
        <View className="h-full rounded-full bg-night-red" style={{ width: `${percent}%` }} />
      </View>
    </View>
  );
}

export default function App() {
  const [gaugeValue, setGaugeValue] = useState(0);
  const [presetIndex, setPresetIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    refreshWidgets(gaugeValue, presetIndex);
  }, [gaugeValue, presetIndex]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const activePreset = gaugePresets[presetIndex] ?? gaugePresets[0];
  const displayValue = gaugeValue > 0 ? gaugeValue : dayProgress(new Date());
  const percent = Math.round(displayValue * 100);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-night-bg" edges={['top', 'left', 'right', 'bottom']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="mb-8 pr-12">
            <NightBadge />
            <Text className="text-[42px] font-extralight tracking-tight text-night-primary">
              Standby
            </Text>
            <Text className="mt-1 text-base text-night-secondary">
              Ultra Night widgets for iPhone StandBy
            </Text>
            <Text className="mt-4 text-3xl font-extralight text-night-red">
              {formatNightTime(now)}
            </Text>
          </View>

          <View className="mb-8 overflow-hidden rounded-3xl border border-night-border bg-night-card p-5">
            <View className="flex-row items-end justify-between">
              <View className="flex-1">
                <Text className="text-[11px] font-semibold uppercase tracking-ultra text-night-red">
                  Gauge
                </Text>
                <Text className="mt-2 text-6xl font-extralight text-night-primary">{percent}%</Text>
              </View>
              <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-night-border">
                <View
                  className="absolute h-16 w-16 rounded-full border-2 border-night-red"
                  style={{
                    borderRightColor: 'transparent',
                    borderBottomColor: percent > 25 ? '#FF453A' : 'transparent',
                    borderLeftColor: percent > 50 ? '#FF453A' : 'transparent',
                    borderTopColor: percent > 75 ? '#FF453A' : 'transparent',
                    transform: [{ rotate: '-45deg' }],
                  }}
                />
                <Text className="text-xs font-semibold text-night-secondary">{activePreset.label}</Text>
              </View>
            </View>

            <ProgressBar value={displayValue} />

            <Text className="mt-4 text-sm leading-5 text-night-muted">
              Leave at 0% to mirror day progress automatically in the widget.
            </Text>

            <View className="mt-5 flex-row">
              {gaugePresets.map((preset, index) => {
                const active = presetIndex === index;
                return (
                  <Pressable
                    key={preset.label}
                    className={`mr-2 flex-1 items-center rounded-full border py-2.5 ${
                      active
                        ? 'border-night-red bg-night-red/15'
                        : 'border-night-border bg-night-surface'
                    } ${index === gaugePresets.length - 1 ? 'mr-0' : ''}`}
                    onPress={() => setPresetIndex(index)}>
                    <Text
                      className={`text-[11px] font-semibold uppercase tracking-wide ${
                        active ? 'text-night-red' : 'text-night-muted'
                      }`}>
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="mt-4 flex-row">
              <Pressable
                className="mr-2 flex-1 items-center rounded-2xl border border-night-border bg-night-bg py-3.5 active:opacity-70"
                onPress={() => setGaugeValue((value) => Math.max(0, value - 0.05))}>
                <Text className="text-xl font-light text-night-primary">−</Text>
              </Pressable>
              <Pressable
                className="mr-2 flex-1 items-center rounded-2xl border border-night-red/50 bg-night-red/10 py-3.5 active:opacity-70"
                onPress={() => setGaugeValue(0)}>
                <Text className="text-sm font-semibold uppercase tracking-wide text-night-red">
                  Auto
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center rounded-2xl border border-night-border bg-night-bg py-3.5 active:opacity-70"
                onPress={() => setGaugeValue((value) => Math.min(1, value + 0.05))}>
                <Text className="text-xl font-light text-night-primary">+</Text>
              </Pressable>
            </View>
          </View>

          <View className="rounded-3xl border border-night-border bg-night-surface p-5">
            <Text className="text-[11px] font-semibold uppercase tracking-ultra text-night-secondary">
              StandBy
            </Text>
            <Text className="mt-2 text-lg font-medium text-night-primary">Add to StandBy</Text>
            <View className="mt-4">
              {[
                'Plug in your iPhone and rotate to landscape',
                'Open StandBy and tap Edit',
                `Add ${activePreset.label === 'DAY' ? 'Ultra Clock' : 'Ultra Gauge'} or both`,
                'Choose Night (red) or Mono palette in StandBy settings',
              ].map((step, index) => (
                <View key={step} className={`flex-row ${index > 0 ? 'mt-3' : ''}`}>
                  <Text className="mr-3 w-5 text-sm font-semibold text-night-red">{index + 1}.</Text>
                  <Text className="flex-1 text-sm leading-5 text-night-secondary">{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
