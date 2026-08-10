import type { AppearanceMode } from '../design-system';
import type { SFSymbol } from 'sf-symbols-typescript';

export type { AppearanceMode } from '../design-system';

export const appearanceOptions: readonly {
  id: AppearanceMode;
  label: string;
  icon: SFSymbol;
}[] = [
  { id: 'light', label: 'Light', icon: 'sun.max.fill' },
  { id: 'dark', label: 'Dark', icon: 'moon.fill' },
] as const;
