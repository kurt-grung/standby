import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AudioWaveform,
  BatteryFull,
  Calendar,
  Sun,
  Sunset,
  Thermometer,
} from 'lucide-react';

import type { ConfigureWidget } from './gaugePresets';

export type ComplicationId =
  | 'temperature'
  | 'date'
  | 'battery'
  | 'sunset'
  | 'uv'
  | 'noise'
  | 'activity';

export type ComplicationSlotId =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'largeTop'
  | 'largeBottom'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

export type ComplicationSlotKind = 'small' | 'large';

export type ComplicationLayout = Record<ComplicationSlotId, ComplicationId | null>;

export type ComplicationOption = {
  id: ComplicationId;
  label: string;
  icon: LucideIcon;
  widgets: readonly ConfigureWidget[];
};

export const complicationTopSlots: ComplicationSlotId[] = ['topLeft', 'topCenter', 'topRight'];
export const complicationLargeSlots: ComplicationSlotId[] = ['largeTop', 'largeBottom'];
export const complicationBottomSlots: ComplicationSlotId[] = [
  'bottomLeft',
  'bottomCenter',
  'bottomRight',
];
export const complicationSlotRows: ComplicationSlotId[][] = [
  complicationTopSlots,
  ['largeTop'],
  ['largeBottom'],
  complicationBottomSlots,
];
export const complicationSlots: ComplicationSlotId[] = complicationSlotRows.flat();

export const complicationSlotKind: Record<ComplicationSlotId, ComplicationSlotKind> = {
  topLeft: 'small',
  topCenter: 'small',
  topRight: 'small',
  largeTop: 'large',
  largeBottom: 'large',
  bottomLeft: 'small',
  bottomCenter: 'small',
  bottomRight: 'small',
};

export const complicationOptions: ComplicationOption[] = [
  {
    id: 'temperature',
    label: 'Temperature',
    icon: Thermometer,
    widgets: ['clock', 'gauge'],
  },
  { id: 'date', label: 'Date', icon: Calendar, widgets: ['clock'] },
  { id: 'battery', label: 'Battery', icon: BatteryFull, widgets: ['clock', 'gauge'] },
  { id: 'sunset', label: 'Sunset', icon: Sunset, widgets: ['clock', 'gauge'] },
  { id: 'uv', label: 'UV Index', icon: Sun, widgets: ['clock', 'gauge'] },
  { id: 'noise', label: 'Noise', icon: AudioWaveform, widgets: ['gauge'] },
  { id: 'activity', label: 'Activity', icon: Activity, widgets: ['clock', 'gauge'] },
];

export const defaultClockComplications: ComplicationLayout = {
  topLeft: 'temperature',
  topCenter: 'date',
  topRight: 'battery',
  largeTop: null,
  largeBottom: null,
  bottomLeft: 'activity',
  bottomCenter: 'sunset',
  bottomRight: 'uv',
};

export const defaultGaugeComplications: ComplicationLayout = {
  topLeft: 'temperature',
  topCenter: 'noise',
  topRight: 'battery',
  largeTop: null,
  largeBottom: null,
  bottomLeft: 'activity',
  bottomCenter: 'sunset',
  bottomRight: 'uv',
};

export function defaultComplicationsForWidget(widget: ConfigureWidget): ComplicationLayout {
  return widget === 'gauge' ? { ...defaultGaugeComplications } : { ...defaultClockComplications };
}

export function complicationOptionsForWidget(widget: ConfigureWidget): ComplicationOption[] {
  return complicationOptions.filter((option) => option.widgets.includes(widget));
}

export function complicationOptionById(id: ComplicationId | null): ComplicationOption | undefined {
  if (!id) return undefined;
  return complicationOptions.find((option) => option.id === id);
}

export const complicationSlotLabels: Record<ComplicationSlotId, string> = {
  topLeft: 'top left',
  topCenter: 'top center',
  topRight: 'top right',
  largeTop: 'large top',
  largeBottom: 'large bottom',
  bottomLeft: 'bottom left',
  bottomCenter: 'bottom center',
  bottomRight: 'bottom right',
};
