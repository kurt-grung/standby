import { useState } from 'react';
import { Platform, Text, View } from 'react-native';

import type { GlassSurfaceMode } from '../lib/webGlassSurface';
import { homePreviewGlassConfigureWidth } from '../theme/standByPreviewLayout';
import { ConfigureWidgetSegment } from './ConfigureWidgetSegment';
import { GlassIconButton } from './GlassIconButton';
import { PreviewGlassBackButton } from './PreviewGlassBackButton';
import { PreviewGlassLinkButton } from './PreviewGlassLinkButton';
import { StickyPlusGlassButton } from './StickyPlusGlassButton';
import { nightMode } from './ultra/nightColors';

type GlassButtonsShowcaseProps = {
  mutedColor: string;
  labelColor: string;
};

const configureWidgets = ['clock', 'gauge'] as const;
const configureLabels = { clock: 'Left', gauge: 'Right' } as const;

const noop = () => undefined;

function SurfaceColumn({
  title,
  surfaceMode,
  mutedColor,
}: {
  title: string;
  surfaceMode: GlassSurfaceMode;
  mutedColor: string;
}) {
  const [segmentIndex, setSegmentIndex] = useState(0);

  return (
    <View className="flex-1">
      <Text
        className="mb-3 text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: mutedColor }}
      >
        {title}
      </Text>
      <View
        className="items-center rounded-2xl px-4 py-5"
        style={{ backgroundColor: nightMode.bg, gap: 16 }}
      >
        <PreviewGlassBackButton surfaceMode={surfaceMode} onPress={noop} />
        <PreviewGlassLinkButton
          label="Configure"
          icon="square.grid.2x2"
          width={homePreviewGlassConfigureWidth}
          colorScheme="dark"
          surfaceMode={surfaceMode}
          onPress={noop}
        />
        <PreviewGlassLinkButton colorScheme="dark" surfaceMode={surfaceMode} onPress={noop} />
        <GlassIconButton
          icon="xmark"
          accessibilityLabel="Close"
          colorScheme="dark"
          surfaceMode={surfaceMode}
          onPress={noop}
        />
        <StickyPlusGlassButton surfaceMode={surfaceMode} onPress={noop} />
        <ConfigureWidgetSegment
          widgets={configureWidgets}
          labels={configureLabels}
          activeIndex={segmentIndex}
          surfaceMode={surfaceMode}
          onSelect={setSegmentIndex}
        />
      </View>
    </View>
  );
}

export function GlassButtonsShowcase({ mutedColor, labelColor }: GlassButtonsShowcaseProps) {
  const platformLabel = Platform.OS === 'web' ? 'Web' : Platform.OS === 'ios' ? 'iOS' : 'Android';

  return (
    <View className="mt-4">
      <Text className="text-sm leading-5" style={{ color: labelColor }}>
        Liquid glass on {platformLabel}; CSS blur fallback on web, outline ring on app.
      </Text>
      <View className="mt-4 flex-row" style={{ gap: 12 }}>
        <SurfaceColumn title="Web" surfaceMode="web" mutedColor={mutedColor} />
        <SurfaceColumn title="App" surfaceMode="app" mutedColor={mutedColor} />
      </View>
    </View>
  );
}
