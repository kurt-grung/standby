export type UltraGaugeWidgetProps = {
  label: string;
  value: number;
  unit: string;
  icon: string;
};

export type UltraGaugePreset = Pick<UltraGaugeWidgetProps, 'label' | 'icon'>;
