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

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const UltraClockWidget = (_props: UltraClockWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const background = '#000000';
  const primary = '#FF453A';
  const secondary = '#C23B33';
  const muted = '#5C221E';
  const accent = '#FF453A';
  const date = environment.date;
  const progress = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
  const hour12 = date.getHours() % 12 || 12;
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const minuteLabel = minute < 10 ? `0${minute}` : `${minute}`;
  const secondLabel = second < 10 ? `0${second}` : `${second}`;
  const timeLabel = `${hour12}:${minuteLabel}`;
  const timeWithSeconds = `${hour12}:${minuteLabel}:${secondLabel}`;
  const dateLabel = `${MONTHS[date.getMonth()]} ${date.getDate()}`;
  const temp = 72;
  const uv = 5;
  const dayPercent = Math.round(progress * 100);
  const isSmall = environment.widgetFamily === 'systemSmall';
  const isLarge = environment.widgetFamily === 'systemLarge';
  const timeSize = isSmall ? 34 : isLarge ? 72 : 56;

  if (isSmall) {
    return (
      <ZStack
        modifiers={[
          containerBackground(background, 'widget'),
          clipShape('containerRelativeShape'),
        ]}>
        <VStack
          alignment="center"
          spacing={5}
          modifiers={[
            padding({ all: 10 }),
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
          ]}>
          <HStack spacing={8} modifiers={[frame({ maxWidth: Infinity })]}>
            <Gauge
              value={(temp - 52) / 37}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(accent),
                frame({ width: 28, height: 28 }),
              ]}
            />
            <Spacer />
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: 10 }),
                foregroundStyle(secondary),
              ]}>
              {dateLabel}
            </Text>
            <Spacer />
            <Gauge
              value={uv / 11}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(accent),
                frame({ width: 28, height: 28 }),
              ]}
            />
          </HStack>

          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'semibold', size: timeSize }),
              monospacedDigit(),
              foregroundStyle(primary),
            ]}>
            {timeLabel}
          </Text>

          <HStack spacing={10} modifiers={[frame({ maxWidth: Infinity })]}>
            <Gauge
              value={progress}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(accent),
                frame({ width: 22, height: 22 }),
              ]}
            />
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'semibold', size: 11 }),
                monospacedDigit(),
                foregroundStyle(primary),
              ]}>
              DAY {dayPercent}%
            </Text>
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: 10 }),
                foregroundStyle(muted),
              ]}>
              UV {uv}
            </Text>
          </HStack>
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
        spacing={8}
        modifiers={[
          padding({ all: isLarge ? 18 : 14 }),
          frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'leading' }),
        ]}>
        <HStack spacing={10} modifiers={[frame({ maxWidth: Infinity })]}>
          <Gauge
            value={(temp - 52) / 37}
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint(accent),
              frame({ width: 36, height: 36 }),
            ]}
          />
          <VStack alignment="leading" spacing={2}>
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'semibold', size: 12 }),
                foregroundStyle(secondary),
              ]}>
              {temp}°
            </Text>
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'medium', size: 10 }),
                foregroundStyle(muted),
              ]}>
              52 / 89
            </Text>
          </VStack>
          <Spacer />
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: 13 }),
              foregroundStyle(primary),
            ]}>
            {dateLabel}
          </Text>
        </HStack>

        <Spacer />

        <Text
          modifiers={[
            font({ design: 'rounded', weight: 'semibold', size: timeSize }),
            monospacedDigit(),
            foregroundStyle(primary),
          ]}>
          {isLarge ? timeWithSeconds : timeLabel}
        </Text>

        <HStack spacing={12} modifiers={[frame({ maxWidth: Infinity })]}>
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'semibold', size: 12 }),
              monospacedDigit(),
              foregroundStyle(primary),
            ]}>
            DAY {dayPercent}%
          </Text>
          <Spacer />
          <Gauge
            value={progress}
            modifiers={[
              gaugeStyle('circularCapacity'),
              tint(accent),
              frame({ width: 28, height: 28 }),
            ]}
          />
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: 11 }),
              foregroundStyle(secondary),
            ]}>
            UV {uv}
          </Text>
        </HStack>
      </VStack>
    </ZStack>
  );
};

export default createWidget('UltraClockWidget', UltraClockWidget);
