import { Plus } from 'lucide-react';

import {
  complicationOptionById,
  type ComplicationId,
  type ComplicationSlotKind,
} from '../lib/complicationOptions';
import {
  widgetConfigurePlusSize,
  widgetConfigureSlotBorderWidth,
  widgetConfigureSlotCornerRadius,
} from '../lib/widgetConfigureLayout';
import './ComplicationSlotButton.css';

type ComplicationSlotButtonProps = {
  slotLabel: string;
  complicationId: ComplicationId | null;
  width: number;
  height: number;
  kind?: ComplicationSlotKind;
};

export function ComplicationSlotButton({
  slotLabel,
  complicationId,
  width,
  height,
  kind = 'small',
}: ComplicationSlotButtonProps) {
  const option = complicationOptionById(complicationId);
  const referenceSize = Math.min(width, height);
  const plusSize = widgetConfigurePlusSize(referenceSize);
  const borderWidth = widgetConfigureSlotBorderWidth();
  const cornerRadius = widgetConfigureSlotCornerRadius(height);
  const iconSize =
    kind === 'large' ? referenceSize * 0.34 : Math.min(height * 0.55, width * 0.32);
  const Icon = option?.icon;

  return (
    <div
      className="complication-slot"
      style={{
        width,
        height,
        borderRadius: cornerRadius,
        borderWidth,
      }}
      aria-label={
        option
          ? `${option.label} complication, ${slotLabel}`
          : `Add complication, ${slotLabel}`
      }
    >
      {Icon ? (
        <Icon size={iconSize} strokeWidth={2.25} aria-hidden="true" />
      ) : (
        <Plus size={plusSize} strokeWidth={2.5} aria-hidden="true" />
      )}
    </div>
  );
}
