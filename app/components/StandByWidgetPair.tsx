import { View } from 'react-native';

import { useLiveClock } from '../hooks/useLiveClock';
import { standByWidgetGap } from '../theme/standByPreviewLayout';
import { ModularUltraFace } from './ultra/ModularUltraFace';
import { StatusGaugeFace } from './ultra/StatusGaugeFace';

type StandByWidgetPairProps = {
  size: number;
  gaugeValue?: number;
  gap?: number;
};

export function StandByWidgetPair({
  size,
  gaugeValue = 0,
  gap = standByWidgetGap,
}: StandByWidgetPairProps) {
  const now = useLiveClock();

  if (size <= 0) return null;

  return (
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
      <View style={{ width: gap }} />
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
  );
}
