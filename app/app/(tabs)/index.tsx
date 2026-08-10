import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { AppWordmarkHeader, StickyWordmarkPlus } from '../../ui/AppWordmarkHeader';
import { useLiveClock } from '../../hooks/useLiveClock';
import { ScreenShell } from '../../ui/ScreenShell';
import { HomePhoneRefGallery } from '../../ui/HomePhoneRefGallery';
import { HomeRevealSection } from '../../ui/HomeRevealSection';
import { HomeSetupSection } from '../../ui/HomeSetupSection';
import { HomeWidgetPlaceholder } from '../../ui/HomeWidgetPlaceholder';
import { useWidgetConfig } from '../../theme/WidgetConfigContext';
import { groupedScreenPadding } from '../../theme/groupedLayout';
import { useAppChrome } from '../../theme/useAppChrome';
import { dayProgress } from '../../theme/ultra';

export default function HomeScreen() {
  const chrome = useAppChrome();
  const { gaugeValue } = useWidgetConfig();
  const now = useLiveClock();
  const displayValue = gaugeValue === 0 ? dayProgress(now) : gaugeValue;
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <>
      <StatusBar style={chrome.statusBar} />
      <ScreenShell
        scrollRef={scrollRef}
        scrollOffset={scrollY}
        contentClassName={groupedScreenPadding}
        overlay={<StickyWordmarkPlus scrollRef={scrollRef} scrollY={scrollY} />}
        onScroll={onScroll}
      >
        <HomeRevealSection step={0}>
          <AppWordmarkHeader scrollRef={scrollRef} scrollY={scrollY} />
        </HomeRevealSection>
        <HomeRevealSection step={1}>
          <HomeWidgetPlaceholder gaugeValue={displayValue} />
        </HomeRevealSection>
        <HomeRevealSection step={2}>
          <HomePhoneRefGallery />
        </HomeRevealSection>

        <HomeRevealSection step={3}>
          <HomeSetupSection />
        </HomeRevealSection>
      </ScreenShell>
    </>
  );
}
