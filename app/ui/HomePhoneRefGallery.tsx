import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { standbyConfig, type HomeSceneId } from '../config';
import {
  homeGalleryAutoAdvanceMs,
  homeGalleryCornerRadius,
  homeGalleryDotActiveWidth,
  homeGalleryDotGap,
  homeGalleryDotSize,
  homeGalleryFillFadeMs,
  homeGalleryIndicatorTop,
  homeGallerySlideHeight,
} from '../theme/homeGalleryLayout';
import { groupedSectionSpacing } from '../theme/groupedLayout';
import { useAppChrome } from '../theme/useAppChrome';

const scenes = standbyConfig.brand.homeScenes;

function loopedGalleryScenes(items: readonly HomeSceneId[]) {
  if (items.length <= 1) {
    return items;
  }

  const last = items[items.length - 1];
  const first = items[0];
  return [last, ...items, first] as const;
}

function galleryLogicalIndex(extendedIndex: number, sceneCount: number) {
  if (sceneCount <= 1) {
    return 0;
  }

  if (extendedIndex === 0) {
    return sceneCount - 1;
  }

  if (extendedIndex === sceneCount + 1) {
    return 0;
  }

  return extendedIndex - 1;
}

const loopedScenes = loopedGalleryScenes(scenes);

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

type GalleryIndicatorProps = {
  count: number;
  activeIndex: number;
  advanceEpoch: number;
};

type ActiveIndicatorPillProps = {
  activeIndex: number;
  advanceEpoch: number;
};

function ActiveIndicatorPill({ activeIndex, advanceEpoch }: ActiveIndicatorPillProps) {
  const chrome = useAppChrome();
  const progress = useSharedValue(0);
  const fillOpacity = useSharedValue(1);
  const pillRadius = homeGalleryDotSize / 2;

  useEffect(() => {
    progress.value = 0;
    fillOpacity.value = 1;
    progress.value = withTiming(1, { duration: homeGalleryAutoAdvanceMs }, (finished) => {
      if (finished) {
        fillOpacity.value = withTiming(0, { duration: homeGalleryFillFadeMs });
      }
    });
  }, [activeIndex, advanceEpoch, fillOpacity, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: homeGalleryDotActiveWidth * progress.value,
    opacity: fillOpacity.value,
  }));

  return (
    <View
      style={{
        width: homeGalleryDotActiveWidth,
        height: homeGalleryDotSize,
        borderRadius: pillRadius,
        backgroundColor: chrome.colors.track,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            height: homeGalleryDotSize,
            borderRadius: pillRadius,
            backgroundColor: chrome.colors.primary,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

function GalleryIndicator({ count, activeIndex, advanceEpoch }: GalleryIndicatorProps) {
  const chrome = useAppChrome();
  const dotRadius = homeGalleryDotSize / 2;

  if (count <= 1) {
    return null;
  }

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={`Scene ${activeIndex + 1} of ${count}`}
      accessibilityValue={{ text: `${activeIndex + 1} of ${count}` }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: homeGalleryDotGap,
        marginTop: homeGalleryIndicatorTop,
      }}
    >
      {Array.from({ length: count }, (_, index) => {
        if (index === activeIndex) {
          return (
            <ActiveIndicatorPill
              key={scenes[index]}
              activeIndex={activeIndex}
              advanceEpoch={advanceEpoch}
            />
          );
        }

        return (
          <View
            key={scenes[index]}
            style={{
              width: homeGalleryDotSize,
              height: homeGalleryDotSize,
              borderRadius: dotRadius,
              backgroundColor: chrome.colors.muted,
              opacity: 0.28,
            }}
          />
        );
      })}
    </View>
  );
}

export function HomePhoneRefGallery() {
  const chrome = useAppChrome();
  const listRef = useRef<FlatList<HomeSceneId>>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [advanceEpoch, setAdvanceEpoch] = useState(0);
  const extendedIndexRef = useRef(scenes.length <= 1 ? 0 : 1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    setSlideWidth(event.nativeEvent.layout.width);
  };

  const scrollToExtendedIndex = useCallback(
    (index: number, animated: boolean) => {
      if (slideWidth <= 0) {
        return;
      }

      listRef.current?.scrollToOffset({ offset: index * slideWidth, animated });
    },
    [slideWidth],
  );

  const settleExtendedIndex = useCallback(
    (index: number) => {
      if (scenes.length <= 1) {
        extendedIndexRef.current = 0;
        setActiveIndex(0);
        return;
      }

      let settled = index;

      if (settled === 0) {
        settled = scenes.length;
        scrollToExtendedIndex(settled, false);
      } else if (settled === scenes.length + 1) {
        settled = 1;
        scrollToExtendedIndex(settled, false);
      }

      const logical = galleryLogicalIndex(settled, scenes.length);
      extendedIndexRef.current = settled;
      setActiveIndex(logical);
    },
    [scrollToExtendedIndex],
  );

  const restartAutoAdvance = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setAdvanceEpoch((epoch) => epoch + 1);

    if (scenes.length <= 1) {
      return;
    }

    timerRef.current = setInterval(() => {
      scrollToExtendedIndex(extendedIndexRef.current + 1, true);
    }, homeGalleryAutoAdvanceMs);
  }, [scrollToExtendedIndex]);

  useEffect(() => {
    if (slideWidth <= 0 || scenes.length <= 1) {
      return;
    }

    scrollToExtendedIndex(1, false);
    extendedIndexRef.current = 1;
    setActiveIndex(0);
  }, [slideWidth, scrollToExtendedIndex]);

  useEffect(() => {
    restartAutoAdvance();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [restartAutoAdvance]);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (slideWidth <= 0) {
      return;
    }

    const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    settleExtendedIndex(index);
  };

  const renderSlide = ({ item: id }: { item: HomeSceneId }) => (
    <View
      style={{
        width: slideWidth,
        height: homeGallerySlideHeight,
        overflow: 'hidden',
        borderRadius: homeGalleryCornerRadius,
        borderWidth: 1,
        borderColor: chrome.colors.border,
      }}
    >
      <Image
        source={phoneRefSources[id]}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        accessibilityLabel={sceneAccessibilityLabel(id)}
      />
    </View>
  );

  return (
    <View className={groupedSectionSpacing} onLayout={onLayout}>
      {slideWidth > 0 ? (
        <>
          <FlatList
            ref={listRef}
            data={loopedScenes}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            keyExtractor={(id, index) => `${id}-${index}`}
            renderItem={renderSlide}
            getItemLayout={(_, index) => ({
              length: slideWidth,
              offset: slideWidth * index,
              index,
            })}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScrollBeginDrag={restartAutoAdvance}
            accessibilityLabel="StandBy scene gallery"
          />
          <GalleryIndicator
            count={scenes.length}
            activeIndex={activeIndex}
            advanceEpoch={advanceEpoch}
          />
        </>
      ) : null}
    </View>
  );
}
