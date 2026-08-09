import type { ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import {
  groupedSectionSpacing,
  groupedStepBadgeSize,
  groupedStepDividerInset,
  groupedStepGap,
  groupedStepHorizontalPad,
} from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';

type GroupedSectionProps = {
  title?: string;
  footer?: string;
  children: ReactNode;
  className?: string;
};

export function GroupedSection({
  title,
  footer,
  children,
  className = groupedSectionSpacing,
}: GroupedSectionProps) {
  const chrome = useAppChrome();

  return (
    <View className={className}>
      {title ? (
        <Text
          className="mb-1.5 text-[13px] font-normal uppercase tracking-[0.04em]"
          style={{ color: chrome.colors.secondary }}
        >
          {title}
        </Text>
      ) : null}
      <View
        className="overflow-hidden rounded-[10px]"
        style={{ backgroundColor: chrome.colors.card }}
      >
        {children}
      </View>
      {footer ? (
        <Text
          className="mt-1.5 text-[13px] leading-[18px]"
          style={{ color: chrome.colors.secondary }}
        >
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

type GroupedDividerProps = {
  inset?: 'full' | 'row' | 'step';
};

export function GroupedDivider({ inset = 'row' }: GroupedDividerProps) {
  const chrome = useAppChrome();
  const marginLeft =
    inset === 'full' ? 0 : inset === 'step' ? groupedStepDividerInset : groupedStepHorizontalPad;

  return <View className="h-px" style={{ marginLeft, backgroundColor: chrome.colors.border }} />;
}

type GroupedInsetProps = {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
};

export function GroupedInset({ children, className, style }: GroupedInsetProps) {
  return (
    <View className={className} style={style}>
      {children}
    </View>
  );
}

type GroupedStepRowsProps = {
  steps: readonly string[];
};

export function GroupedStepRows({ steps }: GroupedStepRowsProps) {
  const chrome = useAppChrome();

  return steps.map((step, index) => (
    <View key={step}>
      <GroupedDivider inset={index === 0 ? 'full' : 'step'} />
      <View
        className="flex-row items-start"
        style={{
          gap: groupedStepGap,
          paddingHorizontal: groupedStepHorizontalPad,
          paddingVertical: 14,
        }}
      >
        <View
          className="shrink-0 items-center justify-center rounded-full"
          style={{
            width: groupedStepBadgeSize,
            height: groupedStepBadgeSize,
            backgroundColor: chrome.colors.accentSoft,
          }}
        >
          <Text
            className="text-[12px] font-semibold"
            style={{ color: chrome.colors.primary, fontVariant: ['tabular-nums'] }}
          >
            {index + 1}
          </Text>
        </View>
        <Text className="flex-1 text-[15px] leading-5" style={{ color: chrome.colors.primary }}>
          {step}
        </Text>
      </View>
    </View>
  ));
}
