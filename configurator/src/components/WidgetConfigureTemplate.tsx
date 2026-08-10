import { useCallback, useRef, useState } from 'react';

import { complicationSlotLabels, type ComplicationSlotId } from '../lib/complicationOptions';
import type { ConfigureWidget } from '../lib/gaugePresets';
import { widgetConfigureTemplateCornerRadius, widgetConfigure } from '../lib/designTokens';
import { widgetConfigureSlotCells } from '../lib/widgetConfigureLayout';
import type { WidgetConfig } from '../hooks/useWidgetConfig';
import { ComplicationSlotButton } from './ComplicationSlotButton';
import { WidgetConfigureRegionGrid } from './WidgetConfigureRegionGrid';
import './WidgetConfigureTemplate.css';

type WidgetConfigureTemplateProps = {
  widget: ConfigureWidget;
  config: WidgetConfig;
  onPickSlot: (slot: ComplicationSlotId) => void;
};

export function WidgetConfigureTemplate({
  widget,
  config,
  onPickSlot,
}: WidgetConfigureTemplateProps) {
  const { getComplications } = config;
  const complications = getComplications(widget);
  const [width, setWidth] = useState(0);

  const cornerRadius = widgetConfigureTemplateCornerRadius(width);
  const slotCells = width > 0 ? widgetConfigureSlotCells(width) : [];

  return (
    <ResizeObserverContainer onResize={setWidth}>
      {width > 0 ? (
        <div
          className="configure-template"
          style={{
            width,
            height: width,
            borderRadius: cornerRadius,
            borderWidth: widgetConfigure.templateStrokeWidth,
          }}
        >
          <WidgetConfigureRegionGrid size={width} />

          {slotCells.map(
            ({
              slot,
              kind,
              left,
              top,
              width: cellWidth,
              height: cellHeight,
              buttonWidth,
              buttonHeight,
            }) => (
              <button
                key={slot}
                type="button"
                className="configure-template__slot"
                aria-label={`${complicationSlotLabels[slot]} complication`}
                style={{
                  left,
                  top,
                  width: cellWidth,
                  height: cellHeight,
                }}
                onClick={() => onPickSlot(slot)}
              >
                <ComplicationSlotButton
                  slotLabel={complicationSlotLabels[slot]}
                  complicationId={complications[slot]}
                  width={buttonWidth}
                  height={buttonHeight}
                  kind={kind}
                />
              </button>
            ),
          )}
        </div>
      ) : (
        <div className="configure-template configure-template--placeholder" />
      )}
    </ResizeObserverContainer>
  );
}

type ResizeObserverContainerProps = {
  onResize: (width: number) => void;
  children: React.ReactNode;
};

function ResizeObserverContainer({ onResize, children }: ResizeObserverContainerProps) {
  const observerRef = useRef<ResizeObserver | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node) {
        return;
      }

      onResize(node.clientWidth);

      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          onResize(entry.contentRect.width);
        }
      });
      observerRef.current.observe(node);
    },
    [onResize],
  );

  return (
    <div ref={setRef} className="configure-template-measure">
      {children}
    </div>
  );
}
