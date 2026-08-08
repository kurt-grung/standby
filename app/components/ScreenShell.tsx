import type { ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppChrome } from '../theme/useAppChrome';

type ScreenShellProps = {
  children: ReactNode;
  scroll?: boolean;
  contentClassName?: string;
  overlay?: ReactNode;
} & Pick<ScrollViewProps, 'showsVerticalScrollIndicator'>;

export function ScreenShell({
  children,
  scroll = true,
  contentClassName = 'px-6 pb-10 pt-2',
  overlay,
  showsVerticalScrollIndicator = false,
}: ScreenShellProps) {
  const chrome = useAppChrome();

  if (!scroll) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: chrome.colors.bg }}
        edges={['top', 'left', 'right', 'bottom']}>
        {overlay}
        <View className={`flex-1 ${contentClassName}`}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: chrome.colors.bg }}
      edges={['top', 'left', 'right', 'bottom']}>
      {overlay}
      <ScrollView
        className="flex-1"
        contentContainerClassName={contentClassName}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
