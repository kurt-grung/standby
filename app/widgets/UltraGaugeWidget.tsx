/** @jsxImportSource react */
import {
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
import type { UltraGaugeWidgetProps as StandbyGaugeWidgetProps } from '../lib/standbyWidgetTypes';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type UltraGaugeWidgetProps = StandbyGaugeWidgetProps & {
  icon: string;
};

const UltraGaugeWidget = (props: UltraGaugeWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const { bg, primary, secondary } = {
    bg: '#000000',
    primary: '#F02A1F',
    secondary: '#B62018',
  };
  const date = environment.date;
  const progress = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
  const dayPercent = Math.round(progress * 100);
  const focus = props.value > 0 ? props.value : Math.max(0.2, 1 - progress);
  const focusPercent = Math.round(Math.min(1, Math.max(0, focus)) * 100);
  const temp = 68;
  const tempLow = 49;
  const tempHigh = 84;
  const tempProgress = (temp - tempLow) / Math.max(1, tempHigh - tempLow);
  const uv = 4;
  const uvProgress = uv / 11;
  const battery = 74;
  const batteryProgress = battery / 100;
  const noiseDb = 38;
  const noiseProgress = noiseDb / 100;
  const sunsetLabel = '7:31PM';
  const isLarge = environment.widgetFamily === 'systemLarge';
  const isSmall = environment.widgetFamily === 'systemSmall';
  const padX = isLarge ? 26 : 22;
  const padY = isLarge ? 18 : 16;
  const sectionGap = isLarge ? 16 : 14;
  const ring = isLarge ? 50 : isSmall ? 40 : 44;
  const ringInner = ring * 0.72;
  const ringCore = ring * 0.44;
  const hero = isLarge ? 96 : isSmall ? 72 : 84;
  const heroValueSize = hero * 0.28;
  const labelSize = isLarge ? 12 : 11;
  const metricLabelSize = isLarge ? 10 : 9;
  const metricValueSize = isLarge ? 13 : 12;

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
                value={noiseProgress}
                modifiers={[
                  gaugeStyle('circularCapacity'),
                  tint(primary),
                  frame({ width: ring, height: ring }),
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
              <Image systemName="battery.50" size={ring * 0.34} color={primary} />
            </ZStack>
          </VStack>
        </HStack>

        <Spacer />

        <VStack alignment="center" spacing={6} modifiers={[frame({ maxWidth: Infinity })]}>
          <Text
            modifiers={[
              font({ design: 'rounded', weight: 'bold', size: labelSize }),
              foregroundStyle(secondary),
            ]}
          >
            STATUS
          </Text>
          <ZStack modifiers={[frame({ width: hero, height: hero })]}>
            <Gauge
              value={progress}
              modifiers={[
                gaugeStyle('circularCapacity'),
                tint(primary),
                frame({ width: hero, height: hero }),
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

        <VStack spacing={4} modifiers={[frame({ maxWidth: Infinity })]}>
          <VStack spacing={2}>
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
                frame({ maxWidth: Infinity }),
              ]}
            />
          </VStack>

          <VStack spacing={2}>
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
              value={batteryProgress}
              modifiers={[
                progressViewStyle('linear'),
                tint(primary),
                frame({ maxWidth: Infinity }),
              ]}
            />
          </VStack>

          <VStack spacing={2}>
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
              value={noiseProgress}
              modifiers={[
                progressViewStyle('linear'),
                tint(primary),
                frame({ maxWidth: Infinity }),
              ]}
            />
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
              <Text
                modifiers={[
                  font({ design: 'rounded', weight: 'semibold', size: ring * 0.34 }),
                  monospacedDigit(),
                  foregroundStyle(primary),
                ]}
              >
                {uv}
              </Text>
            </ZStack>
          </VStack>
        </HStack>
      </VStack>
    </ZStack>
  );
};

export default createWidget('UltraGaugeWidget', UltraGaugeWidget);
