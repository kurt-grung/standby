export const widgetConfigure = {
  templateCornerRadiusRatio: 0.225,
  templateStrokeWidth: 1,
  rowHeightRatios: [0.19, 0.31, 0.31, 0.19] as const,
  slotInsetXRatio: 0.04,
  slotInsetYRatio: 0.14,
  slotCornerRadiusRatio: 0.18,
  segmentHeight: 36,
  segmentWidth: 200,
  segmentInset: 3,
  segmentActiveFill: 'rgba(255,255,255,0.16)',
  segmentOutlineInset: 6,
} as const;

export const homeWidgetReferenceSize = 350;

export function widgetConfigureTemplateCornerRadius(size: number) {
  return Math.round(size * widgetConfigure.templateCornerRadiusRatio);
}
