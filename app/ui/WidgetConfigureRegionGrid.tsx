import Svg, { Rect } from 'react-native-svg';
import { StyleSheet } from 'react-native';

import { widgetConfigureSlotCells } from '../lib/widgetConfigureLayout';

const guideStroke = 'rgba(255,255,255,0.32)';
const guideDash = '4 5';

type WidgetConfigureRegionGridProps = {
  size: number;
};

export function WidgetConfigureRegionGrid({ size }: WidgetConfigureRegionGridProps) {
  const cells = widgetConfigureSlotCells(size);

  return (
    <Svg
      width={size}
      height={size}
      style={{ position: 'absolute', left: 0, top: 0 }}
      pointerEvents="none"
    >
      {cells.map(({ slot, left, top, width, height }) => (
        <Rect
          key={slot}
          x={left}
          y={top}
          width={width}
          height={height}
          fill="none"
          stroke={guideStroke}
          strokeWidth={StyleSheet.hairlineWidth}
          strokeDasharray={guideDash}
        />
      ))}
    </Svg>
  );
}
