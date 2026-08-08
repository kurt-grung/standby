import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavLink } from '../components/NavLink';
import { LandscapePreviewFrame } from '../components/LandscapePreviewFrame';
import { StandByPreview } from '../components/StandByPreview';
import { useTheme } from '../theme/ThemeContext';

export default function PreviewScreen() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.statusBar} hidden />
      <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }} edges={['top', 'left', 'right', 'bottom']}>
        <View className="absolute right-4 top-3 z-10">
          <NavLink href="/home" label="Home" />
        </View>
        <View className="flex-1 px-2 py-2">
          <LandscapePreviewFrame inset={12}>
            <StandByPreview />
          </LandscapePreviewFrame>
        </View>
      </SafeAreaView>
    </>
  );
}
