import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { AppWordmarkHeader, StickyWordmarkPlus } from '../../ui/AppWordmarkHeader';
import { GroupedSection, GroupedStepRows } from '../../ui/GroupedSection';
import { useLiveClock } from '../../hooks/useLiveClock';
import { ScreenShell } from '../../ui/ScreenShell';
import { HomePhoneRefGallery } from '../../ui/HomePhoneRefGallery';
import { HomeRevealSection } from '../../ui/HomeRevealSection';
import { HomeWidgetPlaceholder } from '../../ui/HomeWidgetPlaceholder';
import { useWidgetConfig } from '../../theme/WidgetConfigContext';
import { groupedScreenPadding } from '../../theme/groupedLayout';
import { useAppChrome } from '../../theme/useAppChrome';
import { dayProgress } from '../../theme/ultra';

const standBySteps = [
  'Deploy widgets with make standby or make device, then open StandBy+ on your iPhone',
  'Plug in, rotate to landscape, and long-press StandBy',
  'Tap Edit, then add Ultra Clock (left) and Ultra Gauge (right)',
  'Choose Night or Mono in StandBy settings',
] as const;

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

        <GroupedSection
          title="StandBy"
          footer="Add both widgets at the small size — one in each side column."
          className="mb-0"
        >
          <GroupedStepRows steps={standBySteps} />
        </GroupedSection>
      </ScreenShell>
    </>
  );
}
