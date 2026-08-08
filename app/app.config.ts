import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'StandBy+',
  slug: 'standby',
  owner: 'kurtgrung',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'standby',
  userInterfaceStyle: 'dark',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.kurtgrung.standby',
    appleTeamId: '85FP2SN2JN',
    deploymentTarget: '17.0',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  web: {
    bundler: 'metro',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  plugins: [
    'expo-router',
    [
      'expo-dev-client',
      {
        launchMode: 'most-recent',
        defaultLaunchURL: 'http://localhost:8081',
        skipOnboarding: true,
        showMenuAtLaunch: false,
        ios: {
          defaultLaunchURL: 'http://localhost:8081',
        },
      },
    ],
    [
      'expo-screen-orientation',
      {
        initialOrientation: 'PORTRAIT_UP',
      },
    ],
    [
      'expo-widgets',
      {
        bundleIdentifier: 'com.kurtgrung.standby.widgets',
        groupIdentifier: 'group.com.kurtgrung.standby',
        widgets: [
          {
            name: 'UltraClockWidget',
            contentMarginsDisabled: true,
            displayName: 'Ultra Clock',
            description: 'Left StandBy column — live clock with day ring (Small)',
            supportedFamilies: ['systemSmall', 'systemMedium', 'systemLarge'],
          },
          {
            name: 'UltraGaugeWidget',
            contentMarginsDisabled: true,
            displayName: 'Ultra Gauge',
            description: 'Right StandBy column — Ultra gauge with live value (Small)',
            supportedFamilies: ['systemSmall', 'systemMedium', 'systemLarge'],
          },
        ],
      },
    ],
    'expo-asset',
  ],
  extra: {
    eas: {
      projectId: 'c112d885-1090-4f24-81fc-74ec7a64ad98',
    },
  },
  updates: {
    url: 'https://u.expo.dev/c112d885-1090-4f24-81fc-74ec7a64ad98',
  },
};

export default config;
