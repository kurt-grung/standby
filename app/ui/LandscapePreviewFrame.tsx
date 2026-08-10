import type { ReactNode } from 'react';
import { useState } from 'react';
import { Platform, View, type LayoutChangeEvent } from 'react-native';

import { webPhoneWidth } from '../design-system';
import {
  glassPressOverflow,
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

type RotatedLayerProps = {
  landscapeWidth: number;
  landscapeHeight: number;
  frameWidth: number;
  frameHeight: number;
  scale: number;
  children: ReactNode;
};

function rotatedLayerStyle({
  landscapeWidth,
  landscapeHeight,
  frameWidth,
  frameHeight,
  scale,
}: Omit<RotatedLayerProps, 'children'>) {
  return {
    position: 'absolute' as const,
    width: landscapeWidth,
    height: landscapeHeight,
    left: frameWidth / 2 - landscapeWidth / 2,
    top: frameHeight / 2 - landscapeHeight / 2,
    transform: [{ rotate: '90deg' as const }, { scale }],
  };
}

function LandscapeTopRightOverlay({ children }: { children: ReactNode }) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        right: previewBackOverlayRight + previewBackOverlayRightTune,
        top: previewBackOverlayTop + previewBackOverlayTopTune,
        zIndex: 10,
        alignItems: 'flex-end',
        overflow: 'visible',
        paddingRight: previewBackOverlayPressPaddingRight,
        paddingTop: previewBackOverlayPressPaddingTop,
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
  const isPortrait = height >= width;

  return (
    <View className="flex-1" style={{ backgroundColor: previewBg }} onLayout={onLayout}>
      {width <= 0 || height <= 0 ? null : isPortrait ? (
        <PortraitLandscapePreview width={width} height={height} inset={inset} overlay={overlay}>
          {children}
        </PortraitLandscapePreview>
      ) : (
        <View className="flex-1 overflow-visible" style={{ backgroundColor: previewBg }}>
          {children}
          {overlay ? <LandscapeTopRightOverlay>{overlay}</LandscapeTopRightOverlay> : null}
        </View>
      )}
    </View>
  );
}

type PortraitLandscapePreviewProps = {
  width: number;
  height: number;
  inset: number;
  overlay?: ReactNode;
  children: ReactNode;
};

function PortraitLandscapePreview({
  width,
  height,
  inset,
  overlay,
  children,
}: PortraitLandscapePreviewProps) {
  const landscapeWidth = height;
  const landscapeHeight = width;
  const availableWidth = width - inset * 2;
  const availableHeight = height - inset * 2;
  const scale = Math.min(availableWidth / width, availableHeight / height);
  const frameWidth = width * scale;
  const frameHeight = height * scale;
  const layer = { landscapeWidth, landscapeHeight, frameWidth, frameHeight, scale };

  return (
    <View
      className="flex-1 items-center justify-center overflow-visible"
      style={{ backgroundColor: previewBg }}
    >
      <View style={{ width: frameWidth, height: frameHeight, overflow: 'visible' }}>
        <View style={{ width: frameWidth, height: frameHeight, overflow: 'hidden' }}>
          <View style={rotatedLayerStyle(layer)}>{children}</View>
        </View>
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: -glassPressOverflow,
            top: -glassPressOverflow,
            right: -glassPressOverflow,
            bottom: -glassPressOverflow,
            overflow: 'visible',
            zIndex: 10,
          }}
        >
          <View
            pointerEvents="box-none"
            style={{ ...rotatedLayerStyle(layer), overflow: 'visible' }}
          >
            {overlay ? <LandscapeTopRightOverlay>{overlay}</LandscapeTopRightOverlay> : null}
          </View>
        </View>
      </View>
    </View>
  );
}
