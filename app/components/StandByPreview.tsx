import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ModularUltraFace } from './ultra/ModularUltraFace';
import { StatusGaugeFace } from './ultra/StatusGaugeFace';
import { nightMode } from './ultra/nightColors';

type StandByPreviewProps = {
  gaugeValue?: number;
  gaugeLabel?: string;
};

export function StandByPreview({ gaugeValue = 0 }: StandByPreviewProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setNow(new Date());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <View className="flex-1 flex-row items-stretch" style={{ backgroundColor: nightMode.bg }}>
      <ModularUltraFace
        now={now}
        temperature={72}
        tempLow={52}
        tempHigh={89}
        uvIndex={5}
        sunsetLabel="7:29PM"
        batteryPercent={86}
      />

      <View className="w-3" />

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
  );
}
