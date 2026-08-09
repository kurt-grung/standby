import type { ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { nightMode } from './ultra/nightColors';

type LandscapePreviewFrameProps = {
  children: ReactNode;
  inset?: number;
  overlay?: ReactNode;
};

const previewBg = nightMode.bg;
const OVERLAY_INSET = 0;
const OVERLAY_TOP = 23;

function LandscapeTopRightOverlay({ children }: { children: ReactNode }) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        right: OVERLAY_INSET,
        top: OVERLAY_TOP,
        zIndex: 10,
        alignItems: 'flex-end',
      }}
    >
      {children}
    </View>
  );
}

export function LandscapePreviewFrame({
  children,
  inset = 16,
  overlay,
}: LandscapePreviewFrameProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  if (!isPortrait) {
    return (
      <View className="flex-1" style={{ backgroundColor: previewBg }}>
        {children}
        {overlay ? <LandscapeTopRightOverlay>{overlay}</LandscapeTopRightOverlay> : null}
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
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: landscapeWidth,
            height: landscapeHeight,
            left: frameWidth / 2 - landscapeWidth / 2,
            top: frameHeight / 2 - landscapeHeight / 2,
            transform: [{ rotate: '90deg' }, { scale }],
          }}
        >
          {children}
          {overlay ? <LandscapeTopRightOverlay>{overlay}</LandscapeTopRightOverlay> : null}
        </View>
      </View>
    </View>
  );
}
