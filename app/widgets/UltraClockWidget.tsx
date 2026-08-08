import { Gauge, HStack, Spacer, Text, VStack, ZStack } from '@expo/ui/swift-ui';
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

import { dayProgress, ultraColors } from '../theme/ultra';

type UltraClockWidgetProps = Record<string, never>;

const UltraClockWidget = (_props: UltraClockWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const isSmall = environment.widgetFamily === 'systemSmall';
  const isLarge = environment.widgetFamily === 'systemLarge';
  const progress = dayProgress(environment.date);
  const timeSize = isSmall ? 40 : isLarge ? 88 : 72;
  const dateSize = isSmall ? 10 : 14;
  const ringSize = isSmall ? 32 : isLarge ? 56 : 44;

  if (isSmall) {
    return (
      <ZStack
        modifiers={[
          containerBackground(ultraColors.background, 'widget'),
          clipShape('containerRelativeShape'),
        ]}>
        <VStack
          alignment="center"
          spacing={8}
          modifiers={[
            padding({ all: 12 }),
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
          ]}>
          <Gauge
            value={progress}
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint(ultraColors.accent),
              frame({ width: ringSize, height: ringSize }),
            ]}
          />
          <Text
            date={environment.date}
            dateStyle="time"
            modifiers={[
              font({ design: 'rounded', weight: 'ultraLight', size: timeSize }),
              monospacedDigit(),
              foregroundStyle(ultraColors.primary),
            ]}
          />
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
        alignment="leading"
        spacing={isSmall ? 6 : 10}
        modifiers={[
          padding({ all: isSmall ? 14 : 20 }),
          frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'leading' }),
        ]}>
        <HStack spacing={12} modifiers={[frame({ maxWidth: Infinity })]}>
          <Text
            date={environment.date}
            dateStyle="date"
            modifiers={[
              font({ design: 'rounded', weight: 'semibold', size: dateSize }),
              foregroundStyle(ultraColors.secondary),
            ]}
          />
          <Spacer />
          <Gauge
            value={progress}
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint(ultraColors.accent),
              frame({ width: ringSize, height: ringSize }),
            ]}
          />
        </HStack>

        <Spacer />

        <Text
          date={environment.date}
          dateStyle="time"
          modifiers={[
            font({ design: 'rounded', weight: 'ultraLight', size: timeSize }),
            monospacedDigit(),
            foregroundStyle(ultraColors.primary),
          ]}
        />

        {!isSmall && (
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: 12 }),
              foregroundStyle(ultraColors.accent),
            ]}>
            STANDBY
          </Text>
        )}
      </VStack>
    </ZStack>
  );
};

export default createWidget('UltraClockWidget', UltraClockWidget);
