import type { ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';

type LandscapePreviewFrameProps = {
  children: ReactNode;
  inset?: number;
};

export function LandscapePreviewFrame({ children, inset = 16 }: LandscapePreviewFrameProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  if (!isPortrait) {
    return <View className="flex-1">{children}</View>;
  }

  const availableWidth = width - inset * 2;
  const availableHeight = height - inset * 2;
  const scale = Math.min(availableWidth / width, availableHeight / height);

  return (
    <View className="flex-1 items-center justify-center overflow-hidden">
      <View
        style={{
          width: height,
          height: width,
          transform: [{ rotate: '90deg' }, { scale }],
        }}>
        {children}
      </View>
    </View>
  );
}
