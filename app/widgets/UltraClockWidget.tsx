/** @jsxImportSource react */
import {
  Capsule,
  Gauge,
  HStack,
  Image,
  ProgressView,
  Spacer,
  Text,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  background,
  clipShape,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  gaugeStyle,
  monospacedDigit,
  padding,
  progressViewStyle,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

type UltraClockWidgetProps = Record<string, never>;

const UltraClockWidget = (_props: UltraClockWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const { bg, primary, secondary, muted } = {
    bg: '#000000',
    primary: '#F02A1F',
    secondary: '#B62018',
    muted: '#560F0B',
  };
  const date = environment.date;
  const progress = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
  const dayPercent = Math.round(progress * 100);
  const hour12 = date.getHours() % 12 || 12;
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const minuteLabel = minute < 10 ? `0${minute}` : `${minute}`;
  const secondLabel = second < 10 ? `0${second}` : `${second}`;
  const timeLabel = `${hour12}:${minuteLabel}:${secondLabel}`;
  const dateLabel = `${weekdays[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
  const temp = 72;
  const tempLow = 52;
  const tempHigh = 89;
  const tempProgress = (temp - tempLow) / Math.max(1, tempHigh - tempLow);
  const uv = 5;
  const uvProgress = uv / 11;
  const battery = 86;
  const batteryProgress = battery / 100;
  const dateProgress = date.getDate() / 31;
  const sunsetLabel = '7:29PM';
  const isLarge = environment.widgetFamily === 'systemLarge';
  const isSmall = environment.widgetFamily === 'systemSmall';
  const padX = isLarge ? 26 : 22;
  const padY = isLarge ? 18 : 16;
  const sectionGap = isLarge ? 16 : 14;
  const ring = isLarge ? 50 : isSmall ? 40 : 44;
  const ringInner = ring * 0.72;
  const ringCore = ring * 0.44;
  const timeSize = isLarge ? 42 : isSmall ? 32 : 36;
  const labelSize = isLarge ? 12 : 11;
  const captionSize = isLarge ? 13 : 12;
  const metricSize = isLarge ? 17 : 16;
  const markSize = isLarge ? 11 : 10;

  return (
    <ZStack modifiers={[containerBackground(bg, 'widget'), clipShape('containerRelativeShape')]}>
      <VStack
        alignment="leading"
        spacing={sectionGap}
        modifiers={[
          padding({ horizontal: padX, vertical: padY }),
          frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'topLeading' }),
        ]}
      >
        <HStack spacing={8} modifiers={[frame({ maxWidth: Infinity })]}>
          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Gauge
                value={tempProgress}
                modifiers={[
                  gaugeStyle('circularCapacity'),
                  tint(primary),
                  frame({ width: ring, height: ring }),
                ]}
              />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'semibold', size: ring * 0.34 }),
                  monospacedDigit(),
                  foregroundStyle(primary),
                ]}
              >
                {temp}
              </Text>
            </ZStack>
            <HStack modifiers={[frame({ maxWidth: ring })]}>
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: 9 }),
                  monospacedDigit(),
                  foregroundStyle(secondary),
                ]}
              >
                {tempLow}
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: 9 }),
                  monospacedDigit(),
                  foregroundStyle(secondary),
                ]}
              >
                {tempHigh}
              </Text>
            </HStack>
          </VStack>

          <Spacer />

          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Gauge
                value={dateProgress}
                modifiers={[
                  gaugeStyle('circularCapacity'),
                  tint(primary),
                  frame({ width: ring, height: ring }),
                ]}
              />
              <VStack alignment="center" spacing={0}>
                <Text
                  modifiers={[
                    font({ design: 'rounded', weight: 'bold', size: 9 }),
                    foregroundStyle(secondary),
                  ]}
                >
                  {weekdays[date.getDay()]}
                </Text>
                <Text
                  modifiers={[
                    font({ design: 'rounded', weight: 'semibold', size: ring * 0.3 }),
                    monospacedDigit(),
                    foregroundStyle(primary),
                  ]}
                >
                  {date.getDate()}
                </Text>
              </VStack>
            </ZStack>
          </VStack>

          <Spacer />

          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Gauge
                value={batteryProgress}
                modifiers={[
                  gaugeStyle('circularCapacity'),
                  tint(primary),
                  frame({ width: ring, height: ring }),
                ]}
              />
              <Image systemName="battery.75" size={ring * 0.34} color={primary} />
            </ZStack>
          </VStack>
        </HStack>

        <Spacer />

        <VStack alignment="center" spacing={4} modifiers={[frame({ maxWidth: Infinity })]}>
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: labelSize }),
              foregroundStyle(secondary),
            ]}
          >
            CLOCK
          </Text>
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'semibold', size: timeSize }),
              monospacedDigit(),
              foregroundStyle(primary),
            ]}
          >
            {timeLabel}
          </Text>
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: captionSize }),
              foregroundStyle(secondary),
            ]}
          >
            {dateLabel}
          </Text>
        </VStack>

        <Spacer />

        <VStack spacing={6} modifiers={[frame({ maxWidth: Infinity })]}>
          <HStack modifiers={[frame({ maxWidth: Infinity })]}>
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: metricSize }),
                monospacedDigit(),
                foregroundStyle(primary),
              ]}
            >
              DAY {dayPercent}%
            </Text>
            <Spacer />
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: captionSize }),
                monospacedDigit(),
                foregroundStyle(secondary),
              ]}
            >
              {battery}%
            </Text>
          </HStack>
          <VStack
            spacing={6}
            modifiers={[
              padding({ horizontal: 8, vertical: 8 }),
              background('#080202'),
              clipShape('roundedRectangle', 8),
            ]}
          >
            <ProgressView
              value={progress}
              modifiers={[
                progressViewStyle('linear'),
                tint(primary),
                frame({ maxWidth: Infinity }),
              ]}
            />
            <HStack modifiers={[frame({ maxWidth: Infinity })]}>
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: markSize }),
                  foregroundStyle(primary),
                ]}
              >
                12A
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: markSize }),
                  foregroundStyle(progress >= 0.25 ? primary : muted),
                ]}
              >
                6A
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: markSize }),
                  foregroundStyle(progress >= 0.5 ? primary : muted),
                ]}
              >
                12P
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: markSize }),
                  foregroundStyle(progress >= 0.75 ? primary : muted),
                ]}
              >
                6P
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: markSize }),
                  foregroundStyle(muted),
                ]}
              >
                12A
              </Text>
            </HStack>
          </VStack>
        </VStack>

        <HStack spacing={8} modifiers={[frame({ maxWidth: Infinity })]}>
          <ZStack modifiers={[frame({ width: ring, height: ring })]}>
            <Gauge
              value={0.78}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(primary),
                frame({ width: ring, height: ring }),
              ]}
            />
            <Gauge
              value={0.52}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(primary),
                frame({ width: ringInner, height: ringInner }),
              ]}
            />
            <Gauge
              value={0.91}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(primary),
                frame({ width: ringCore, height: ringCore }),
              ]}
            />
          </ZStack>
          <Spacer />
          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Gauge
                value={1}
                modifiers={[
                  gaugeStyle('circularCapacity'),
                  tint(primary),
                  frame({ width: ring, height: ring }),
                ]}
              />
              <Image systemName="sunset.fill" size={ring * 0.28} color={primary} />
            </ZStack>
            <Text
              modifiers={[
                font({ design: 'rounded', weight: 'bold', size: 10 }),
                monospacedDigit(),
                foregroundStyle(primary),
              ]}
            >
              {sunsetLabel}
            </Text>
          </VStack>
          <Spacer />
          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Gauge
                value={uvProgress}
                modifiers={[
                  gaugeStyle('circularCapacity'),
                  tint(primary),
                  frame({ width: ring, height: ring }),
                ]}
              />
              <VStack alignment="center" spacing={1}>
                <Text
                  modifiers={[
                    font({ design: 'rounded', weight: 'semibold', size: ring * 0.34 }),
                    monospacedDigit(),
                    foregroundStyle(primary),
                  ]}
                >
                  {uv}
                </Text>
                <Capsule
                  modifiers={[
                    frame({ width: ring * 0.2, height: ring * 0.2 }),
                    background(primary),
                  ]}
                />
              </VStack>
            </ZStack>
          </VStack>
        </HStack>
      </VStack>
    </ZStack>
  );
};

export default createWidget('UltraClockWidget', UltraClockWidget);
