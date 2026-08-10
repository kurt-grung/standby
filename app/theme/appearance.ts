import type { AppearanceMode } from '../design-system';
import type { SFSymbol } from 'sf-symbols-typescript';
import type { ColorSchemeName } from 'react-native';

export type { AppearanceMode } from '../design-system';

export type ColorScheme = 'light' | 'dark';

export function resolveEffectiveColorScheme(
  mode: AppearanceMode,
  systemScheme: ColorSchemeName | null | undefined,
): ColorScheme {
  if (mode === 'system') {
    return systemScheme === 'light' ? 'light' : 'dark';
  }

  return mode;
}

export const appearanceOptions: readonly {
  id: AppearanceMode;
  label: string;
  icon: SFSymbol;
}[] = [
  { id: 'system', label: 'System', icon: 'circle.lefthalf.filled' },
  { id: 'light', label: 'Light', icon: 'sun.max.fill' },
  { id: 'dark', label: 'Dark', icon: 'moon.fill' },
] as const;
