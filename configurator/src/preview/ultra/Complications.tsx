import { FullRing } from './ArcGauge';
import { nightMode } from './nightColors';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

const numStyle = { fontVariantNumeric: 'tabular-nums' as const };

export function DateComplication({ size = 44, now }: { size?: number; now: Date }) {
  const day = now.getDate();
  const weekday = WEEKDAYS[now.getDay()] ?? 'MON';

  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <FullRing size={size} progress={day / 31} stroke={size * 0.14}>
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'block',
              color: nightMode.secondary,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 0.6,
            }}
          >
            {weekday}
          </span>
          <span
            style={{
              display: 'block',
              color: nightMode.primary,
              fontSize: size * 0.3,
              fontWeight: 600,
              marginTop: -1,
              ...numStyle,
            }}
          >
            {day}
          </span>
        </div>
      </FullRing>
      <div style={{ height: 14, marginTop: 2 }} />
    </div>
  );
}

export function BatteryComplication({ size = 44, percent = 86 }: { size?: number; percent?: number }) {
  const bodyW = size * 0.44;
  const bodyH = size * 0.28;
  const tipW = size * 0.08;
  const fillW = Math.max(3, (bodyW - 6) * Math.min(1, Math.max(0, percent / 100)));

  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <FullRing size={size} progress={percent / 100} stroke={size * 0.14}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: bodyW,
              height: bodyH,
              borderRadius: 4,
              border: `2.4px solid ${nightMode.primary}`,
              display: 'flex',
              alignItems: 'center',
              paddingInline: 2.5,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: fillW,
                height: bodyH - 7,
                borderRadius: 2,
                backgroundColor: nightMode.primary,
              }}
            />
          </div>
          <div
            style={{
              width: tipW,
              height: bodyH * 0.5,
              marginLeft: 1.5,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: nightMode.primary,
            }}
          />
        </div>
      </FullRing>
      <div style={{ height: 14, marginTop: 2 }} />
    </div>
  );
}

export function SunsetComplication({ size = 44, label }: { size?: number; label: string }) {
  const cx = size / 2;
  const sunR = size * 0.15;
  const stroke = Math.max(2.6, size * 0.06);

  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={cx}
          cy={cx}
          r={(size - stroke) / 2}
          stroke={nightMode.primary}
          strokeWidth={stroke}
          fill="none"
        />
        <circle cx={cx} cy={size * 0.42} r={sunR} fill={nightMode.primary} />
        <line
          x1={size * 0.2}
          y1={size * 0.62}
          x2={size * 0.8}
          y2={size * 0.62}
          stroke={nightMode.primary}
          strokeWidth={2.8}
          strokeLinecap="round"
        />
        <path
          d={`M ${size * 0.2} ${size * 0.62} Q ${cx} ${size * 0.8} ${size * 0.8} ${size * 0.62}`}
          stroke={nightMode.secondary}
          strokeWidth={2}
          fill="none"
        />
      </svg>
      <div style={{ height: 14, marginTop: 2 }}>
        <span
          style={{
            color: nightMode.primary,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 0.2,
            ...numStyle,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export function NoiseComplication({ size = 44, db = 42 }: { size?: number; db?: number }) {
  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <FullRing size={size} progress={Math.min(1, db / 100)} stroke={size * 0.14}>
        <div style={{ textAlign: 'center' }}>
          <svg width={size * 0.42} height={size * 0.3} aria-hidden="true">
            <rect x={0} y={size * 0.1} width={4} height={size * 0.14} fill={nightMode.primary} rx={1.5} />
            <rect x={7} y={size * 0.04} width={4} height={size * 0.22} fill={nightMode.primary} rx={1.5} />
            <rect x={14} y={0} width={4} height={size * 0.3} fill={nightMode.secondary} rx={1.5} />
          </svg>
          <span
            style={{
              display: 'block',
              color: nightMode.primary,
              fontSize: 11,
              fontWeight: 700,
              marginTop: 1,
              ...numStyle,
            }}
          >
            {db}
          </span>
        </div>
      </FullRing>
      <div style={{ height: 14, marginTop: 2 }} />
    </div>
  );
}
