import { dayProgress } from '../theme/ultra';
import UltraClockWidget from '../widgets/UltraClockWidget';
import UltraGaugeWidget, { type UltraGaugeWidgetProps } from '../widgets/UltraGaugeWidget';

const defaultGaugePreset = {
  label: 'DAY',
  icon: 'sun.max.fill',
} as const satisfies Pick<UltraGaugeWidgetProps, 'label' | 'icon'>;

export function refreshStandbyWidgets(
  gaugeValue = 0,
  preset: Pick<UltraGaugeWidgetProps, 'label' | 'icon'> = defaultGaugePreset,
) {
  const now = new Date();
  const gaugeProps: UltraGaugeWidgetProps = {
    label: preset.label,
    icon: preset.icon,
    unit: '%',
    value: gaugeValue > 0 ? gaugeValue : dayProgress(now),
  };

  UltraClockWidget.updateSnapshot({});
  UltraGaugeWidget.updateSnapshot(gaugeProps);
  UltraClockWidget.reload();
  UltraGaugeWidget.reload();
}
