import { Image, View, type ImageSourcePropType } from 'react-native';

import { standbyConfig, type HomeSceneId } from '../config';
import { groupedSectionSpacing } from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';

const phoneRefSources = {
  'phone-ref-c-nightstand-cable': require('../designs/generations/phone-refs/phone-ref-c-nightstand-cable.png'),
  'phone-ref-n-japanese-minimal': require('../designs/generations/phone-refs/phone-ref-n-japanese-minimal.png'),
  'phone-ref-a-medium-concrete': require('../designs/generations/phone-refs/phone-ref-a-medium-concrete.png'),
  'phone-ref-o-brutalist': require('../designs/generations/phone-refs/phone-ref-o-brutalist.png'),
  'phone-ref-k-red-glow': require('../designs/generations/phone-refs/phone-ref-k-red-glow.png'),
  'phone-ref-m-tech-noir': require('../designs/generations/phone-refs/phone-ref-m-tech-noir.png'),
} satisfies Record<HomeSceneId, ImageSourcePropType>;

function sceneAccessibilityLabel(id: HomeSceneId) {
  return id.replace(/^phone-ref-/, '').replace(/-/g, ' ');
}

export function HomePhoneRefGallery() {
  const chrome = useAppChrome();

  return (
    <View className={groupedSectionSpacing}>
      {standbyConfig.brand.homeScenes.map((id) => (
        <View
          key={id}
          className="mb-3 overflow-hidden rounded-2xl border"
          style={{ borderColor: chrome.colors.border }}
        >
          <Image
            source={phoneRefSources[id]}
            className="w-full"
            style={{ height: standbyConfig.layout.homeSceneHeight }}
            resizeMode="cover"
            accessibilityLabel={sceneAccessibilityLabel(id)}
          />
        </View>
      ))}
    </View>
  );
}
