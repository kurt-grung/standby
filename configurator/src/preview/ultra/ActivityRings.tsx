import { nightMode } from './nightColors';

type ActivityRingsProps = {
  size?: number;
  move?: number;
  exercise?: number;
  stand?: number;
};

export function ActivityRings({
  size = 48,
  move = 0.78,
  exercise = 0.52,
  stand = 0.91,
}: ActivityRingsProps) {
  const cx = size / 2;
  const cy = size / 2;
  const stroke = Math.max(5.5, size * 0.145);
  const gap = stroke + 2.2;

  const rings = [
    { progress: move, radius: (size - stroke) / 2 },
    { progress: exercise, radius: (size - stroke) / 2 - gap },
    { progress: stand, radius: (size - stroke) / 2 - gap * 2 },
  ] as const;

  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <svg width={size} height={size} aria-hidden="true">
        {rings.map((ring) => (
          <circle
            key={ring.radius}
            cx={cx}
            cy={cy}
            r={ring.radius}
            stroke={nightMode.track}
            strokeWidth={stroke}
            fill="none"
          />
        ))}
        {rings.map((ring) => {
          const circumference = 2 * Math.PI * ring.radius;
          const clamped = Math.min(1, Math.max(0, ring.progress));
          return (
            <circle
              key={`p-${ring.radius}`}
              cx={cx}
              cy={cy}
              r={ring.radius}
              stroke={nightMode.primary}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${circumference * clamped} ${circumference}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity={0.85 + clamped * 0.15}
            />
          );
        })}
      </svg>
      <div style={{ height: 14, marginTop: 2 }} />
    </div>
  );
}
