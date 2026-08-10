import { StatusBar } from 'expo-status-bar';

import { BrandPanel } from '../../../ui/BrandPanel';
import { ScreenShell } from '../../../ui/ScreenShell';
import { SettingsSubpageHeader } from '../../../ui/SettingsSubpageHeader';
import { groupedScreenPadding } from '../../../theme/groupedLayout';
import { useAppChrome } from '../../../theme/useAppChrome';

export default function BrandingScreen() {
  const chrome = useAppChrome();

  return (
    <>
      <StatusBar style={chrome.statusBar} />
      <ScreenShell contentClassName={groupedScreenPadding}>
        <SettingsSubpageHeader title="Branding" />
        <BrandPanel showPageTitle={false} />
      </ScreenShell>
    </>
  );
}
