import type { ReactNode } from 'react';
import { useState } from 'react';
import { Platform, View, type LayoutChangeEvent } from 'react-native';

import { webPhoneWidth } from '../design-system';
import { useStandbySafeAreaInsets } from '../hooks/useStandbySafeAreaInsets';
import {
  nativeTabBarEdgePadding,
  previewBackOverlayPortraitTopTune,
  previewBackOverlayPressPaddingRight,
  previewBackOverlayPressPaddingTop,
  previewBackOverlayRight,
  previewBackOverlayRightTune,
  previewBackOverlayTop,
  previewBackOverlayTopTune,
} from '../theme/nativeTabBarMetrics';
import { nightMode } from './ultra/nightColors';

type LandscapePreviewFrameProps = {
  children: ReactNode;
  inset?: number;
  overlay?: ReactNode;
};

const previewBg = nightMode.bg;

function PreviewBackOverlay({ children, portrait }: { children: ReactNode; portrait: boolean }) {
  const insets = useStandbySafeAreaInsets();

  if (Platform.OS === 'web') {
    const edgeTop = Math.max(nativeTabBarEdgePadding, insets.top);
    const edgeRight = Math.max(nativeTabBarEdgePadding, insets.right);

    return (
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: edgeTop,
          right: edgeRight,
          zIndex: 10,
          alignItems: 'flex-end',
          overflow: 'visible',
        }}
      >
        {children}
      </View>
    );
  }

  const edgeTop =
    previewBackOverlayTop +
    previewBackOverlayTopTune +
    (portrait ? previewBackOverlayPortraitTopTune : 0);
  const edgeRight = previewBackOverlayRight + previewBackOverlayRightTune;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: edgeTop,
        right: edgeRight,
        paddingTop: previewBackOverlayPressPaddingTop,
        paddingRight: previewBackOverlayPressPaddingRight,
        zIndex: 10,
        alignItems: 'flex-end',
        overflow: 'visible',
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
  const [container, setContainer] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    let { width, height } = event.nativeEvent.layout;
    if (Platform.OS === 'web') {
      width = Math.min(width, webPhoneWidth);
    }
    setContainer((current) =>
      current.width === width && current.height === height ? current : { width, height },
    );
  };

  const { width, height } = container;
  const portrait = height >= width;

  return (
    <View className="flex-1" style={{ backgroundColor: previewBg }} onLayout={onLayout}>
      {width > 0 && height > 0 ? (
        <View
          className="flex-1 overflow-visible"
          style={{ position: 'relative', backgroundColor: previewBg }}
        >
          <View className="flex-1" style={{ padding: inset }}>
            {children}
          </View>
          {overlay ? <PreviewBackOverlay portrait={portrait}>{overlay}</PreviewBackOverlay> : null}
        </View>
      ) : null}
    </View>
  );
}
