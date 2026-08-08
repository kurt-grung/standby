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
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import type { SFSymbol } from 'sf-symbols-typescript';

import { ultraColors } from '../theme/ultra';

export type UltraGaugeWidgetProps = {
  label: string;
  value: number;
  unit: string;
  icon: SFSymbol;
};

const UltraGaugeWidget = (props: UltraGaugeWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const isSmall = environment.widgetFamily === 'systemSmall';
  const clamped = Math.min(1, Math.max(0, props.value));
  const percent = Math.round(clamped * 100);
  const gaugeSize = isSmall ? 64 : 112;
  const valueSize = isSmall ? 22 : 40;

  if (isSmall) {
    return (
      <ZStack
        modifiers={[
          containerBackground(ultraColors.background, 'widget'),
          clipShape('containerRelativeShape'),
        ]}>
        <VStack
          alignment="center"
          spacing={6}
          modifiers={[
            padding({ all: 12 }),
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
          ]}>
          <ZStack>
            <Gauge
              value={clamped}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(ultraColors.accent),
                frame({ width: gaugeSize, height: gaugeSize }),
              ]}
            />
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'light', size: valueSize }),
                monospacedDigit(),
                foregroundStyle(ultraColors.primary),
              ]}>
              {percent}
            </Text>
          </ZStack>
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: 10 }),
              foregroundStyle(ultraColors.secondary),
            ]}>
            {props.label}
          </Text>
        </VStack>
      </ZStack>
    );
  }

  return (
    <ZStack
      modifiers={[
        containerBackground(ultraColors.background, 'widget'),
        clipShape('containerRelativeShape'),
      ]}>
      <VStack
        alignment="center"
        spacing={isSmall ? 8 : 12}
        modifiers={[
          padding({ all: isSmall ? 14 : 20 }),
          frame({ maxWidth: Infinity, maxHeight: Infinity }),
        ]}>
        <HStack spacing={8} modifiers={[frame({ maxWidth: Infinity })]}>
          <Image systemName={props.icon} size={14} color={ultraColors.accent} />
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: 12 }),
              foregroundStyle(ultraColors.secondary),
            ]}>
            {props.label}
          </Text>
          <Spacer />
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'semibold', size: 12 }),
              foregroundStyle(ultraColors.accentGreen),
            ]}>
            {percent}
            {props.unit}
          </Text>
        </HStack>

        <Spacer />

        <ZStack>
          <Gauge
            value={clamped}
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint(ultraColors.accent),
              frame({ width: gaugeSize, height: gaugeSize }),
            ]}
          />
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'light', size: valueSize }),
              monospacedDigit(),
              foregroundStyle(ultraColors.primary),
            ]}>
            {percent}
          </Text>
        </ZStack>

        {!isSmall && (
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'medium', size: 13 }),
              foregroundStyle(ultraColors.secondary),
            ]}>
            Ultra Night
          </Text>
        )}
      </VStack>
    </ZStack>
  );
};

export default createWidget('UltraGaugeWidget', UltraGaugeWidget);
