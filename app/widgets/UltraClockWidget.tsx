/** @jsxImportSource react */
import {
  Capsule,
  Circle,
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
  const { bg, primary, secondary, muted, track, border } = {
    bg: '#000000',
    primary: '#F02A1F',
    secondary: '#B62018',
    muted: '#560F0B',
    track: '#1A0503',
    border: '#2B0806',
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
  const uv = 5;
  const battery = 86;
  const sunsetLabel = '7:29PM';
  const family = `${environment.widgetFamily ?? ''}`;
  const isLarge = family === 'systemLarge' || family.toLowerCase().includes('large');
  const isSmall = family === 'systemSmall' || family.toLowerCase().includes('small');
  const padX = isLarge ? 22 : isSmall ? 12 : 16;
  const padY = isLarge ? 14 : 8;
  const ring = isLarge ? 34 : isSmall ? 22 : 26;
  const ringInner = ring * 0.7;
  const ringCore = ring * 0.42;
  const stroke = Math.max(3, ring * 0.12);
  const hole = ring - stroke * 2;
  const innerHole = ringInner - stroke * 2;
  const coreHole = Math.max(ringCore - stroke * 2, ringCore * 0.45);
  const captionHeight = isLarge ? 12 : isSmall ? 8 : 10;
  const timeSize = isLarge ? 34 : isSmall ? 18 : 22;
  const labelSize = isLarge ? 11 : isSmall ? 8 : 9;
  const captionSize = isLarge ? 12 : isSmall ? 8 : 9;
  const metricSize = isLarge ? 15 : isSmall ? 10 : 12;
  const markSize = isLarge ? 9 : isSmall ? 7 : 8;

  return (
    <ZStack
      alignment="topLeading"
      modifiers={[
        containerBackground(bg, 'widget'),
        clipShape('containerRelativeShape'),
        frame({ maxWidth: Infinity, maxHeight: Infinity }),
      ]}
    >
      <VStack
        alignment="leading"
        spacing={0}
        modifiers={[
          padding({ horizontal: padX, vertical: padY }),
          frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'topLeading' }),
        ]}
      >
        <HStack modifiers={[frame({ maxWidth: Infinity })]}>
          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Circle
                modifiers={[
                  frame({ width: ring, height: ring }),
                  background(primary),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: hole, height: hole }),
                  background(bg),
                  clipShape('circle'),
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
            <HStack modifiers={[frame({ width: ring, height: captionHeight })]}>
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
              <Circle
                modifiers={[
                  frame({ width: ring, height: ring }),
                  background(primary),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: hole, height: hole }),
                  background(bg),
                  clipShape('circle'),
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
            <HStack modifiers={[frame({ width: ring, height: captionHeight })]}>
              <Spacer />
            </HStack>
          </VStack>
          <Spacer />
          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Circle
                modifiers={[
                  frame({ width: ring, height: ring }),
                  background(primary),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: hole, height: hole }),
                  background(bg),
                  clipShape('circle'),
                ]}
              />
              <Image systemName="battery.75" size={ring * 0.34} color={primary} />
            </ZStack>
            <HStack modifiers={[frame({ width: ring, height: captionHeight })]}>
              <Spacer />
            </HStack>
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

        <VStack spacing={4} modifiers={[frame({ maxWidth: Infinity })]}>
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
            spacing={4}
            modifiers={[
              padding({ horizontal: 8, vertical: 6 }),
              background(track),
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

        <Spacer />

        <HStack modifiers={[frame({ maxWidth: Infinity })]}>
          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Circle
                modifiers={[
                  frame({ width: ring, height: ring }),
                  background(primary),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: hole, height: hole }),
                  background(bg),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: ringInner, height: ringInner }),
                  background(primary),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: innerHole, height: innerHole }),
                  background(bg),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: ringCore, height: ringCore }),
                  background(primary),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: coreHole, height: coreHole }),
                  background(bg),
                  clipShape('circle'),
                ]}
              />
            </ZStack>
            <HStack modifiers={[frame({ width: ring, height: captionHeight })]}>
              <Spacer />
            </HStack>
          </VStack>
          <Spacer />
          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Circle
                modifiers={[
                  frame({ width: ring, height: ring }),
                  background(primary),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: hole, height: hole }),
                  background(bg),
                  clipShape('circle'),
                ]}
              />
              <Image systemName="sunset.fill" size={ring * 0.28} color={primary} />
            </ZStack>
            <HStack modifiers={[frame({ width: ring, height: captionHeight })]}>
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: 10 }),
                  monospacedDigit(),
                  foregroundStyle(primary),
                ]}
              >
                {sunsetLabel}
              </Text>
            </HStack>
          </VStack>
          <Spacer />
          <VStack alignment="center" spacing={2} modifiers={[frame({ width: ring })]}>
            <ZStack modifiers={[frame({ width: ring, height: ring })]}>
              <Circle
                modifiers={[
                  frame({ width: ring, height: ring }),
                  background(primary),
                  clipShape('circle'),
                ]}
              />
              <Circle
                modifiers={[
                  frame({ width: hole, height: hole }),
                  background(bg),
                  clipShape('circle'),
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
            <HStack modifiers={[frame({ width: ring, height: captionHeight })]}>
              <Spacer />
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </ZStack>
  );
};

export default createWidget('UltraClockWidget', UltraClockWidget);
