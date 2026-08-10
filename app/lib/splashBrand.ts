import type { ImageResizeMode } from 'react-native';

import { standbyConfig } from '../config';

const { brand } = standbyConfig;

export const splashBrand = {
  backgroundColor: brand.backgroundColor,
  imageWidth: brand.splashImageWidth,
  resizeMode: brand.splashResizeMode as ImageResizeMode,
  imageSource: require('../assets/splash-display.png'),
} as const;
