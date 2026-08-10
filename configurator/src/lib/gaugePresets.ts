export type ConfigureWidget = 'clock' | 'gauge';

export const gaugePresets = [
  { label: 'DAY', icon: 'sun' as const },
  { label: 'ENERGY', icon: 'bolt' as const },
  { label: 'FOCUS', icon: 'scope' as const },
] as const;

export const gaugeStep = 0.05;

export function parseConfigureWidget(value: string | undefined): ConfigureWidget {
  return value === 'gauge' ? 'gauge' : 'clock';
}
