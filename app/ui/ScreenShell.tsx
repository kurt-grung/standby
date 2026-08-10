import type { ReactNode } from 'react';
import { useAnimatedRef } from 'react-native-reanimated';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import Animated, {
  type AnimatedRef,
  type ScrollHandlerProcessed,
  type SharedValue,
} from 'react-native-reanimated';
import { useStandbySafeAreaInsets } from '../hooks/useStandbySafeAreaInsets';
import { useResetAnimatedScrollOnFocus } from '../hooks/useResetScrollOnFocus';

import { groupedScreenBottomInset } from '../theme/groupedLayout';
import { nativeTabBarHeight } from '../theme/nativeTabBarMetrics';
import { useAppChrome } from '../theme/useAppChrome';

type ScreenShellProps = {
  children: ReactNode;
  scroll?: boolean;
  contentClassName?: string;
  overlay?: ReactNode;
  onScroll?: ScrollHandlerProcessed;
  scrollRef?: AnimatedRef<Animated.ScrollView>;
  scrollOffset?: SharedValue<number>;
} & Pick<ScrollViewProps, 'showsVerticalScrollIndicator'>;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type ScrollingScreenShellProps = Omit<ScreenShellProps, 'scroll'>;

function ScrollingScreenShell({
  children,
  contentClassName = 'px-6',
  showsVerticalScrollIndicator = false,
  overlay,
  onScroll,
  scrollRef: scrollRefProp,
  scrollOffset,
}: ScrollingScreenShellProps) {
  const chrome = useAppChrome();
  const insets = useStandbySafeAreaInsets();
  const internalScrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollRef = scrollRefProp ?? internalScrollRef;
  useResetAnimatedScrollOnFocus(scrollRef, scrollOffset);
  const contentInsetStyle = {
    paddingBottom: insets.bottom + nativeTabBarHeight + groupedScreenBottomInset,
  };

  return (
    <View className="flex-1" style={{ backgroundColor: chrome.colors.bg }}>
      <AnimatedScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName={contentClassName}
        contentContainerStyle={contentInsetStyle}
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

export function ScreenShell({
  children,
  scroll = true,
  contentClassName = 'px-6',
  showsVerticalScrollIndicator = false,
  overlay,
  onScroll,
  scrollRef,
  scrollOffset,
}: ScreenShellProps) {
  const chrome = useAppChrome();
  const insets = useStandbySafeAreaInsets();
  const contentInsetStyle = {
    paddingBottom: insets.bottom + nativeTabBarHeight + groupedScreenBottomInset,
  };

  if (!scroll) {
    return (
      <View
        className={`flex-1 ${contentClassName}`}
        style={[{ backgroundColor: chrome.colors.bg }, contentInsetStyle]}
      >
        {overlay}
        {children}
      </View>
    );
  }

  return (
    <ScrollingScreenShell
      contentClassName={contentClassName}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      overlay={overlay}
      onScroll={onScroll}
      scrollRef={scrollRef}
      scrollOffset={scrollOffset}
    >
      {children}
    </ScrollingScreenShell>
  );
}
