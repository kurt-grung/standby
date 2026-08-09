import type { ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

import { useAppChrome } from '../theme/useAppChrome';

type ScreenShellProps = {
  children: ReactNode;
  scroll?: boolean;
  contentClassName?: string;
} & Pick<ScrollViewProps, 'showsVerticalScrollIndicator'>;

export function ScreenShell({
  children,
  scroll = true,
  contentClassName = 'px-6 pb-10',
  showsVerticalScrollIndicator = false,
}: ScreenShellProps) {
  const chrome = useAppChrome();

  if (!scroll) {
    return (
      <View className={`flex-1 ${contentClassName}`} style={{ backgroundColor: chrome.colors.bg }}>
        {children}
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: chrome.colors.bg }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName={contentClassName}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      >
        {children}
      </ScrollView>
    </View>
  );
}
