import { useCallback, useEffect, useRef, useState } from 'react';

import type { ComplicationSlotId } from '../lib/complicationOptions';
import type { ConfigureWidget } from '../lib/gaugePresets';
import type { WidgetConfig } from '../hooks/useWidgetConfig';
import { ComplicationPicker } from './ComplicationPicker';
import { ConfigureWidgetSegment } from './ConfigureWidgetSegment';
import { WidgetConfigureTemplate } from './WidgetConfigureTemplate';
import { WidgetPreview } from './WidgetPreview';
import './WidgetConfigurePanel.css';

const configureWidgets: ConfigureWidget[] = ['clock', 'gauge'];

const configureLabels: Record<ConfigureWidget, string> = {
  clock: 'Left',
  gauge: 'Right',
};

type WidgetConfigurePanelProps = {
  config: WidgetConfig;
};

type PickerState = {
  widget: ConfigureWidget;
  slot: ComplicationSlotId;
} | null;

export function WidgetConfigurePanel({ config }: WidgetConfigurePanelProps) {
  const { activeWidget, setActiveWidget } = config;
  const [activeIndex, setActiveIndex] = useState(configureWidgets.indexOf(activeWidget));
  const [picker, setPicker] = useState<PickerState>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setPageWidth(entry.contentRect.width);
      }
    });
    observer.observe(node);
    setPageWidth(node.clientWidth);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pageWidth <= 0) {
      return;
    }
    scrollerRef.current?.scrollTo({ left: pageWidth * activeIndex, behavior: 'auto' });
  }, [activeIndex, pageWidth]);

  const scrollToWidget = useCallback(
    (index: number) => {
      const next = configureWidgets[index] ?? 'clock';
      setActiveIndex(index);
      setActiveWidget(next);
      if (pageWidth > 0) {
        scrollerRef.current?.scrollTo({ left: pageWidth * index, behavior: 'smooth' });
      }
    },
    [pageWidth, setActiveWidget],
  );

  const onScrollEnd = useCallback(() => {
    if (pageWidth <= 0 || !scrollerRef.current) {
      return;
    }

    const index = Math.round(scrollerRef.current.scrollLeft / pageWidth);
    const nextIndex = Math.max(0, Math.min(index, configureWidgets.length - 1));
    setActiveIndex(nextIndex);
    setActiveWidget(configureWidgets[nextIndex] ?? 'clock');
  }, [pageWidth, setActiveWidget]);

  const openPicker = (widget: ConfigureWidget, slot: ComplicationSlotId) => {
    setPicker({ widget, slot });
  };

  return (
    <div className="configure-panel">
      <header className="configure-panel__header">
        <div className="configure-panel__header-side" aria-hidden="true" />
        <h1 className="configure-panel__title">Configure</h1>
        <div className="configure-panel__header-side configure-panel__header-side--end">
          <WidgetPreview />
        </div>
      </header>

      <div className="configure-panel__segment-wrap">
        <ConfigureWidgetSegment
          widgets={configureWidgets}
          labels={configureLabels}
          activeIndex={activeIndex}
          onSelect={scrollToWidget}
        />
      </div>

      <div
        ref={scrollerRef}
        className="configure-panel__scroller"
        onScrollEnd={onScrollEnd}
      >
        {configureWidgets.map((widget) => (
          <section key={widget} className="configure-panel__page" aria-label={configureLabels[widget]}>
            <WidgetConfigureTemplate
              widget={widget}
              config={config}
              onPickSlot={(slot) => openPicker(widget, slot)}
            />
          </section>
        ))}
      </div>

      {picker ? (
        <ComplicationPicker
          widget={picker.widget}
          slot={picker.slot}
          config={config}
          onClose={() => setPicker(null)}
        />
      ) : null}
    </div>
  );
}
