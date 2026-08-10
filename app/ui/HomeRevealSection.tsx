import type { ReactNode } from 'react';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { standbyConfig } from '../config';
import { useHomeRevealProgress } from '../theme/SplashGate';

type HomeRevealSectionProps = {
  children: ReactNode;
  step?: number;
};

export function HomeRevealSection({ children, step = 0 }: HomeRevealSectionProps) {
  const reveal = useHomeRevealProgress();
  const { homeRevealDurationMs, homeRevealStaggerMs } = standbyConfig.launch;
  const delay = (step * homeRevealStaggerMs) / homeRevealDurationMs;

  const animatedStyle = useAnimatedStyle(() => {
    const start = delay;
    const end = Math.min(1, start + 0.72);

    return {
      opacity: interpolate(reveal.value, [start, end], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(reveal.value, [start, end], [18, 0], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
