type Rgb = readonly [number, number, number];

const NIGHT_BLACK: Rgb = [0, 0, 0];

function parseHex(hex: string): Rgb {
  const normalized = hex.replace('#', '');
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ] as const;
}

function formatHex([r, g, b]: Rgb): string {
  return `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

function mixRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ] as const;
}

export function buildStandByNightPalette(primaryHex: string) {
  const primary = parseHex(primaryHex);

  return {
    bg: '#000000',
    primary: formatHex(primary),
    secondary: formatHex(mixRgb(primary, NIGHT_BLACK, 0.24)),
    tertiary: formatHex(mixRgb(primary, NIGHT_BLACK, 0.46)),
    muted: formatHex(mixRgb(primary, NIGHT_BLACK, 0.64)),
    track: formatHex(mixRgb(primary, NIGHT_BLACK, 0.89)),
    border: formatHex(mixRgb(primary, NIGHT_BLACK, 0.82)),
    glow: `rgba(${Math.round(primary[0])}, ${Math.round(primary[1])}, ${Math.round(primary[2])}, 0.22)`,
  } as const;
}

export type StandByNightPalette = ReturnType<typeof buildStandByNightPalette>;
