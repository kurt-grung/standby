import { homeWidgetReferenceSize } from '../design-system';
import { panelLayout, panelRingSize } from '../ui/ultra/panelLayout';
import { complicationSlots, type ComplicationSlotId } from './complicationOptions';

export type WidgetConfigureSlotPosition = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  size: number;
};

export function widgetConfigurePadX(widgetSize: number) {
  return Math.round(widgetSize * (panelLayout.padX / homeWidgetReferenceSize));
}

export function widgetConfigurePadY(widgetSize: number) {
  return Math.round(widgetSize * (panelLayout.padY / homeWidgetReferenceSize));
}

export function widgetConfigureSlotSize(widgetSize: number) {
  return panelRingSize(widgetSize);
}

export function widgetConfigurePlusSize(slotSize: number) {
  return Math.max(12, Math.round(slotSize * 0.38));
}

export function widgetConfigureSlotBorderWidth(slotSize: number) {
  return Math.max(1, slotSize * 0.024);
}

export function widgetConfigureSlotPosition(
  slot: ComplicationSlotId,
  widgetSize: number,
): WidgetConfigureSlotPosition {
  const size = widgetConfigureSlotSize(widgetSize);
  const padX = widgetConfigurePadX(widgetSize);
  const padY = widgetConfigurePadY(widgetSize);
  const centerX = (widgetSize - size) / 2;

  const positions: Record<ComplicationSlotId, Omit<WidgetConfigureSlotPosition, 'size'>> = {
    topLeft: { left: padX, top: padY },
    topCenter: { left: centerX, top: padY },
    topRight: { right: padX, top: padY },
    bottomLeft: { left: padX, bottom: padY },
    bottomCenter: { left: centerX, bottom: padY },
    bottomRight: { right: padX, bottom: padY },
  };

  return { ...positions[slot], size };
}

export function widgetConfigureSlotPositions(widgetSize: number) {
  return complicationSlots.map((slot) => ({
    slot,
    ...widgetConfigureSlotPosition(slot, widgetSize),
  }));
}
