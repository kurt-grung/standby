import { useEffect, useMemo, useState } from 'react';

import { nightMode } from './nightColors';

const TICK_COUNT = 60;
const SECONDS = 60;
const FINE_PER_SECOND = TICK_COUNT / SECONDS;
const BEZEL_FRAME_MS = 1000 / 30;

type SecondsBezelProps = {
  width: number;
  height: number;
  inset?: number;
  cornerRadius?: number;
};

type Point = { x: number; y: number };

type Tick = {
  outer: Point;
  inner: Point;
  kind: 'major' | 'second' | 'fine';
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pointOnRoundedRect(
  distance: number,
  left: number,
  top: number,
  right: number,
  bottom: number,
  radius: number,
  perimeter: number,
): { point: Point; normal: Point } {
  const straightW = Math.max(0, right - left - 2 * radius);
  const straightH = Math.max(0, bottom - top - 2 * radius);
  const arc = (Math.PI * radius) / 2;
  const topLen = straightW / 2;
  const segments = [topLen, arc, straightH, arc, straightW, arc, straightH, arc, topLen] as const;

  let remaining = ((distance % perimeter) + perimeter) % perimeter;
  let segmentIndex = 0;
  while (segmentIndex < segments.length - 1 && remaining >= segments[segmentIndex]) {
    remaining -= segments[segmentIndex];
    segmentIndex += 1;
  }

  const cxRight = right - radius;
  const cxLeft = left + radius;
  const cyTop = top + radius;
  const cyBottom = bottom - radius;

  switch (segmentIndex) {
    case 0: {
      const x = left + radius + straightW / 2 + remaining;
      return { point: { x, y: top }, normal: { x: 0, y: 1 } };
    }
    case 1: {
      const t = remaining / Math.max(arc, 0.0001);
      const angle = -Math.PI / 2 + t * (Math.PI / 2);
      return {
        point: {
          x: cxRight + Math.cos(angle) * radius,
          y: cyTop + Math.sin(angle) * radius,
        },
        normal: { x: -Math.cos(angle), y: -Math.sin(angle) },
      };
    }
    case 2: {
      const y = top + radius + remaining;
      return { point: { x: right, y }, normal: { x: -1, y: 0 } };
    }
    case 3: {
      const t = remaining / Math.max(arc, 0.0001);
      const angle = t * (Math.PI / 2);
      return {
        point: {
          x: cxRight + Math.cos(angle) * radius,
          y: cyBottom + Math.sin(angle) * radius,
        },
        normal: { x: -Math.cos(angle), y: -Math.sin(angle) },
      };
    }
    case 4: {
      const x = right - radius - remaining;
      return { point: { x, y: bottom }, normal: { x: 0, y: -1 } };
    }
    case 5: {
      const t = remaining / Math.max(arc, 0.0001);
      const angle = Math.PI / 2 + t * (Math.PI / 2);
      return {
        point: {
          x: cxLeft + Math.cos(angle) * radius,
          y: cyBottom + Math.sin(angle) * radius,
        },
        normal: { x: -Math.cos(angle), y: -Math.sin(angle) },
      };
    }
    case 6: {
      const y = bottom - radius - remaining;
      return { point: { x: left, y }, normal: { x: 1, y: 0 } };
    }
    case 7: {
      const t = remaining / Math.max(arc, 0.0001);
      const angle = Math.PI + t * (Math.PI / 2);
      return {
        point: {
          x: cxLeft + Math.cos(angle) * radius,
          y: cyTop + Math.sin(angle) * radius,
        },
        normal: { x: -Math.cos(angle), y: -Math.sin(angle) },
      };
    }
    default: {
      const x = left + radius + remaining;
      return { point: { x, y: top }, normal: { x: 0, y: 1 } };
    }
  }
}

function tickKind(index: number): Tick['kind'] {
  if (index % (FINE_PER_SECOND * 5) === 0) return 'major';
  if (index % FINE_PER_SECOND === 0) return 'second';
  return 'fine';
}

function tickLength(kind: Tick['kind']) {
  if (kind === 'major') return 12;
  if (kind === 'second') return 8.5;
  return 5;
}

function tickStroke(kind: Tick['kind']) {
  if (kind === 'major') return 2.8;
  if (kind === 'second') return 2.2;
  return 1.7;
}

function buildGeometry(width: number, height: number, inset: number, cornerRadius: number) {
  const left = inset;
  const top = inset;
  const right = width - inset;
  const bottom = height - inset;
  const maxRadius = Math.min((right - left) / 2, (bottom - top) / 2) - 0.5;
  const radius = clamp(cornerRadius, 12, maxRadius);
  const straightW = Math.max(0, right - left - 2 * radius);
  const straightH = Math.max(0, bottom - top - 2 * radius);
  const perimeter = 2 * straightW + 2 * straightH + 2 * Math.PI * radius;

  const ticks: Tick[] = Array.from({ length: TICK_COUNT }, (_, index) => {
    const distance = (index / TICK_COUNT) * perimeter;
    const { point, normal } = pointOnRoundedRect(
      distance,
      left,
      top,
      right,
      bottom,
      radius,
      perimeter,
    );
    const kind = tickKind(index);
    const length = tickLength(kind);
    return {
      kind,
      outer: point,
      inner: {
        x: point.x + normal.x * length,
        y: point.y + normal.y * length,
      },
    };
  });

  return { ticks, perimeter, left, top, right, bottom, radius };
}

function readSubSecondClock() {
  const now = new Date();
  return now.getSeconds() + now.getMilliseconds() / 1000;
}

export function SecondsBezel({ width, height, inset = 1.5, cornerRadius = 34 }: SecondsBezelProps) {
  const [seconds, setSeconds] = useState(readSubSecondClock);

  useEffect(() => {
    let frameId = 0;
    let lastFrame = 0;

    const tick = (timestamp: number) => {
      if (timestamp - lastFrame >= BEZEL_FRAME_MS) {
        lastFrame = timestamp;
        setSeconds(readSubSecondClock());
      }
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const geometry = useMemo(() => {
    if (width < 40 || height < 40) {
      return null;
    }
    return buildGeometry(width, height, inset, cornerRadius);
  }, [width, height, inset, cornerRadius]);

  if (!geometry) {
    return null;
  }

  const progress = ((seconds % SECONDS) + SECONDS) % SECONDS;
  const activeTick = (progress / SECONDS) * TICK_COUNT;
  const head = pointOnRoundedRect(
    (progress / SECONDS) * geometry.perimeter,
    geometry.left,
    geometry.top,
    geometry.right,
    geometry.bottom,
    geometry.radius,
    geometry.perimeter,
  );
  const headOuter = {
    x: head.point.x - head.normal.x * 1.2,
    y: head.point.y - head.normal.y * 1.2,
  };
  const headInner = {
    x: head.point.x + head.normal.x * 15,
    y: head.point.y + head.normal.y * 15,
  };

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg width={width} height={height} aria-hidden="true">
        <defs>
          <radialGradient id="secondGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <stop offset="0%" stopColor={nightMode.primary} stopOpacity="1" />
            <stop offset="35%" stopColor={nightMode.primary} stopOpacity="0.55" />
            <stop offset="70%" stopColor={nightMode.primary} stopOpacity="0.18" />
            <stop offset="100%" stopColor={nightMode.primary} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="secondGlowSoft" cx="50%" cy="50%" rx="50%" ry="50%">
            <stop offset="0%" stopColor={nightMode.primary} stopOpacity="0.45" />
            <stop offset="55%" stopColor={nightMode.primary} stopOpacity="0.12" />
            <stop offset="100%" stopColor={nightMode.primary} stopOpacity="0" />
          </radialGradient>
        </defs>

        {geometry.ticks.map((tick, index) => {
          const lit = index <= activeTick;
          const age = lit ? activeTick - index : 0;
          const trail = lit ? Math.max(0.28, 1 - age / 15) : 0;
          const pending = tick.kind === 'major' ? 0.4 : tick.kind === 'second' ? 0.28 : 0.16;
          const litBase = tick.kind === 'major' ? 1 : tick.kind === 'second' ? 0.92 : 0.8;
          const opacity = lit ? litBase * trail : pending;

          return (
            <line
              key={`track-${index}`}
              x1={tick.outer.x}
              y1={tick.outer.y}
              x2={tick.inner.x}
              y2={tick.inner.y}
              stroke={nightMode.primary}
              strokeWidth={tickStroke(tick.kind)}
              strokeLinecap="butt"
              opacity={opacity}
            />
          );
        })}

        <circle
          cx={head.point.x + head.normal.x * 2}
          cy={head.point.y + head.normal.y * 2}
          r={22}
          fill="url(#secondGlowSoft)"
        />
        <circle
          cx={head.point.x + head.normal.x}
          cy={head.point.y + head.normal.y}
          r={12}
          fill="url(#secondGlow)"
        />
        <line
          x1={headOuter.x}
          y1={headOuter.y}
          x2={headInner.x}
          y2={headInner.y}
          stroke={nightMode.primary}
          strokeWidth={5.5}
          strokeLinecap="butt"
          opacity={0.4}
        />
        <line
          x1={headOuter.x}
          y1={headOuter.y}
          x2={headInner.x}
          y2={headInner.y}
          stroke={nightMode.primary}
          strokeWidth={3.6}
          strokeLinecap="butt"
          opacity={1}
        />
        <circle
          cx={head.point.x + head.normal.x * 2}
          cy={head.point.y + head.normal.y * 2}
          r={2.8}
          fill={nightMode.primary}
        />
      </svg>
    </div>
  );
}
