export const standbyConfig = {
  name: 'StandBy+',
  slug: 'standby',
  owner: 'kurtgrung',
  version: '1.0.0',
  scheme: 'standby',
  orientation: 'portrait' as const,
  userInterfaceStyle: 'automatic' as const,
  expo: {
    projectId: 'c112d885-1090-4f24-81fc-74ec7a64ad98',
    updatesUrl: 'https://u.expo.dev/c112d885-1090-4f24-81fc-74ec7a64ad98',
  },
  launch: {
    initialRoute: '/' as const,
    splashMinDurationMs: 700,
  },
  devClient: {
    launchMode: 'most-recent' as const,
    defaultLaunchURL: 'http://localhost:8081',
    skipOnboarding: true,
    showMenuAtLaunch: false,
    toolsButton: false,
  },
  ios: {
    bundleIdentifier: 'com.kurtgrung.standby',
    appleTeamId: '85FP2SN2JN',
    deploymentTarget: '17.0',
  },
  widgets: {
    bundleIdentifier: 'com.kurtgrung.standby.widgets',
    groupIdentifier: 'group.com.kurtgrung.standby',
  },
  layout: {
    pageTop: {
      home: 80,
      ui: 55,
      wordmarkBottom: 30,
      wordmarkStickFade: 10,
      stickyPlus: 8,
    },
    homeSceneHeight: 240,
  },
  brand: {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    plusColor: '#FF453A',
    icon: './assets/icon.png',
    adaptiveIcon: './assets/adaptive-icon.png',
    splash: './assets/splash.png',
    splashDisplay: './assets/splash-display.png',
    splashImageWidth: 280,
    splashResizeMode: 'contain' as const,
    wordmark: {
      letterWeight: 200,
      plusWeight: 300,
    },
    assets: {
      canvasSize: 1024,
      iconPointSize: 460,
      iconPlusPointSize: 382,
      iconPlusOffsetY: 40,
      splashPointSize: 165,
      splashKerning: -2,
      splashLogoMaxWidth: 710,
      iconLogoMaxScale: 0.62,
    },
    homeScenes: [
      'phone-ref-o-brutalist',
      'phone-ref-n-japanese-minimal',
      'phone-ref-a-medium-concrete',
      'phone-ref-k-red-glow',
      'phone-ref-m-tech-noir',
      'phone-ref-c-nightstand-cable',
    ] as const,
  },
} as const;

export type StandbyConfig = typeof standbyConfig;
export type HomeSceneId = (typeof standbyConfig.brand.homeScenes)[number];
