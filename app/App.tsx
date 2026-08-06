import './global.css';

import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buildMinuteTimeline, dayProgress } from './theme/ultra';
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

export default function App() {
  const [gaugeValue, setGaugeValue] = useState(0);
  const [presetIndex, setPresetIndex] = useState(0);

  useEffect(() => {
    refreshWidgets(gaugeValue, presetIndex);
  }, [gaugeValue, presetIndex]);

  const activePreset = gaugePresets[presetIndex] ?? gaugePresets[0];
  const displayValue = gaugeValue > 0 ? gaugeValue : dayProgress(new Date());

  return (
    <SafeAreaView className="flex-1 bg-ultra-bg">
      <View className="flex-1 gap-6 px-6 pb-8 pt-4">
        <View>
          <Text className="text-[34px] font-light tracking-wide text-ultra-primary">Standby</Text>
          <Text className="-mt-1 text-[15px] text-ultra-secondary">
            Ultra Night widgets for iPhone StandBy
          </Text>
        </View>

        <View className="gap-3 rounded-[20px] bg-ultra-track p-5">
          <Text className="text-xs font-bold tracking-widest text-ultra-accent">GAUGE</Text>
          <Text className="text-[48px] font-extralight tabular-nums text-ultra-primary">
            {Math.round(displayValue * 100)}%
          </Text>
          <Text className="text-[13px] leading-[18px] text-ultra-secondary">
            Leave at 0% to mirror day progress automatically in the widget.
          </Text>

          <View className="mt-1 flex-row gap-2">
            {gaugePresets.map((preset, index) => {
              const active = presetIndex === index;
              return (
                <Pressable
                  key={preset.label}
                  className={`rounded-full border px-3.5 py-2 ${
                    active ? 'border-ultra-accent bg-ultra-accent/15' : 'border-ultra-secondary'
                  }`}
                  onPress={() => setPresetIndex(index)}>
                  <Text
                    className={`text-xs font-semibold ${
                      active ? 'text-ultra-accent' : 'text-ultra-secondary'
                    }`}>
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-1 flex-row gap-2.5">
            <Pressable
              className="flex-1 items-center rounded-xl bg-ultra-bg py-3"
              onPress={() => setGaugeValue((value) => Math.max(0, value - 0.05))}>
              <Text className="text-base font-semibold text-ultra-primary">−</Text>
            </Pressable>
            <Pressable
              className="flex-1 items-center rounded-xl bg-ultra-bg py-3"
              onPress={() => setGaugeValue(0)}>
              <Text className="text-base font-semibold text-ultra-primary">Auto</Text>
            </Pressable>
            <Pressable
              className="flex-1 items-center rounded-xl bg-ultra-bg py-3"
              onPress={() => setGaugeValue((value) => Math.min(1, value + 0.05))}>
              <Text className="text-base font-semibold text-ultra-primary">+</Text>
            </Pressable>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-[17px] font-semibold text-ultra-primary">Add to StandBy</Text>
          <Text className="text-sm leading-[22px] text-ultra-secondary">
            1. Plug in your iPhone and rotate to landscape{'\n'}
            2. Open StandBy and tap Edit{'\n'}
            3. Add {activePreset.label === 'DAY' ? 'Ultra Clock' : 'Ultra Gauge'} or both{'\n'}
            4. Choose Night (red) or Mono palette in StandBy settings
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
