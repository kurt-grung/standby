export const standByOuterPad = 20;
export const standByWidgetGap = 12;

export function standByWidgetSize(landscapeWidth: number, landscapeHeight: number) {
  if (landscapeWidth <= 0 || landscapeHeight <= 0) return 0;
  const maxByHeight = landscapeHeight - standByOuterPad * 2;
  const maxByWidth = (landscapeWidth - standByOuterPad * 2 - standByWidgetGap) / 2;
  return Math.floor(Math.min(maxByHeight, maxByWidth));
}

const homeWidgetReferenceLandscape = { width: 844, height: 390 };

export const homeWidgetReferenceSize = standByWidgetSize(
  homeWidgetReferenceLandscape.width,
  homeWidgetReferenceLandscape.height,
);

export const homeWidgetStripPadding = 14;

export function homeWidgetPairWidth(widgetSize: number) {
  return widgetSize * 2 + standByWidgetGap;
}

export function homeWidgetDisplaySize(containerWidth: number) {
  if (containerWidth <= 0) return 0;
  const innerWidth = containerWidth - homeWidgetStripPadding * 2;
  return Math.floor((innerWidth - standByWidgetGap) / 2);
}

export function homeWidgetStripHeight(containerWidth: number) {
  const displaySize = homeWidgetDisplaySize(containerWidth);
  if (displaySize <= 0) return homeWidgetStripPadding * 2;
  return displaySize + homeWidgetStripPadding * 2;
}

export function homeWidgetPreviewScale(displaySize: number) {
  if (displaySize <= 0 || homeWidgetReferenceSize <= 0) return 1;
  return displaySize / homeWidgetReferenceSize;
}
