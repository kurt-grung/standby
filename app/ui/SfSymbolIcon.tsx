import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import Activity from 'geist-native-icons/Activity';
import Battery from 'geist-native-icons/Battery';
import Calendar from 'geist-native-icons/Calendar';
import Check from 'geist-native-icons/Check';
import ChevronLeft from 'geist-native-icons/ChevronLeft';
import ChevronRight from 'geist-native-icons/ChevronRight';
import Minus from 'geist-native-icons/Minus';
import Grid from 'geist-native-icons/Grid';
import Home from 'geist-native-icons/Home';
import Play from 'geist-native-icons/Play';
import PlayFill from 'geist-native-icons/PlayFill';
import Plus from 'geist-native-icons/Plus';
import Sun from 'geist-native-icons/Sun';
import Sunset from 'geist-native-icons/Sunset';
import Thermometer from 'geist-native-icons/Thermometer';
import X from 'geist-native-icons/X';
import type { ComponentType } from 'react';
import { Platform } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import type { SFSymbol } from 'sf-symbols-typescript';

type GeistIcon = ComponentType<SvgProps & { size?: number | string }>;

const webSymbolIcons: Partial<Record<SFSymbol, GeistIcon>> = {
  xmark: X,
  plus: Plus,
  minus: Minus,
  checkmark: Check,
  'chevron.left': ChevronLeft,
  'chevron.right': ChevronRight,
  house: Home,
  'house.fill': Home,
  'play.rectangle': Play,
  'play.rectangle.fill': PlayFill,
  'square.grid.2x2': Grid,
  'square.grid.2x2.fill': Grid,
  'thermometer.medium': Thermometer,
  calendar: Calendar,
  'battery.100': Battery,
  'sunset.fill': Sunset,
  'sun.max.fill': Sun,
  waveform: Activity,
  'figure.run': Activity,
};

type SfSymbolIconProps = Pick<SymbolViewProps, 'name' | 'size' | 'tintColor' | 'weight' | 'style'>;

export function SfSymbolIcon({ name, size = 24, tintColor, weight, style }: SfSymbolIconProps) {
  if (Platform.OS === 'web' && typeof name === 'string') {
    const WebIcon = webSymbolIcons[name];

    if (!WebIcon) {
      return null;
    }

    return <WebIcon size={size} stroke={tintColor ?? '#FFFFFF'} strokeWidth={2.5} style={style} />;
  }

  return <SymbolView name={name} size={size} tintColor={tintColor} weight={weight} style={style} />;
}
