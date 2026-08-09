export const standByOuterPad = 20;
export const standByWidgetGap = 12;

export function standByWidgetSize(landscapeWidth: number, landscapeHeight: number) {
  if (landscapeWidth <= 0 || landscapeHeight <= 0) return 0;
  const maxByHeight = landscapeHeight - standByOuterPad * 2;
  const maxByWidth = (landscapeWidth - standByOuterPad * 2 - standByWidgetGap) / 2;
  return Math.floor(Math.min(maxByHeight, maxByWidth));
}
