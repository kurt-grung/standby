import type { AppearanceMode } from '../design-system';

export type { AppearanceMode } from '../design-system';

export const appearanceOptions: readonly { id: AppearanceMode; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
] as const;
