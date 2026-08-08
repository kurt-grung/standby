import { useEffect, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { ModularUltraFace } from './ultra/ModularUltraFace';
import { StatusGaugeFace } from './ultra/StatusGaugeFace';
import { nightMode } from './ultra/nightColors';

type StandByPreviewProps = {
  gaugeValue?: number;
  gaugeLabel?: string;
};

const WIDGET_GAP = 12;
const OUTER_PAD = 20;

function widgetSize(width: number, height: number) {
  if (width <= 0 || height <= 0) return 0;
  const maxByHeight = height - OUTER_PAD * 2;
  const maxByWidth = (width - OUTER_PAD * 2 - WIDGET_GAP) / 2;
  return Math.floor(Math.min(maxByHeight, maxByWidth));
}

export function StandByPreview({ gaugeValue = 0 }: StandByPreviewProps) {
  const [now, setNow] = useState(() => new Date());
  const [frame, setFrame] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let frameId = 0;
    const tick = () => {
      setNow(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setFrame({ width, height });
  };

  const size = widgetSize(frame.width, frame.height);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: nightMode.bg }}
      onLayout={onLayout}>
      {size > 0 ? (
        <View className="flex-row items-center">
          <View style={{ width: size, height: size }}>
            <ModularUltraFace
              now={now}
              temperature={72}
              tempLow={52}
              tempHigh={89}
              uvIndex={5}
              sunsetLabel="7:29PM"
              batteryPercent={86}
            />
          </View>
          <View style={{ width: WIDGET_GAP }} />
          <View style={{ width: size, height: size }}>
            <StatusGaugeFace
              now={now}
              temperature={68}
              tempLow={49}
              tempHigh={84}
              uvIndex={4}
              sunsetLabel="7:31PM"
              batteryPercent={74}
              noiseDb={38}
              focusPercent={gaugeValue > 0 ? gaugeValue : undefined}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
