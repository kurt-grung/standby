import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import Animated, { type AnimatedRef, type ScrollHandlerProcessed } from 'react-native-reanimated';

import { useAppChrome } from '../theme/useAppChrome';

type ScreenShellProps = {
  children: ReactNode;
  scroll?: boolean;
  contentClassName?: string;
  overlay?: ReactNode;
  onScroll?: ScrollHandlerProcessed;
  scrollRef?: AnimatedRef<Animated.ScrollView>;
} & Pick<ScrollViewProps, 'showsVerticalScrollIndicator'>;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function ScreenShell({
  children,
  scroll = true,
  contentClassName = 'px-6 pb-10',
  showsVerticalScrollIndicator = false,
  overlay,
  onScroll,
  scrollRef,
}: ScreenShellProps) {
  const chrome = useAppChrome();

  if (!scroll) {
    return (
      <View className={`flex-1 ${contentClassName}`} style={{ backgroundColor: chrome.colors.bg }}>
        {overlay}
        {children}
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: chrome.colors.bg }}>
      <AnimatedScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName={contentClassName}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onScroll={onScroll}
      >
        {children}
      </AnimatedScrollView>
      {overlay ? (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          {overlay}
        </View>
      ) : null}
    </View>
  );
}
