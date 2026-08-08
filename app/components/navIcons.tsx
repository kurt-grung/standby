import Display from 'geist-native-icons/Display';
import Grid from 'geist-native-icons/Grid';
import Home from 'geist-native-icons/Home';
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

export type NavIconName = 'home' | 'preview' | 'ui';

type NavIconComponent = ComponentType<SvgProps & { size?: number | string }>;

export const navIcons: Record<NavIconName, NavIconComponent> = {
  home: Home,
  preview: Display,
  ui: Grid,
};
