import { Pressable } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { groupedStickyPlusHitSlop, groupedWordmarkSize } from '../theme/groupedLayout';
import { nightMode } from './ultra/nightColors';

const pressScale = 0.92;

type WordmarkPlusButtonProps = {
  onPress: () => void;
};

export function WordmarkPlusButton({ onPress }: WordmarkPlusButtonProps) {
  const pressed = useSharedValue(0);

  const shellStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, pressScale], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <Animated.View style={shellStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Expand header"
        hitSlop={groupedStickyPlusHitSlop}
        onPress={onPress}
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: 90 });
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, { duration: 140 });
        }}
      >
        <Animated.Text
          style={{
            color: nightMode.primary,
            fontSize: groupedWordmarkSize,
            lineHeight: groupedWordmarkSize + 2,
            fontWeight: '300',
          }}
        >
          +
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}
