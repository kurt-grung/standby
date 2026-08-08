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

type UltraClockWidgetProps = Record<string, never>;

const UltraClockWidget = (_props: UltraClockWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const background = '#000000';
  const primary = '#FF453A';
  const secondary = '#A8423A';
  const accent = '#FF453A';
  const date = environment.date;
  const progress = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
  const hour12 = date.getHours() % 12 || 12;
  const minute = date.getMinutes();
  const minuteLabel = minute < 10 ? `0${minute}` : `${minute}`;
  const timeLabel = `${hour12}:${minuteLabel}`;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateLabel = `${monthNames[date.getMonth()]} ${date.getDate()}`;
  const isSmall = environment.widgetFamily === 'systemSmall';
  const isLarge = environment.widgetFamily === 'systemLarge';
  const timeSize = isSmall ? 40 : isLarge ? 88 : 72;
  const dateSize = isSmall ? 10 : 14;
  const ringSize = isSmall ? 32 : isLarge ? 56 : 44;

  if (isSmall) {
    return (
      <ZStack
        modifiers={[
          containerBackground(background, 'widget'),
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
              tint(accent),
              frame({ width: ringSize, height: ringSize }),
            ]}
          />
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'light', size: timeSize }),
              monospacedDigit(),
              foregroundStyle(primary),
            ]}>
            {timeLabel}
          </Text>
        </VStack>
      </ZStack>
    );
  }

  return (
    <ZStack
      modifiers={[
        containerBackground(background, 'widget'),
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
            modifiers={[
              font({ design: 'rounded', weight: 'semibold', size: dateSize }),
              foregroundStyle(secondary),
            ]}>
            {dateLabel}
          </Text>
          <Spacer />
          <Gauge
            value={progress}
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint(accent),
              frame({ width: ringSize, height: ringSize }),
            ]}
          />
        </HStack>

        <Spacer />

        <Text
          modifiers={[
            font({ design: 'rounded', weight: 'light', size: timeSize }),
            monospacedDigit(),
            foregroundStyle(primary),
          ]}>
          {timeLabel}
        </Text>

        {!isSmall && (
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: 12 }),
              foregroundStyle(accent),
            ]}>
            STANDBY
          </Text>
        )}
      </VStack>
    </ZStack>
  );
};

export default createWidget('UltraClockWidget', UltraClockWidget);
