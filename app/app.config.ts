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
        image: standbyConfig.brand.splashDisplay,
        resizeMode: standbyConfig.brand.splashResizeMode,
        backgroundColor: standbyConfig.brand.backgroundColor,
        imageWidth: standbyConfig.brand.splashImageWidth,
      },
    ],
    [
      'expo-dev-client',
      {
        launchMode: standbyConfig.devClient.launchMode,
        defaultLaunchURL: standbyConfig.devClient.defaultLaunchURL,
        skipOnboarding: standbyConfig.devClient.skipOnboarding,
        showMenuAtLaunch: standbyConfig.devClient.showMenuAtLaunch,
        toolsButton: standbyConfig.devClient.toolsButton,
        ios: {
          defaultLaunchURL: standbyConfig.devClient.defaultLaunchURL,
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
        widgets: standbyConfig.widgets.catalog.map((widget) => ({
          name: widget.name,
          contentMarginsDisabled: widget.contentMarginsDisabled,
          displayName: widget.displayName,
          description: widget.description,
          supportedFamilies: [...widget.supportedFamilies],
        })),
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
