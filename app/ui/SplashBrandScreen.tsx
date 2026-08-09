import { StyleSheet, View } from 'react-native';

import { standbyConfig } from '../config';
import { standbyDesignSystem } from '../design-system';
import { StandByWordmark } from './StandByWordmark';

export function SplashBrandScreen() {
  return (
    <View
      style={[styles.root, { backgroundColor: standbyConfig.brand.backgroundColor }]}
      accessibilityLabel="StandBy+"
    >
      <StandByWordmark
        align="center"
        size={standbyDesignSystem.brand.wordmark.splashDisplaySize}
        primaryColor={standbyConfig.brand.textColor}
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
