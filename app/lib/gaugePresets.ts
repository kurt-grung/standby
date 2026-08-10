import type { UltraGaugeWidgetProps } from '../widgets/UltraGaugeWidget';

export const gaugePresets = [
  { label: 'DAY', icon: 'sun.max.fill' },
  { label: 'ENERGY', icon: 'bolt.fill' },
  { label: 'FOCUS', icon: 'scope' },
] as const satisfies readonly Pick<UltraGaugeWidgetProps, 'label' | 'icon'>[];

export const gaugeStep = 0.05;

export type ConfigureWidget = 'clock' | 'gauge';

export function parseConfigureWidget(value: string | undefined): ConfigureWidget {
  return value === 'gauge' ? 'gauge' : 'clock';
}
