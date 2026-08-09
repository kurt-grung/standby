import { useCallback, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  runOnUI,
  scrollTo,
  useAnimatedReaction,
  useAnimatedStyle,
  type AnimatedRef,
  type SharedValue,
} from 'react-native-reanimated';

import {
  groupedStickyPlusTopInset,
  groupedWordmarkBottomSpacing,
  groupedWordmarkSize,
  groupedWordmarkStickFadeLength,
  groupedWordmarkStickStart,
  groupedWordmarkTopSpacing,
  groupedScreenHorizontalPad,
} from '../theme/groupedLayout';
import { standByWordmarkMetrics } from './StandByWordmark';
import { StickyPlusGlassButton } from './StickyPlusGlassButton';
import { WordmarkPlusButton } from './WordmarkPlusButton';
import { useAppChrome } from '../theme/useAppChrome';

type WordmarkScrollProps = {
  scrollY: SharedValue<number>;
  scrollRef: AnimatedRef<Animated.ScrollView>;
};

const stickEnd = groupedWordmarkStickStart + groupedWordmarkStickFadeLength;
const wordmarkMetrics = standByWordmarkMetrics(groupedWordmarkSize);

function useScrollToTop(scrollRef: AnimatedRef<Animated.ScrollView>) {
  return useCallback(() => {
    runOnUI(() => {
      scrollTo(scrollRef, 0, 0, true);
    })();
  }, [scrollRef]);
}

export function AppWordmarkHeader({ scrollY, scrollRef }: WordmarkScrollProps) {
  const chrome = useAppChrome();
  const scrollToTop = useScrollToTop(scrollRef);

  const standByStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [groupedWordmarkStickStart, stickEnd],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const plusFlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [groupedWordmarkStickStart, groupedWordmarkStickStart + 1],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View
      accessibilityLabel="StandBy+"
      className="flex-row items-baseline justify-end"
      style={{
        marginTop: groupedWordmarkTopSpacing,
        marginBottom: groupedWordmarkBottomSpacing,
      }}
    >
      <Animated.Text
        className="font-extralight tracking-tight"
        style={[
          {
            color: chrome.colors.primary,
            letterSpacing: -0.3,
            fontWeight: '200',
            ...wordmarkMetrics,
          },
          standByStyle,
        ]}
      >
        StandBy
      </Animated.Text>
      <Animated.View style={plusFlowStyle}>
        <WordmarkPlusButton onPress={scrollToTop} />
      </Animated.View>
    </View>
  );
}

export function StickyWordmarkPlus({ scrollY, scrollRef }: WordmarkScrollProps) {
  const [visible, setVisible] = useState(false);
  const scrollToTop = useScrollToTop(scrollRef);

  useAnimatedReaction(
    () => scrollY.value >= groupedWordmarkStickStart,
    (active, previous) => {
      if (active !== previous) {
        runOnJS(setVisible)(active);
      }
    },
  );

  if (!visible) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: groupedStickyPlusTopInset,
        right: groupedScreenHorizontalPad,
        zIndex: 10,
      }}
    >
      <StickyPlusGlassButton onPress={scrollToTop} />
    </View>
  );
}
