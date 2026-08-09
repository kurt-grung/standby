import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LandscapePreviewFrame } from '../components/LandscapePreviewFrame';
import { StandByPreview } from '../components/StandByPreview';
import { nightMode } from '../components/ultra/nightColors';

const previewBg = nightMode.bg;

export default function PreviewScreen() {
  useEffect(() => {
    void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    return () => {
      void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <>
      <StatusBar style="light" hidden />
      <SafeAreaView className="flex-1" style={{ backgroundColor: previewBg }} edges={[]}>
        <View className="flex-1" style={{ backgroundColor: previewBg }}>
          <LandscapePreviewFrame inset={12}>
            <StandByPreview />
          </LandscapePreviewFrame>
        </View>
      </SafeAreaView>
    </>
  );
}
