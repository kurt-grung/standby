import { Image, StyleSheet, View } from 'react-native';

import { standbyConfig } from '../config';

const splashAsset = require('../assets/splash.png');

export function SplashBrandScreen() {
  const size = standbyConfig.brand.splashImageWidth;

  return (
    <View
      style={[styles.root, { backgroundColor: standbyConfig.brand.backgroundColor }]}
      accessibilityLabel="StandBy+"
    >
      <Image
        source={splashAsset}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
