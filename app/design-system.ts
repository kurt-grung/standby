import { standbyConfig } from './config';

export type PreviewBackShape = 'pill' | 'round';
export type PreviewBackOutlineShape = 'auto' | 'none' | 'pill' | 'round';

export const standbyDesignSystem = {
  brand: {
    plusColor: standbyConfig.brand.plusColor,
    wordmark: {
      size: 42,
      letterSpacing: -0.3,
      weight: standbyConfig.brand.wordmark.letterWeight,
      plusWeight: standbyConfig.brand.wordmark.plusWeight,
    },
  },
  typography: {
    screenTitle: 34,
    designSystemTitle: 28,
    body: 17,
    sectionTitle: 13,
    sectionLabel: 11,
    caption: 10,
    gaugeValue: 38,
    gaugeUnit: 18,
  },
  spacing: {
    screenHorizontal: 16,
    screenBottom: 24,
    section: 20,
    wordmarkTop: standbyConfig.layout.pageTop.home,
    wordmarkBottom: standbyConfig.layout.pageTop.wordmarkBottom,
    wordmarkStickFade: standbyConfig.layout.pageTop.wordmarkStickFade,
    stepHorizontal: 16,
    stepVertical: 14,
    stepGap: 16,
    stepBadge: 24,
    heroHorizontal: 16,
    gaugeTop: 20,
    gaugeBottomClearance: 14,
    presetRowVertical: 12,
  },
  radius: {
    groupedCard: 10,
    iconPreview: 22,
  },
  layout: {
    grouped: {
      stickyPlus: {
        size: 48,
        glassSize: 62,
        outlineInset: 10,
        topInset: standbyConfig.layout.pageTop.stickyPlus,
        hitSlop: 12,
      },
    },
    homePreview: {
      glassHeight: 38,
      glassWidth: 120,
      glassConfigureWidth: 142,
      glassInset: 12,
      glassRowGap: 4,
      glassBottomGap: 24,
      glassPaddingH: 12,
      glassGap: 4,
      glassOutlineInset: 8,
      glassIconSize: 14,
      stripPadding: 8,
      stripBleed: 16,
    },
    homeGallery: {
      autoAdvanceMs: standbyConfig.layout.homeGalleryAutoAdvanceMs,
      slideHeight: standbyConfig.layout.homeSceneHeight,
      cornerRadius: 16,
      dotSize: 5,
      dotActiveWidth: 20,
      dotGap: 5,
      indicatorTop: 10,
      fillFadeMs: 220,
    },
    standByPreview: {
      outerPad: 20,
      widgetGap: 12,
      referenceLandscape: { width: 844, height: 390 },
    },
    navigation: {
      tabBarHeight: 55,
      tabBarIconSize: 29,
      edgePadding: 21,
      glassPressOverflow: 12,
      previewBack: {
        overlayRightTune: -40,
        overlayTopTune: -10,
        glassColorScheme: 'auto' as const,
        shape: 'round' satisfies PreviewBackShape,
        outlineShape: 'auto' satisfies PreviewBackOutlineShape,
        pillWidth: 72,
        nightOutlineInset: 50,
        roundOutlineInset: 10,
        nightOutlineBorderWidth: 4,
        nightOutlineOpacity: 1,
      },
    },
  },
  widget: {
    night: {
      bg: '#000000',
      primary: '#FF453A',
      secondary: '#C23B33',
      tertiary: '#8A2E28',
      muted: '#5C221E',
      track: '#1C0C0A',
      border: '#2E1210',
      glow: 'rgba(255, 69, 58, 0.22)',
    },
  },
  themes: {
    defaultId: 'night' as const,
  },
} as const;

export type StandbyDesignSystem = typeof standbyDesignSystem;

export type ThemeId = 'night' | 'ultra' | 'mono' | 'graphite';

export type StandbyTheme = {
  id: ThemeId;
  name: string;
  description: string;
  badge: string;
  statusBar: 'light' | 'dark';
  colors: {
    bg: string;
    surface: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    accentSoft: string;
    track: string;
  };
};

export const themes: Record<ThemeId, StandbyTheme> = {
  night: {
    id: 'night',
    name: 'Night',
    description: 'StandBy night palette — monochromatic red on black',
    badge: 'Night',
    statusBar: 'light',
    colors: {
      bg: '#000000',
      surface: '#110808',
      card: '#160A0A',
      border: '#3A1512',
      primary: '#FF453A',
      secondary: '#A8423A',
      muted: '#6B2E28',
      accent: '#FF453A',
      accentSoft: 'rgba(255, 69, 58, 0.15)',
      track: '#2A1210',
    },
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra',
    description: 'Apple Watch Ultra orange on pure black',
    badge: 'Ultra',
    statusBar: 'light',
    colors: {
      bg: '#000000',
      surface: '#0D0D0D',
      card: '#141414',
      border: '#2C2C2E',
      primary: '#FFFFFF',
      secondary: '#8E8E93',
      muted: '#636366',
      accent: '#FF9F0A',
      accentSoft: 'rgba(255, 159, 10, 0.15)',
      track: '#1C1C1E',
    },
  },
  mono: {
    id: 'mono',
    name: 'Mono',
    description: 'StandBy mono — white and grey only',
    badge: 'Mono',
    statusBar: 'light',
    colors: {
      bg: '#000000',
      surface: '#0A0A0A',
      card: '#121212',
      border: '#3A3A3C',
      primary: '#FFFFFF',
      secondary: '#AEAEB2',
      muted: '#636366',
      accent: '#FFFFFF',
      accentSoft: 'rgba(255, 255, 255, 0.12)',
      track: '#1F1F1F',
    },
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite',
    description: 'Dieter Rams industrial cool grey',
    badge: 'Graphite',
    statusBar: 'light',
    colors: {
      bg: '#0A0A0B',
      surface: '#141416',
      card: '#1C1C1F',
      border: '#323236',
      primary: '#ECECEF',
      secondary: '#98989D',
      muted: '#6E6E73',
      accent: '#64D2FF',
      accentSoft: 'rgba(100, 210, 255, 0.12)',
      track: '#252528',
    },
  },
};

export const themeList = Object.values(themes);

export const defaultThemeId = standbyDesignSystem.themes.defaultId;

export type AppChrome = {
  statusBar: 'light' | 'dark';
  colors: {
    bg: string;
    surface: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    accentSoft: string;
    track: string;
  };
};

export const appChromeDark: AppChrome = {
  statusBar: 'light',
  colors: {
    bg: '#000000',
    surface: '#1C1C1E',
    card: '#1C1C1E',
    border: '#38383A',
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    muted: '#636366',
    accent: '#FFFFFF',
    accentSoft: 'rgba(255, 255, 255, 0.12)',
    track: '#3A3A3C',
  },
};

export const appChromeLight: AppChrome = {
  statusBar: 'dark',
  colors: {
    bg: '#FFFFFF',
    surface: '#F2F2F7',
    card: '#F2F2F7',
    border: '#C6C6C8',
    primary: '#000000',
    secondary: '#3C3C43',
    muted: '#8E8E93',
    accent: '#000000',
    accentSoft: 'rgba(0, 0, 0, 0.08)',
    track: '#E5E5EA',
  },
};

export function getAppChrome(
  colorScheme: 'light' | 'dark' | null | undefined | 'unspecified',
): AppChrome {
  return colorScheme === 'light' ? appChromeLight : appChromeDark;
}

export const ultraColors = {
  background: '#000000',
  primary: '#FFFFFF',
  secondary: '#8E8E93',
  accent: '#FF9F0A',
  accentGreen: '#30D158',
  accentRed: '#FF453A',
  ringTrack: '#2C2C2E',
} as const;

export const nightColors = {
  background: '#000000',
  surface: '#110808',
  card: '#160A0A',
  border: '#3A1512',
  primary: standbyDesignSystem.brand.plusColor,
  secondary: '#A8423A',
  muted: '#6B2E28',
  accent: standbyDesignSystem.brand.plusColor,
  orange: '#FF9F0A',
  track: '#2A1210',
} as const;

export function dayProgress(date: Date): number {
  const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  return seconds / 86400;
}

export function buildMinuteTimeline<T>(
  hours: number,
  propsForDate: (date: Date) => T,
): { date: Date; props: T }[] {
  const start = new Date();
  start.setSeconds(0, 0);
  const entries: { date: Date; props: T }[] = [];

  for (let minute = 0; minute < hours * 60; minute += 1) {
    const date = new Date(start.getTime() + minute * 60_000);
    entries.push({ date, props: propsForDate(date) });
  }

  return entries;
}

export function formatNightTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const ds = standbyDesignSystem;

export const groupedScreenHorizontalPad = ds.spacing.screenHorizontal;
export const groupedScreenBottomInset = ds.spacing.screenBottom;
export const groupedWordmarkTopSpacing = ds.spacing.wordmarkTop;
export const groupedHomeWordmarkTopSpacing = standbyConfig.layout.pageTop.home;
export const groupedUiWordmarkTopSpacing = standbyConfig.layout.pageTop.ui;
export const groupedWordmarkBottomSpacing = ds.spacing.wordmarkBottom;
export const groupedWordmarkSize = ds.brand.wordmark.size;
export const groupedWordmarkStickStart = ds.spacing.wordmarkTop;
export const groupedWordmarkStickFadeLength = ds.spacing.wordmarkStickFade;
export const groupedStickyPlusSize = ds.layout.grouped.stickyPlus.size;
export const groupedStickyPlusGlassSize = ds.layout.grouped.stickyPlus.glassSize;
export const groupedStickyPlusOutlineInset = ds.layout.grouped.stickyPlus.outlineInset;
export const groupedStickyPlusTopInset = ds.layout.grouped.stickyPlus.topInset;
export const groupedStickyPlusHitSlop = ds.layout.grouped.stickyPlus.hitSlop;
export const groupedGaugeTopPadding = ds.spacing.gaugeTop;
export const groupedGaugeBottomClearance = ds.spacing.gaugeBottomClearance;
export const groupedStepHorizontalPad = ds.spacing.stepHorizontal;
export const groupedStepBadgeSize = ds.spacing.stepBadge;
export const groupedStepGap = ds.spacing.stepGap;
export const groupedStepDividerInset =
  ds.spacing.stepHorizontal + ds.spacing.stepBadge + ds.spacing.stepGap;

export const groupedScreenPadding = 'px-4';
export const groupedSectionSpacing = 'mb-5';
export const groupedHeroInset = 'items-center px-4 pb-0';
export const groupedPresetRowInset = 'py-3';

export const standByOuterPad = ds.layout.standByPreview.outerPad;
export const standByWidgetGap = ds.layout.standByPreview.widgetGap;
export const homeWidgetStripPadding = ds.layout.homePreview.stripPadding;
export const homeWidgetStripBleed = ds.layout.homePreview.stripBleed;
export const homePreviewGlassHeight = ds.layout.homePreview.glassHeight;
export const homePreviewGlassWidth = ds.layout.homePreview.glassWidth;
export const homePreviewGlassConfigureWidth = ds.layout.homePreview.glassConfigureWidth;
export const homePreviewGlassInset = ds.layout.homePreview.glassInset;
export const homePreviewGlassRowGap = ds.layout.homePreview.glassRowGap;
export const homePreviewGlassBottomGap = ds.layout.homePreview.glassBottomGap;
export const homePreviewGlassPaddingH = ds.layout.homePreview.glassPaddingH;
export const homePreviewGlassGap = ds.layout.homePreview.glassGap;
export const homePreviewGlassIconSize = ds.layout.homePreview.glassIconSize;
export const homePreviewGlassOutlineInset = ds.layout.homePreview.glassOutlineInset;

export const homeGalleryAutoAdvanceMs = ds.layout.homeGallery.autoAdvanceMs;
export const homeGallerySlideHeight = ds.layout.homeGallery.slideHeight;
export const homeGalleryCornerRadius = ds.layout.homeGallery.cornerRadius;
export const homeGalleryDotSize = ds.layout.homeGallery.dotSize;
export const homeGalleryDotActiveWidth = ds.layout.homeGallery.dotActiveWidth;
export const homeGalleryDotGap = ds.layout.homeGallery.dotGap;
export const homeGalleryIndicatorTop = ds.layout.homeGallery.indicatorTop;
export const homeGalleryFillFadeMs = ds.layout.homeGallery.fillFadeMs;

export const nativeTabBarHeight = ds.layout.navigation.tabBarHeight;
export const nativeTabBarIconSize = ds.layout.navigation.tabBarIconSize;
export const nativeTabBarEdgePadding = ds.layout.navigation.edgePadding;
export const glassPressOverflow = ds.layout.navigation.glassPressOverflow;
export const previewBackOverlayRightTune = ds.layout.navigation.previewBack.overlayRightTune;
export const previewBackOverlayTopTune = ds.layout.navigation.previewBack.overlayTopTune;
export const previewBackGlassColorScheme = ds.layout.navigation.previewBack.glassColorScheme;
export const previewBackShape = ds.layout.navigation.previewBack.shape;
export const previewBackOutlineShape = ds.layout.navigation.previewBack.outlineShape;
export const previewBackPillWidth = ds.layout.navigation.previewBack.pillWidth;
export const previewBackNightOutlineInset = ds.layout.navigation.previewBack.nightOutlineInset;
export const previewBackRoundOutlineInset = ds.layout.navigation.previewBack.roundOutlineInset;
export const previewBackNightOutlineBorderWidth =
  ds.layout.navigation.previewBack.nightOutlineBorderWidth;
export const previewBackNightOutlineOpacity = ds.layout.navigation.previewBack.nightOutlineOpacity;

export const previewBackOverlayTop = nativeTabBarEdgePadding - glassPressOverflow;
export const previewBackOverlayRight = nativeTabBarEdgePadding - glassPressOverflow;
export const previewBackOverlayPressPaddingTop = glassPressOverflow;
export const previewBackOverlayPressPaddingRight = glassPressOverflow;
export const previewBackPillHeight = nativeTabBarHeight;
export const previewBackPillRadius = previewBackPillHeight / 2;
export const previewBackRoundSize = nativeTabBarHeight;
export const previewBackRoundRadius = previewBackRoundSize / 2;

export function standByWidgetSize(landscapeWidth: number, landscapeHeight: number) {
  if (landscapeWidth <= 0 || landscapeHeight <= 0) return 0;
  const maxByHeight = landscapeHeight - standByOuterPad * 2;
  const maxByWidth = (landscapeWidth - standByOuterPad * 2 - standByWidgetGap) / 2;
  return Math.floor(Math.min(maxByHeight, maxByWidth));
}

const homeWidgetReferenceLandscape = ds.layout.standByPreview.referenceLandscape;

export const homeWidgetReferenceSize = standByWidgetSize(
  homeWidgetReferenceLandscape.width,
  homeWidgetReferenceLandscape.height,
);

export function homeWidgetPairWidth(widgetSize: number) {
  return widgetSize * 2 + standByWidgetGap;
}

export function homeWidgetDisplaySize(containerWidth: number) {
  if (containerWidth <= 0) return 0;
  const innerWidth = containerWidth - homeWidgetStripPadding * 2;
  return Math.floor((innerWidth - standByWidgetGap) / 2);
}

export function homeWidgetStripHeight(containerWidth: number) {
  const displaySize = homeWidgetDisplaySize(containerWidth);
  if (displaySize <= 0) return homeWidgetStripPadding * 2;
  return displaySize + homeWidgetStripPadding * 2;
}

export function homeWidgetPreviewScale(displaySize: number) {
  if (displaySize <= 0 || homeWidgetReferenceSize <= 0) return 1;
  return displaySize / homeWidgetReferenceSize;
}

export const nightMode = standbyDesignSystem.widget.night;
