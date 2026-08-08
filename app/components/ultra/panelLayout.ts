export const panelLayout = {
  padX: 22,
  padY: 16,
  sectionGap: 14,
  metricGap: 8,
} as const;

export function panelRingSize(height: number) {
  if (height <= 0) return 44;
  return Math.min(50, Math.max(38, height * 0.12));
}

export function panelHeroSize(height: number) {
  if (height <= 0) return 100;
  return Math.min(112, Math.max(84, height * 0.26));
}

export function panelTimeSize(height: number, width: number) {
  if (height <= 0) return 36;
  if (width > 360 && height > 340) return 42;
  return Math.min(40, Math.max(32, height * 0.1));
}
