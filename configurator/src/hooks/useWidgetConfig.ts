import { useCallback, useMemo, useState } from 'react';

import {
  defaultComplicationsForWidget,
  type ComplicationId,
  type ComplicationLayout,
  type ComplicationSlotId,
} from '../lib/complicationOptions';
import type { ConfigureWidget } from '../lib/gaugePresets';

export function useWidgetConfig() {
  const [activeWidget, setActiveWidget] = useState<ConfigureWidget>('clock');
  const [clockComplications, setClockComplications] = useState<ComplicationLayout>(() =>
    defaultComplicationsForWidget('clock'),
  );
  const [gaugeComplications, setGaugeComplications] = useState<ComplicationLayout>(() =>
    defaultComplicationsForWidget('gauge'),
  );

  const getComplications = useCallback(
    (widget: ConfigureWidget) => (widget === 'gauge' ? gaugeComplications : clockComplications),
    [clockComplications, gaugeComplications],
  );

  const setComplication = useCallback(
    (widget: ConfigureWidget, slot: ComplicationSlotId, complicationId: ComplicationId | null) => {
      const apply = (previous: ComplicationLayout) => ({ ...previous, [slot]: complicationId });
      if (widget === 'gauge') {
        setGaugeComplications(apply);
        return;
      }
      setClockComplications(apply);
    },
    [],
  );

  return useMemo(
    () => ({
      activeWidget,
      setActiveWidget,
      getComplications,
      setComplication,
    }),
    [activeWidget, getComplications, setComplication],
  );
}

export type WidgetConfig = ReturnType<typeof useWidgetConfig>;
