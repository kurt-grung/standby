import { Fragment } from 'react';

import { useLiveClock } from '../hooks/useLiveClock';
import { standByWidgetGap } from '../lib/standByPreviewLayout';
import { StandByWidget, standBySides } from './StandByWidget';
import './StandByWidgetPair.css';

type StandByWidgetPairProps = {
  size: number;
  gap?: number;
};

export function StandByWidgetPair({ size, gap = standByWidgetGap }: StandByWidgetPairProps) {
  const now = useLiveClock();

  if (size <= 0) {
    return null;
  }

  return (
    <div className="standby-widget-pair">
      {standBySides.map((side, index) => (
        <Fragment key={side}>
          {index > 0 ? <div style={{ width: gap, flexShrink: 0 }} aria-hidden="true" /> : null}
          <div className="standby-widget-pair__slot" style={{ width: size, height: size }}>
            <StandByWidget side={side} now={now} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}
