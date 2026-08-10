export const panelLayout = {
  padX: 22,
  padY: 16,
  sectionGap: 14,
  metricGap: 4,
  metricHeadGap: 2,
  metricBarHeight: 6,
  metricLabelSize: 9,
  metricValueSize: 12,
} as const;

export function panelMetricRowHeight() {
  return panelLayout.metricLabelSize + panelLayout.metricHeadGap + panelLayout.metricBarHeight;
}

export function panelMetricsBlockHeight(rowCount = 3) {
  const row = panelMetricRowHeight();
  const gaps = Math.max(0, rowCount - 1) * panelLayout.metricGap;
  return row * rowCount + gaps;
}

export function panelRingSize(height: number) {
  if (height <= 0) return 44;
  return Math.min(50, Math.max(38, height * 0.12));
}

export function panelHeroSize(height: number) {
  if (height <= 0) return 100;
  return Math.min(112, Math.max(84, height * 0.26));
}

export function panelStatusHeroSize(faceHeight: number) {
  if (faceHeight <= 0) return 84;

  const ring = panelRingSize(faceHeight);
  const topRow = ring + 16;
  const bottomRow = ring + 16;
  const metrics = panelMetricsBlockHeight();
  const reserved =
    panelLayout.padY * 2 + topRow + bottomRow + metrics + panelLayout.sectionGap * 2 + 18;
  const available = faceHeight - reserved;

  return Math.max(56, Math.min(panelHeroSize(faceHeight), available));
}

export function panelTimeSize(height: number, width: number) {
  if (height <= 0) return 36;
  if (width > 360 && height > 340) return 42;
  return Math.min(40, Math.max(32, height * 0.1));
}
