import { Platform, Text, View } from 'react-native';

import type { GlassSurfaceMode } from '../lib/webGlassSurface';
import { homePreviewGlassConfigureWidth } from '../theme/standByPreviewLayout';
import { GlassIconButton } from './GlassIconButton';
import { PreviewGlassBackButton } from './PreviewGlassBackButton';
import { PreviewGlassLinkButton } from './PreviewGlassLinkButton';
import { StickyPlusGlassButton } from './StickyPlusGlassButton';
import { nightMode } from './ultra/nightColors';

type GlassButtonsShowcaseProps = {
  mutedColor: string;
  labelColor: string;
};

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
      </View>
    </View>
  );
}

export function GlassButtonsShowcase({ mutedColor, labelColor }: GlassButtonsShowcaseProps) {
  const showGlassColumn = Platform.OS !== 'web';
  const glassSurfaceMode: GlassSurfaceMode = 'auto';
  const flatSurfaceMode: GlassSurfaceMode = 'app';

  return (
    <View className={showGlassColumn ? 'mt-4' : undefined}>
      {showGlassColumn ? (
        <Text className="mb-4 text-sm leading-5" style={{ color: labelColor }}>
          Liquid glass vs flat fallback.
        </Text>
      ) : null}
      <View className="flex-row" style={{ gap: 12 }}>
        {showGlassColumn ? (
          <SurfaceColumn title="Glass" surfaceMode={glassSurfaceMode} mutedColor={mutedColor} />
        ) : null}
        <SurfaceColumn title="Flat" surfaceMode={flatSurfaceMode} mutedColor={mutedColor} />
      </View>
    </View>
  );
}
