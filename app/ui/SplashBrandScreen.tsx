import { useCallback, useEffect, useRef } from 'react';
import { Image, InteractionManager, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

import { standbyConfig } from '../config';

type SplashBrandScreenProps = {
  onFinish: () => void;
};

export function SplashBrandScreen({ onFinish }: SplashBrandScreenProps) {
  const mountTime = useRef(Date.now());
  const splashReady = useRef(false);
  const finished = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opacity = useSharedValue(1);
  const splashLogoSize = standbyConfig.brand.splashImageWidth;

  const dismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 180 }, (complete) => {
      if (complete) {
        runOnJS(onFinish)();
      }
    });
  }, [onFinish, opacity]);

  const finishSplash = useCallback(() => {
    if (finished.current || !splashReady.current) {
      return;
    }

    finished.current = true;
    const remaining = Math.max(
      0,
      standbyConfig.launch.splashMinDurationMs - (Date.now() - mountTime.current),
    );
    timerRef.current = setTimeout(dismiss, remaining);
  }, [dismiss]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(finishSplash);

    return () => {
      task.cancel();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [finishSplash]);

  const onSplashReady = () => {
    if (splashReady.current) {
      return;
    }

    splashReady.current = true;
    requestAnimationFrame(() => {
      SplashScreen.hideAsync().catch(() => {});
      finishSplash();
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.root, animatedStyle, { backgroundColor: standbyConfig.brand.backgroundColor }]}
      accessibilityLabel="StandBy+"
    >
      <Image
        source={require('../assets/splash.png')}
        style={{ width: splashLogoSize, height: splashLogoSize }}
        resizeMode="contain"
        onLoad={onSplashReady}
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
