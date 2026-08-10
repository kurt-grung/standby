import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import type Animated from 'react-native-reanimated';
import { runOnUI, scrollTo, type AnimatedRef, type SharedValue } from 'react-native-reanimated';

export function useResetScrollOnFocus(reset: () => void) {
  useFocusEffect(
    useCallback(() => {
      reset();
    }, [reset]),
  );
}

export function useResetAnimatedScrollOnFocus(
  scrollRef: AnimatedRef<Animated.ScrollView>,
  scrollOffset?: SharedValue<number>,
) {
  const reset = useCallback(() => {
    if (scrollOffset) {
      scrollOffset.value = 0;
    }

    runOnUI(() => {
      scrollTo(scrollRef, 0, 0, false);
    })();
  }, [scrollOffset, scrollRef]);

  useResetScrollOnFocus(reset);
}
