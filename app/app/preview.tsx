import { useFocusEffect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LandscapePreviewFrame } from '../ui/LandscapePreviewFrame';
import { PreviewGlassBackButton } from '../ui/PreviewGlassBackButton';
import { StandByPreview } from '../ui/StandByPreview';
import { nightMode } from '../ui/ultra/nightColors';

const previewBg = nightMode.bg;

export default function PreviewScreen() {
  useFocusEffect(
    useCallback(() => {
      void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      return () => {
        void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, []),
  );

  return (
    <>
      <StatusBar style="light" hidden />
      <SafeAreaView className="flex-1" style={{ backgroundColor: previewBg }} edges={[]}>
        <View className="flex-1" style={{ backgroundColor: previewBg }}>
          <LandscapePreviewFrame inset={12} overlay={<PreviewGlassBackButton />}>
            <StandByPreview />
          </LandscapePreviewFrame>
        </View>
      </SafeAreaView>
    </>
  );
}
