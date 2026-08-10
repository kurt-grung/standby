import { homeWidgetReferenceSize } from './designTokens';

export const standByOuterPad = 20;
export const standByWidgetGap = 12;

export function standByWidgetSize(landscapeWidth: number, landscapeHeight: number) {
  if (landscapeWidth <= 0 || landscapeHeight <= 0) {
    return 0;
  }

  const maxByHeight = landscapeHeight - standByOuterPad * 2;
  const maxByWidth = (landscapeWidth - standByOuterPad * 2 - standByWidgetGap) / 2;
  return Math.floor(Math.min(maxByHeight, maxByWidth));
}

export function dayProgress(date: Date) {
  const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  return seconds / 86400;
}

export function homeWidgetPairWidth(widgetSize: number) {
  return widgetSize * 2 + standByWidgetGap;
}

export function standByPreviewScale(displaySize: number) {
  if (displaySize <= 0 || homeWidgetReferenceSize <= 0) {
    return 1;
  }
  return displaySize / homeWidgetReferenceSize;
}

export { homeWidgetReferenceSize };
