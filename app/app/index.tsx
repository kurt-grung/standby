import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { LandscapePreviewFrame } from '../components/LandscapePreviewFrame';
import { NavIconLink } from '../components/NavIconLink';
import { StandByPreview } from '../components/StandByPreview';
import { useAppChrome } from '../theme/useAppChrome';

export default function PreviewScreen() {
  const insets = useSafeAreaInsets();
  const chrome = useAppChrome();

  useEffect(() => {
    void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    return () => {
      void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <>
      <StatusBar style={chrome.statusBar} hidden />
      <SafeAreaView className="flex-1" style={{ backgroundColor: chrome.colors.bg }} edges={[]}>
        <View className="flex-1" style={{ backgroundColor: chrome.colors.bg }}>
          <LandscapePreviewFrame inset={12}>
            <StandByPreview />
          </LandscapePreviewFrame>
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              right: 18,
              top: insets.top + 26,
              zIndex: 10,
            }}>
            <NavIconLink href="/home" icon="home" accessibilityLabel="Home" />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
