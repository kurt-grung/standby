import { useElementSize } from '../hooks/useElementSize';
import {
  homeWidgetPairWidth,
  homeWidgetReferenceSize,
  standByPreviewScale,
  standByWidgetSize,
} from '../lib/standByPreviewLayout';
import { nightMode } from '../lib/standByWidgetShape';
import { StandByWidgetPair } from './StandByWidgetPair';
import './StandByPreview.css';

export function StandByPreview() {
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const displaySize = standByWidgetSize(width, height);
  const scale = standByPreviewScale(displaySize);
  const referenceSize = homeWidgetReferenceSize;
  const referencePairWidth = homeWidgetPairWidth(referenceSize);
  const scaledPairWidth = referencePairWidth * scale;
  const scaledPairHeight = referenceSize * scale;

  return (
    <div
      ref={ref}
      className="standby-preview"
      style={{ backgroundColor: nightMode.bg }}
    >
      {displaySize > 0 ? (
        <div
          className="standby-preview__frame"
          style={{
            width: scaledPairWidth,
            height: scaledPairHeight,
          }}
        >
          <div
            className="standby-preview__scaled"
            style={{
              width: referencePairWidth,
              height: referenceSize,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <StandByWidgetPair size={referenceSize} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
