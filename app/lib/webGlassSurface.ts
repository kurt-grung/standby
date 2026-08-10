import { Platform, type ViewStyle } from 'react-native';

export type GlassSurfaceMode = 'auto' | 'web' | 'app';

export const isWebGlassSurface = Platform.OS === 'web';

export function resolveWebGlassSurface(mode: GlassSurfaceMode = 'auto'): boolean {
  if (mode === 'web') return true;
  if (mode === 'app') return false;
  return Platform.OS === 'web';
}

export const webGlassDarkSurface: ViewStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.14)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.22)',
  ...(Platform.OS === 'web'
    ? ({
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
      } as ViewStyle)
    : {}),
};

export const webGlassLightSurface: ViewStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.72)',
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.08)',
  ...(Platform.OS === 'web'
    ? ({
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
      } as ViewStyle)
    : {}),
};

export const appFallbackGlassFill: ViewStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.14)',
  borderWidth: 0,
};

export const appFallbackGlassBordered: ViewStyle = {
  ...appFallbackGlassFill,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.22)',
};
