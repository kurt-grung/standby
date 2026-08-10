import { DynamicColorIOS, Platform, type ColorValue } from 'react-native';

export function dynamicSystemColor(colors: { dark: string; light: string }): ColorValue {
  if (Platform.OS === 'ios') {
    return DynamicColorIOS(colors);
  }
  return colors.dark;
}
