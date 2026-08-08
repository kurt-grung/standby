export const ultraColors = {
  background: '#000000',
  primary: '#FFFFFF',
  secondary: '#8E8E93',
  accent: '#FF9F0A',
  accentGreen: '#30D158',
  accentRed: '#FF453A',
  ringTrack: '#2C2C2E',
} as const;

export const nightColors = {
  background: '#000000',
  surface: '#111111',
  card: '#161616',
  border: '#2A2A2C',
  primary: '#F5F5F7',
  secondary: '#8E8E93',
  muted: '#636366',
  accent: '#FF453A',
  orange: '#FF9F0A',
  track: '#1F1F1F',
} as const;

export function dayProgress(date: Date): number {
  const seconds =
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  return seconds / 86400;
}

export function buildMinuteTimeline<T>(
  hours: number,
  propsForDate: (date: Date) => T,
): { date: Date; props: T }[] {
  const start = new Date();
  start.setSeconds(0, 0);
  const entries: { date: Date; props: T }[] = [];

  for (let minute = 0; minute < hours * 60; minute += 1) {
    const date = new Date(start.getTime() + minute * 60_000);
    entries.push({ date, props: propsForDate(date) });
  }

  return entries;
}

export function formatNightTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
