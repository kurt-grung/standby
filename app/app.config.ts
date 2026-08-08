import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Standby',
  slug: 'standby',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'standby',
  userInterfaceStyle: 'dark',
  icon: './assets/icon.png',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.standby.app',
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
    'expo-dev-client',
    [
      'expo-widgets',
      {
        bundleIdentifier: 'com.standby.app.widgets',
        groupIdentifier: 'group.com.standby.app',
        widgets: [
          {
            name: 'UltraClockWidget',
            contentMarginsDisabled: true,
            displayName: 'Ultra Clock',
            description: 'Apple Watch Ultra-style night clock for StandBy mode',
            supportedFamilies: ['systemSmall', 'systemMedium', 'systemLarge'],
          },
          {
            name: 'UltraGaugeWidget',
            contentMarginsDisabled: true,
            displayName: 'Ultra Gauge',
            description: 'Circular Ultra-style gauge for StandBy mode',
            supportedFamilies: ['systemSmall', 'systemMedium', 'systemLarge'],
          },
        ],
      },
    ],
    'expo-asset',
  ],
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  updates: process.env.EAS_PROJECT_ID
    ? { url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}` }
    : undefined,
};

export default config;
