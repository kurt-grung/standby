import {
  homeWidgetReferenceSize,
  widgetConfigure,
} from './designTokens';
import { panelLayout } from './panelLayout';
import {
  complicationSlotKind,
  complicationSlots,
  type ComplicationSlotId,
  type ComplicationSlotKind,
} from './complicationOptions';

export type WidgetConfigureCellMetrics = {
  padX: number;
  padY: number;
  innerWidth: number;
  innerHeight: number;
  smallColumnWidth: number;
  rowHeights: readonly number[];
  rowTops: readonly number[];
};

export type WidgetConfigureSlotCell = {
  slot: ComplicationSlotId;
  kind: ComplicationSlotKind;
  left: number;
  top: number;
  width: number;
  height: number;
  buttonWidth: number;
  buttonHeight: number;
};

const slotColumns: Record<ComplicationSlotId, number | null> = {
  topLeft: 0,
  topCenter: 1,
  topRight: 2,
  largeTop: null,
  largeBottom: null,
  bottomLeft: 0,
  bottomCenter: 1,
  bottomRight: 2,
};

const slotRows: Record<ComplicationSlotId, number> = {
  topLeft: 0,
  topCenter: 0,
  topRight: 0,
  largeTop: 1,
  largeBottom: 2,
  bottomLeft: 3,
  bottomCenter: 3,
  bottomRight: 3,
};

export function widgetConfigurePadX(widgetSize: number) {
  return Math.round(widgetSize * (panelLayout.padX / homeWidgetReferenceSize));
}

export function widgetConfigurePadY(widgetSize: number) {
  return Math.round(widgetSize * (panelLayout.padY / homeWidgetReferenceSize));
}

export function widgetConfigurePlusSize(slotSize: number) {
  return Math.max(12, Math.round(slotSize * 0.38));
}

export function widgetConfigureSlotBorderWidth() {
  return 1;
}

export function widgetConfigureSlotCornerRadius(height: number) {
  return height * widgetConfigure.slotCornerRadiusRatio;
}

export function widgetConfigureCellMetrics(widgetSize: number): WidgetConfigureCellMetrics {
  const padX = widgetConfigurePadX(widgetSize);
  const padY = widgetConfigurePadY(widgetSize);
  const innerWidth = widgetSize - padX * 2;
  const innerHeight = widgetSize - padY * 2;
  const rowHeights = widgetConfigure.rowHeightRatios.map((ratio) => innerHeight * ratio);
  let rowTop = 0;
  const rowTops = rowHeights.map((height) => {
    const top = rowTop;
    rowTop += height;
    return top;
  });

  return {
    padX,
    padY,
    innerWidth,
    innerHeight,
    smallColumnWidth: innerWidth / 3,
    rowHeights,
    rowTops,
  };
}

function widgetConfigureButtonFrame(cellWidth: number, cellHeight: number) {
  const insetX = cellWidth * widgetConfigure.slotInsetXRatio;
  const insetY = cellHeight * widgetConfigure.slotInsetYRatio;

  return {
    buttonWidth: cellWidth - insetX * 2,
    buttonHeight: cellHeight - insetY * 2,
  };
}

export function widgetConfigureSlotCells(widgetSize: number): WidgetConfigureSlotCell[] {
  const metrics = widgetConfigureCellMetrics(widgetSize);
  const { padX, padY, innerWidth, smallColumnWidth, rowHeights, rowTops } = metrics;

  return complicationSlots.map((slot) => {
    const kind = complicationSlotKind[slot];
    const row = slotRows[slot];
    const column = slotColumns[slot];
    const cellWidth = column === null ? innerWidth : smallColumnWidth;
    const cellHeight = rowHeights[row] ?? 0;
    const left = column === null ? padX : padX + smallColumnWidth * column;
    const top = padY + (rowTops[row] ?? 0);
    const { buttonWidth, buttonHeight } = widgetConfigureButtonFrame(cellWidth, cellHeight);

    return {
      slot,
      kind,
      left,
      top,
      width: cellWidth,
      height: cellHeight,
      buttonWidth,
      buttonHeight,
    };
  });
}
