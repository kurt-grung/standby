import { Text, View } from 'react-native';

import {
  homeSetupBodySize,
  homeSetupLineHeight,
  homeSetupNumberGap,
  homeSetupNumberWidth,
  homeSetupRowGap,
  homeSetupTitleBottom,
  homeSetupTitleSize,
  homeSetupTopSpacing,
} from '../theme/homeSetupLayout';
import { useAppChrome } from '../theme/useAppChrome';

type SetupStepPart = {
  text: string;
  emphasis?: boolean;
};

type SetupStep = {
  id: string;
  parts: readonly SetupStepPart[];
};

const setupSteps: readonly SetupStep[] = [
  {
    id: 'landscape',
    parts: [{ text: 'Plug in and rotate to landscape' }],
  },
  {
    id: 'edit',
    parts: [{ text: 'Long-press StandBy, tap ' }, { text: 'Edit', emphasis: true }],
  },
  {
    id: 'widgets',
    parts: [
      { text: 'Add ' },
      { text: 'StandBy+', emphasis: true },
      { text: ' widgets to each side' },
    ],
  },
  {
    id: 'size',
    parts: [{ text: 'Small', emphasis: true }, { text: ' size, one in each column' }],
  },
  {
    id: 'complications',
    parts: [
      { text: 'Tap ' },
      { text: 'Configure', emphasis: true },
      { text: ' above to pick ' },
      { text: 'complications', emphasis: true },
    ],
  },
];

function SetupStepText({ parts, color }: { parts: readonly SetupStepPart[]; color: string }) {
  return (
    <Text
      className="flex-1"
      style={{
        color,
        fontSize: homeSetupBodySize,
        lineHeight: homeSetupLineHeight,
      }}
    >
      {parts.map((part, partIndex) => (
        <Text
          key={`${part.text}-${partIndex}`}
          style={{ fontWeight: part.emphasis ? '600' : '400' }}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
}

export function HomeSetupSection() {
  const chrome = useAppChrome();

  return (
    <View accessibilityLabel="How to use StandBy+" style={{ marginTop: homeSetupTopSpacing }}>
      <Text
        style={{
          color: chrome.colors.primary,
          fontSize: homeSetupTitleSize,
          fontWeight: '600',
          lineHeight: homeSetupLineHeight,
          marginBottom: homeSetupTitleBottom,
        }}
      >
        How to use
      </Text>
      <View style={{ gap: homeSetupRowGap }}>
        {setupSteps.map((step, index) => (
          <View key={step.id} className="flex-row items-center" style={{ gap: homeSetupNumberGap }}>
            <Text
              style={{
                width: homeSetupNumberWidth,
                color: chrome.colors.primary,
                fontSize: homeSetupBodySize,
                fontVariant: ['tabular-nums'],
                fontWeight: '600',
                lineHeight: homeSetupLineHeight,
                textAlign: 'right',
              }}
            >
              {index + 1}
            </Text>
            <SetupStepText parts={step.parts} color={chrome.colors.primary} />
          </View>
        ))}
      </View>
    </View>
  );
}
