import type { ConfigureWidget } from '../lib/gaugePresets';
import { widgetConfigure } from '../lib/designTokens';
import './ConfigureWidgetSegment.css';

type ConfigureWidgetSegmentProps = {
  widgets: readonly ConfigureWidget[];
  labels: Record<ConfigureWidget, string>;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function ConfigureWidgetSegment({
  widgets,
  labels,
  activeIndex,
  onSelect,
}: ConfigureWidgetSegmentProps) {
  const borderRadius = widgetConfigure.segmentHeight / 2;
  const segmentRadius = borderRadius - widgetConfigure.segmentInset;

  return (
    <div
      className="configure-segment"
      style={{ width: widgetConfigure.segmentWidth, height: widgetConfigure.segmentHeight }}
    >
      <div className="configure-segment__outline" />
      <div className="configure-segment__glass">
        <div
          className="configure-segment__row"
          style={{ padding: widgetConfigure.segmentInset }}
        >
          {widgets.map((widget, index) => {
            const active = index === activeIndex;

            return (
              <button
                key={widget}
                type="button"
                className="configure-segment__button"
                aria-pressed={active}
                onClick={() => onSelect(index)}
              >
                <span
                  className="configure-segment__label"
                  style={
                    active
                      ? {
                          backgroundColor: widgetConfigure.segmentActiveFill,
                          borderRadius: segmentRadius,
                          color: '#FFFFFF',
                        }
                      : undefined
                  }
                >
                  {labels[widget]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
