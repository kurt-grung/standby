import { Check } from 'lucide-react';

import {
  complicationOptionsForWidget,
  complicationSlotLabels,
  type ComplicationId,
  type ComplicationSlotId,
} from '../lib/complicationOptions';
import type { ConfigureWidget } from '../lib/gaugePresets';
import type { WidgetConfig } from '../hooks/useWidgetConfig';
import './ComplicationPicker.css';

type ComplicationPickerProps = {
  widget: ConfigureWidget;
  slot: ComplicationSlotId;
  config: WidgetConfig;
  onClose: () => void;
};

export function ComplicationPicker({ widget, slot, config, onClose }: ComplicationPickerProps) {
  const { getComplications, setComplication } = config;
  const options = complicationOptionsForWidget(widget);
  const selectedId = getComplications(widget)[slot];
  const slotLabel = complicationSlotLabels[slot];

  const select = (id: ComplicationId | null) => {
    setComplication(widget, slot, id);
    onClose();
  };

  return (
    <div className="picker-backdrop" role="presentation" onClick={onClose}>
      <div
        className="picker-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="picker-sheet__header">
          <p id="picker-title" className="picker-sheet__eyebrow">
            {slotLabel}
          </p>
        </div>

        <ul className="picker-sheet__list">
          {options.map((option, index) => {
            const active = selectedId === option.id;
            const Icon = option.icon;

            return (
              <li key={option.id}>
                <button
                  type="button"
                  className="picker-row"
                  aria-pressed={active}
                  style={{ borderTopWidth: index === 0 ? 1 : 0 }}
                  onClick={() => select(option.id)}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                  <span className="picker-row__label">{option.label}</span>
                  {active ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
          <li>
            <button type="button" className="picker-row picker-row--none" onClick={() => select(null)}>
              <span className="picker-row__label">None</span>
            </button>
          </li>
        </ul>

        <button type="button" className="picker-sheet__cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
