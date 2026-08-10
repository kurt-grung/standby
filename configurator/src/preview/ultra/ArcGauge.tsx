import type { CSSProperties, ReactNode } from 'react';

import { nightMode } from './nightColors';

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, radius, endAngle);
  const end = polar(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

type ArcGaugeProps = {
  size: number;
  progress: number;
  stroke?: number;
  startAngle?: number;
  sweepAngle?: number;
  trackColor?: string;
  progressColor?: string;
  bottomClearance?: number;
  children?: ReactNode;
};

export function ArcGauge({
  size,
  progress,
  stroke = 5.5,
  startAngle = -210,
  sweepAngle = 240,
  trackColor = nightMode.track,
  progressColor = nightMode.primary,
  bottomClearance = 0,
  children,
}: ArcGaugeProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - stroke) / 2;
  const endAngle = startAngle + sweepAngle * clamped;

  return (
    <div style={{ width: size, height: size + bottomClearance, textAlign: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <path
            d={describeArc(cx, cy, radius, startAngle, startAngle + sweepAngle)}
            stroke={trackColor}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
          />
          {clamped > 0.01 ? (
            <path
              d={describeArc(cx, cy, radius, startAngle, endAngle)}
              stroke={progressColor}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
            />
          ) : null}
        </svg>
        {children ? <div className="arc-gauge__content">{children}</div> : null}
      </div>
    </div>
  );
}

type FullRingProps = {
  size: number;
  progress: number;
  stroke?: number;
  children?: ReactNode;
};

export function FullRing({ size, progress, stroke = 5.5, children }: FullRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
        <circle cx={cx} cy={cy} r={radius} stroke={nightMode.track} strokeWidth={stroke} fill="none" />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={nightMode.primary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference * clamped} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      {children ? <div className="arc-gauge__content">{children}</div> : null}
    </div>
  );
}

type TempComplicationProps = {
  size: number;
  value: number;
  low: number;
  high: number;
};

const numStyle: CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
};

export function TempComplication({ size, value, low, high }: TempComplicationProps) {
  const progress = (value - low) / Math.max(1, high - low);

  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <ArcGauge size={size} progress={progress} stroke={size * 0.14}>
        <span
          style={{
            color: nightMode.primary,
            fontSize: size * 0.34,
            fontWeight: 600,
            ...numStyle,
          }}
        >
          {value}
        </span>
      </ArcGauge>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: 14,
          paddingInline: 2,
          marginTop: 2,
        }}
      >
        <span style={{ color: nightMode.secondary, fontSize: 9, fontWeight: 700, ...numStyle }}>
          {low}
        </span>
        <span style={{ color: nightMode.secondary, fontSize: 9, fontWeight: 700, ...numStyle }}>
          {high}
        </span>
      </div>
    </div>
  );
}

type UvComplicationProps = {
  size: number;
  value: number;
};

export function UvComplication({ size, value }: UvComplicationProps) {
  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <ArcGauge size={size} progress={Math.min(1, value / 11)} stroke={size * 0.14}>
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'block',
              color: nightMode.primary,
              fontSize: size * 0.34,
              fontWeight: 600,
              marginTop: -2,
              ...numStyle,
            }}
          >
            {value}
          </span>
          <span
            style={{
              display: 'block',
              width: size * 0.2,
              height: size * 0.2,
              borderRadius: size,
              backgroundColor: nightMode.primary,
              margin: '1px auto 0',
            }}
          />
        </div>
      </ArcGauge>
      <div style={{ height: 14, marginTop: 2 }} />
    </div>
  );
}
