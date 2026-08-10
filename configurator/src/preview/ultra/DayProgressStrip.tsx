import { dayProgress } from '../../lib/standByPreviewLayout';
import { nightMode } from './nightColors';

type DayProgressStripProps = {
  now: Date;
  batteryPercent?: number;
};

function formatHourLabel(hour: number) {
  const h = hour % 24;
  const hour12 = h % 12 || 12;
  const suffix = h < 12 ? 'A' : 'P';
  return `${hour12}${suffix}`;
}

export function DayProgressStrip({ now, batteryPercent = 86 }: DayProgressStripProps) {
  const progress = dayProgress(now);
  const percent = Math.round(progress * 100);
  const marks = [0, 6, 12, 18, 24] as const;

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 6,
          paddingInline: 2,
        }}
      >
        <span
          style={{
            color: nightMode.primary,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 0.3,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          DAY {percent}%
        </span>
        <span
          style={{
            color: nightMode.secondary,
            fontSize: 12,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {batteryPercent}%
        </span>
      </div>

      <div
        style={{
          overflow: 'hidden',
          borderRadius: 8,
          padding: '10px 8px',
          backgroundColor: '#080202',
          border: `1.5px solid ${nightMode.border}`,
        }}
      >
        <div
          style={{
            height: 10,
            overflow: 'hidden',
            borderRadius: 999,
            backgroundColor: nightMode.track,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              borderRadius: 999,
              backgroundColor: nightMode.primary,
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {marks.map((hour) => (
            <span
              key={hour}
              style={{
                color: hour / 24 <= progress ? nightMode.primary : nightMode.muted,
                fontSize: 10,
                fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatHourLabel(hour === 24 ? 0 : hour)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
