import type { ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { nightMode } from './ultra/nightColors';

type LandscapePreviewFrameProps = {
  children: ReactNode;
  inset?: number;
};

const previewBg = nightMode.bg;

export function LandscapePreviewFrame({ children, inset = 16 }: LandscapePreviewFrameProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  if (!isPortrait) {
    return (
      <View className="flex-1" style={{ backgroundColor: previewBg }}>
        {children}
      </View>
    );
  }

  const landscapeWidth = height;
  const landscapeHeight = width;
  const availableWidth = width - inset * 2;
  const availableHeight = height - inset * 2;
  const scale = Math.min(availableWidth / width, availableHeight / height);
  const frameWidth = width * scale;
  const frameHeight = height * scale;

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: previewBg }}>
      <View
        style={{
          width: frameWidth,
          height: frameHeight,
          overflow: 'hidden',
        }}>
        <View
          style={{
            position: 'absolute',
            width: landscapeWidth,
            height: landscapeHeight,
            left: frameWidth / 2 - landscapeWidth / 2,
            top: frameHeight / 2 - landscapeHeight / 2,
            transform: [{ rotate: '90deg' }, { scale }],
          }}>
          {children}
        </View>
      </View>
    </View>
  );
}
