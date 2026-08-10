import type { ConfigureWidget } from '../lib/gaugePresets';
import { ModularUltraFace } from './ultra/ModularUltraFace';
import { StatusGaugeFace } from './ultra/StatusGaugeFace';
import './WidgetSlot.css';

export const standBySides = ['left', 'right'] as const;
export type StandBySide = (typeof standBySides)[number];

export const widgetForSide: Record<StandBySide, ConfigureWidget> = {
  left: 'clock',
  right: 'gauge',
};

const sideLabels: Record<StandBySide, string> = {
  left: 'Widget left',
  right: 'Widget right',
};

type StandByWidgetProps = {
  side: StandBySide;
  now: Date;
};

export function StandByWidget({ side, now }: StandByWidgetProps) {
  const widget = widgetForSide[side];

  return (
    <article className="widget-slot" aria-label={sideLabels[side]}>
      {widget === 'gauge' ? (
        <StatusGaugeFace
          now={now}
          temperature={68}
          tempLow={49}
          tempHigh={84}
          uvIndex={4}
          sunsetLabel="7:31PM"
          batteryPercent={74}
          noiseDb={38}
        />
      ) : (
        <ModularUltraFace
          now={now}
          temperature={72}
          tempLow={52}
          tempHigh={89}
          uvIndex={5}
          sunsetLabel="7:29PM"
          batteryPercent={86}
        />
      )}
    </article>
  );
}
