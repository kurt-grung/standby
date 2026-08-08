import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { LandscapePreviewFrame } from '../components/LandscapePreviewFrame';
import { NavLink } from '../components/NavLink';
import { StandByPreview } from '../components/StandByPreview';
import { useTheme } from '../theme/ThemeContext';

export default function PreviewScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    return () => {
      void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <>
      <StatusBar style={theme.statusBar} hidden />
      <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={[]}>
        <View className="flex-1">
          <LandscapePreviewFrame inset={12}>
            <StandByPreview />
          </LandscapePreviewFrame>
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              right: 0,
              top: insets.top + 16,
              zIndex: 10,
            }}>
            <NavLink href="/home" label="Home" />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
