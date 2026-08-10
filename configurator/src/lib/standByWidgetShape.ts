import { widgetConfigure } from './designTokens';

export const standByWidgetCornerRadiusRatio = widgetConfigure.templateCornerRadiusRatio;

export function standByWidgetCornerRadius(size: number) {
  return size * standByWidgetCornerRadiusRatio;
}

export function squircleNormalizedPath(exponent = 4.25): string {
  const steps = 96;
  const parts: string[] = [];

  for (let index = 0; index < steps; index += 1) {
    const t = (index / steps) * Math.PI * 2;
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const x = 0.5 + 0.5 * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / exponent);
    const y = 0.5 + 0.5 * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / exponent);
    parts.push(`${index === 0 ? 'M' : 'L'} ${x.toFixed(5)} ${y.toFixed(5)}`);
  }

  return `${parts.join(' ')} Z`;
}

export const nightMode = {
  bg: '#000000',
  primary: '#FF453A',
  secondary: '#C23B33',
  tertiary: '#8A2E28',
  muted: '#5C221E',
  track: '#1C0C0A',
  border: '#2E1210',
  glow: 'rgba(255, 69, 58, 0.22)',
} as const;
