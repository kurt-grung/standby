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
import type { UltraGaugeWidgetProps as StandbyGaugeWidgetProps } from '../lib/standbyWidgetTypes';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type UltraGaugeWidgetProps = StandbyGaugeWidgetProps & {
  icon: string;
};

const UltraGaugeWidget = (props: UltraGaugeWidgetProps, environment: WidgetEnvironment) => {
  'widget';
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
  const focus = props.value > 0 ? props.value : Math.max(0.2, 1 - progress);
  const focusPercent = Math.round(Math.min(1, Math.max(0, focus)) * 100);
  const temp = 68;
  const tempLow = 49;
  const tempHigh = 84;
  const uv = 4;
  const battery = 74;
  const noiseDb = 38;
  const sunsetLabel = '7:31PM';
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
  const hero = isLarge ? 64 : isSmall ? 38 : 46;
  const heroStroke = Math.max(5, hero * 0.1);
  const heroHole = hero - heroStroke * 2;
  const heroValueSize = hero * 0.28;
  const labelSize = isLarge ? 11 : isSmall ? 8 : 9;
  const metricLabelSize = isLarge ? 9 : isSmall ? 7 : 8;
  const metricValueSize = isLarge ? 12 : isSmall ? 8 : 10;
  const metricGap = isLarge ? 3 : 2;

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
              <VStack alignment="center" spacing={1}>
                <Image systemName="waveform" size={ring * 0.22} color={primary} />
                <Text
                  modifiers={[
                    font({ design: 'rounded', weight: 'bold', size: 11 }),
                    monospacedDigit(),
                    foregroundStyle(primary),
                  ]}
                >
                  {noiseDb}
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
              <Image systemName="battery.50" size={ring * 0.34} color={primary} />
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
            STATUS
          </Text>
          <ZStack modifiers={[frame({ width: hero, height: hero })]}>
            <Circle
              modifiers={[
                frame({ width: hero, height: hero }),
                background(primary),
                clipShape('circle'),
              ]}
            />
            <Circle
              modifiers={[
                frame({ width: heroHole, height: heroHole }),
                background(bg),
                clipShape('circle'),
              ]}
            />
            <VStack alignment="center" spacing={2}>
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'semibold', size: heroValueSize }),
                  monospacedDigit(),
                  foregroundStyle(primary),
                ]}
              >
                {dayPercent}
              </Text>
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: labelSize }),
                  foregroundStyle(secondary),
                ]}
              >
                DAY %
              </Text>
            </VStack>
          </ZStack>
        </VStack>

        <Spacer />

        <VStack spacing={metricGap} modifiers={[frame({ maxWidth: Infinity })]}>
          <VStack spacing={2} modifiers={[frame({ maxWidth: Infinity })]}>
            <HStack modifiers={[frame({ maxWidth: Infinity })]}>
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: metricLabelSize }),
                  foregroundStyle(secondary),
                ]}
              >
                FOCUS
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: metricValueSize }),
                  monospacedDigit(),
                  foregroundStyle(primary),
                ]}
              >
                {focusPercent}%
              </Text>
            </HStack>
            <ProgressView
              value={focus}
              modifiers={[
                progressViewStyle('linear'),
                tint(primary),
                background(track),
                clipShape('capsule'),
                frame({ maxWidth: Infinity }),
              ]}
            />
          </VStack>
          <VStack spacing={2} modifiers={[frame({ maxWidth: Infinity })]}>
            <HStack modifiers={[frame({ maxWidth: Infinity })]}>
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: metricLabelSize }),
                  foregroundStyle(secondary),
                ]}
              >
                BATTERY
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: metricValueSize }),
                  monospacedDigit(),
                  foregroundStyle(primary),
                ]}
              >
                {battery}%
              </Text>
            </HStack>
            <ProgressView
              value={battery / 100}
              modifiers={[
                progressViewStyle('linear'),
                tint(primary),
                background(track),
                clipShape('capsule'),
                frame({ maxWidth: Infinity }),
              ]}
            />
          </VStack>
          <VStack spacing={2} modifiers={[frame({ maxWidth: Infinity })]}>
            <HStack modifiers={[frame({ maxWidth: Infinity })]}>
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: metricLabelSize }),
                  foregroundStyle(secondary),
                ]}
              >
                NOISE
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'bold', size: metricValueSize }),
                  monospacedDigit(),
                  foregroundStyle(primary),
                ]}
              >
                {noiseDb} dB
              </Text>
            </HStack>
            <ProgressView
              value={noiseDb / 100}
              modifiers={[
                progressViewStyle('linear'),
                tint(primary),
                background(track),
                clipShape('capsule'),
                frame({ maxWidth: Infinity }),
              ]}
            />
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

export default createWidget('UltraGaugeWidget', UltraGaugeWidget);
