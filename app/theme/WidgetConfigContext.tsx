import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'expo-router';

import {
  defaultComplicationsForWidget,
  type ComplicationId,
  type ComplicationLayout,
  type ComplicationSlotId,
} from '../lib/complicationOptions';
import { gaugePresets, type ConfigureWidget } from '../lib/gaugePresets';
import { refreshStandbyWidgets } from '../lib/refreshStandbyWidgets';

type WidgetConfigContextValue = {
  gaugeValue: number;
  setGaugeValue: (value: number | ((previous: number) => number)) => void;
  presetIndex: number;
  setPresetIndex: (index: number) => void;
  lastConfigureWidget: ConfigureWidget;
  setLastConfigureWidget: (widget: ConfigureWidget) => void;
  getComplications: (widget: ConfigureWidget) => ComplicationLayout;
  setComplication: (
    widget: ConfigureWidget,
    slot: ComplicationSlotId,
    complicationId: ComplicationId | null,
  ) => void;
};

const WidgetConfigContext = createContext<WidgetConfigContextValue | null>(null);

type WidgetConfigProviderProps = {
  children: ReactNode;
};

export function WidgetConfigProvider({ children }: WidgetConfigProviderProps) {
  const [gaugeValue, setGaugeValue] = useState(0);
  const [presetIndex, setPresetIndex] = useState(0);
  const [lastConfigureWidget, setLastConfigureWidget] = useState<ConfigureWidget>('clock');
  const [clockComplications, setClockComplications] = useState<ComplicationLayout>(() =>
    defaultComplicationsForWidget('clock'),
  );
  const [gaugeComplications, setGaugeComplications] = useState<ComplicationLayout>(() =>
    defaultComplicationsForWidget('gauge'),
  );

  useEffect(() => {
    const preset = gaugePresets[presetIndex] ?? gaugePresets[0];
    refreshStandbyWidgets(gaugeValue, preset);
  }, [gaugeValue, presetIndex]);

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

  const value = useMemo(
    () => ({
      gaugeValue,
      setGaugeValue,
      presetIndex,
      setPresetIndex,
      lastConfigureWidget,
      setLastConfigureWidget,
      getComplications,
      setComplication,
    }),
    [gaugeValue, presetIndex, lastConfigureWidget, getComplications, setComplication],
  );

  return <WidgetConfigContext.Provider value={value}>{children}</WidgetConfigContext.Provider>;
}

export function useWidgetConfig() {
  const value = useContext(WidgetConfigContext);
  if (!value) {
    throw new Error('useWidgetConfig must be used within WidgetConfigProvider');
  }
  return value;
}

export function useOpenWidgetConfigure() {
  const router = useRouter();
  const { setLastConfigureWidget } = useWidgetConfig();

  return useCallback(
    (widget: ConfigureWidget) => {
      setLastConfigureWidget(widget);
      router.push({ pathname: '/configure', params: { widget } });
    },
    [router, setLastConfigureWidget],
  );
}
