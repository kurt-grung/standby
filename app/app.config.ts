import type { ExpoConfig } from 'expo/config';

import { standbyConfig } from './config';

const config: ExpoConfig = {
  name: standbyConfig.name,
  slug: standbyConfig.slug,
  owner: standbyConfig.owner,
  version: standbyConfig.version,
  orientation: standbyConfig.orientation,
  scheme: standbyConfig.scheme,
  userInterfaceStyle: standbyConfig.userInterfaceStyle,
  icon: standbyConfig.brand.icon,
  ios: {
    supportsTablet: true,
    bundleIdentifier: standbyConfig.ios.bundleIdentifier,
    appleTeamId: standbyConfig.ios.appleTeamId,
    deploymentTarget: standbyConfig.ios.deploymentTarget,
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
      'expo-splash-screen',
      {
        image: standbyConfig.brand.splash,
        resizeMode: standbyConfig.brand.splashResizeMode,
        backgroundColor: standbyConfig.brand.backgroundColor,
        imageWidth: standbyConfig.brand.splashImageWidth,
      },
    ],
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
        bundleIdentifier: standbyConfig.widgets.bundleIdentifier,
        groupIdentifier: standbyConfig.widgets.groupIdentifier,
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
      projectId: standbyConfig.expo.projectId,
    },
  },
  updates: {
    url: standbyConfig.expo.updatesUrl,
    checkAutomatically: process.env.EAS_BUILD === 'true' ? 'ON_LOAD' : 'NEVER',
  },
};

export default config;
