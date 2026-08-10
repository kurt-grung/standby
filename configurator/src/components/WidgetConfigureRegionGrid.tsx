import { widgetConfigureSlotCells } from '../lib/widgetConfigureLayout';
import './WidgetConfigureRegionGrid.css';

const guideStroke = 'rgba(255,255,255,0.32)';
const guideDotGap = 7;
const guideStrokeWidth = 1.5;

type WidgetConfigureRegionGridProps = {
  size: number;
};

export function WidgetConfigureRegionGrid({ size }: WidgetConfigureRegionGridProps) {
  const cells = widgetConfigureSlotCells(size);

  return (
    <svg
      className="configure-grid"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {cells.map(({ slot, left, top, width, height }) => (
        <rect
          key={slot}
          x={left}
          y={top}
          width={width}
          height={height}
          fill="none"
          stroke={guideStroke}
          strokeWidth={guideStrokeWidth}
          strokeDasharray={`0 ${guideDotGap}`}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
