import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

import { splashBrand } from '../lib/splashBrand';
import { standbyConfig } from '../config';
import { useBeginHomeReveal } from '../theme/SplashGate';

type SplashBrandScreenProps = {
  onFinish: () => void;
};

export function SplashBrandScreen({ onFinish }: SplashBrandScreenProps) {
  const mountTime = useRef(Date.now());
  const finished = useRef(false);
  const finishedCallback = useRef(false);
  const scheduled = useRef(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [touchBlocked, setTouchBlocked] = useState(true);
  const opacity = useSharedValue(1);
  const beginHomeReveal = useBeginHomeReveal();
  const { splashMinDurationMs, splashFadeDurationMs } = standbyConfig.launch;
  const maxSplashWaitMs = splashMinDurationMs + splashFadeDurationMs + 1200;

  const complete = useCallback(() => {
    if (finishedCallback.current) {
      return;
    }

    finishedCallback.current = true;
    onFinish();
  }, [onFinish]);

  const dismiss = useCallback(() => {
    if (finished.current) {
      return;
    }

    finished.current = true;
    setTouchBlocked(false);
    beginHomeReveal();
    opacity.value = withTiming(
      0,
      {
        duration: splashFadeDurationMs,
        easing: Easing.out(Easing.quad),
      },
      (completeAnimation) => {
        if (completeAnimation) {
          runOnJS(complete)();
        }
      },
    );

    finishTimerRef.current = setTimeout(() => {
      complete();
    }, splashFadeDurationMs + 120);
  }, [beginHomeReveal, complete, opacity, splashFadeDurationMs]);

  const scheduleDismiss = useCallback(() => {
    if (finished.current || scheduled.current) {
      return;
    }

    scheduled.current = true;
    SplashScreen.hideAsync().catch(() => {});

    const remaining = Math.max(0, splashMinDurationMs - (Date.now() - mountTime.current));
    dismissTimerRef.current = setTimeout(dismiss, remaining);
  }, [dismiss, splashMinDurationMs]);

  useEffect(() => {
    scheduleDismiss();
    maxWaitTimerRef.current = setTimeout(dismiss, maxSplashWaitMs);

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      if (maxWaitTimerRef.current) {
        clearTimeout(maxWaitTimerRef.current);
      }
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
      }
    };
  }, [dismiss, maxSplashWaitMs, scheduleDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents={touchBlocked ? 'auto' : 'none'}
      style={[styles.root, animatedStyle, { backgroundColor: splashBrand.backgroundColor }]}
      accessibilityLabel="StandBy+"
    >
      <Image
        source={splashBrand.imageSource}
        style={{ width: splashBrand.imageWidth, height: splashBrand.imageWidth }}
        resizeMode={splashBrand.resizeMode}
        onLoad={scheduleDismiss}
        onLoadEnd={scheduleDismiss}
        onError={scheduleDismiss}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
