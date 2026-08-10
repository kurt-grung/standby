import { Gauge, HStack, Image, Spacer, Text, VStack, ZStack } from '@expo/ui/swift-ui';
import {
  clipShape,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  gaugeStyle,
  monospacedDigit,
  padding,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import type { SFSymbol } from 'sf-symbols-typescript';

import type { UltraGaugeWidgetProps as StandbyGaugeWidgetProps } from '../lib/standbyWidgetTypes';
import { nightMode } from '../design-system';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type UltraGaugeWidgetProps = StandbyGaugeWidgetProps & {
  icon: SFSymbol;
};

const UltraGaugeWidget = (props: UltraGaugeWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const background = nightMode.bg;
  const primary = nightMode.primary;
  const secondary = nightMode.secondary;
  const muted = nightMode.muted;
  const accent = nightMode.primary;
  const isSmall = environment.widgetFamily === 'systemSmall';
  const isLarge = environment.widgetFamily === 'systemLarge';
  const clamped = Math.min(1, Math.max(0, props.value));
  const percent = Math.round(clamped * 100);
  const date = environment.date;
  const dayProgress = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
  const temp = 68;
  const uv = 4;
  const battery = 74;
  const gaugeSize = isSmall ? 52 : isLarge ? 96 : 78;
  const valueSize = isSmall ? 20 : isLarge ? 36 : 28;

  if (isSmall) {
    return (
      <ZStack
        modifiers={[containerBackground(background, 'widget'), clipShape('containerRelativeShape')]}
      >
        <VStack
          alignment="center"
          spacing={4}
          modifiers={[padding({ all: 10 }), frame({ maxWidth: Infinity, maxHeight: Infinity })]}
        >
          <HStack spacing={6} modifiers={[frame({ maxWidth: Infinity })]}>
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: 10 }),
                monospacedDigit(),
                foregroundStyle(secondary),
              ]}
            >
              {temp}°
            </Text>
            <Spacer />
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: 10 }),
                monospacedDigit(),
                foregroundStyle(primary),
              ]}
            >
              {battery}%
            </Text>
            <Spacer />
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: 10 }),
                foregroundStyle(secondary),
              ]}
            >
              UV {uv}
            </Text>
          </HStack>

          <ZStack>
            <Gauge
              value={clamped}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(accent),
                frame({ width: gaugeSize, height: gaugeSize }),
              ]}
            />
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'semibold', size: valueSize }),
                monospacedDigit(),
                foregroundStyle(primary),
              ]}
            >
              {percent}
            </Text>
          </ZStack>

          <HStack spacing={8}>
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: 10 }),
                foregroundStyle(secondary),
              ]}
            >
              {props.label}
            </Text>
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'semibold', size: 10 }),
                monospacedDigit(),
                foregroundStyle(primary),
              ]}
            >
              DAY {Math.round(dayProgress * 100)}%
            </Text>
          </HStack>
        </VStack>
      </ZStack>
    );
  }

  return (
    <ZStack
      modifiers={[containerBackground(background, 'widget'), clipShape('containerRelativeShape')]}
    >
      <VStack
        alignment="center"
        spacing={10}
        modifiers={[
          padding({ all: isLarge ? 18 : 14 }),
          frame({ maxWidth: Infinity, maxHeight: Infinity }),
        ]}
      >
        <HStack spacing={8} modifiers={[frame({ maxWidth: Infinity })]}>
          <Image systemName={props.icon} size={14} color={accent} />
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: 12 }),
              foregroundStyle(secondary),
            ]}
          >
            {props.label}
          </Text>
          <Spacer />
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'semibold', size: 12 }),
              monospacedDigit(),
              foregroundStyle(primary),
            ]}
          >
            {battery}%
          </Text>
        </HStack>

        <Spacer />

        <HStack spacing={16}>
          <Gauge
            value={(temp - 49) / 35}
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint(accent),
              frame({ width: 44, height: 44 }),
            ]}
          />
          <ZStack>
            <Gauge
              value={clamped}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(accent),
                frame({ width: gaugeSize, height: gaugeSize }),
              ]}
            />
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'semibold', size: valueSize }),
                monospacedDigit(),
                foregroundStyle(primary),
              ]}
            >
              {percent}
            </Text>
          </ZStack>
          <Gauge
            value={uv / 11}
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint(accent),
              frame({ width: 44, height: 44 }),
            ]}
          />
        </HStack>

        <HStack spacing={12}>
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'semibold', size: 12 }),
              monospacedDigit(),
              foregroundStyle(primary),
            ]}
          >
            DAY {Math.round(dayProgress * 100)}%
          </Text>
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: 11 }),
              foregroundStyle(muted),
            ]}
          >
            STANDBY
          </Text>
        </HStack>
      </VStack>
    </ZStack>
  );
};

export default createWidget('UltraGaugeWidget', UltraGaugeWidget);
