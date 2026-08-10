import { StatusBar } from 'expo-status-bar';

import { ScreenShell } from '../../../ui/ScreenShell';
import { SettingsPanel } from '../../../ui/SettingsPanel';
import { groupedScreenPadding } from '../../../theme/groupedLayout';
import { useAppChrome } from '../../../theme/useAppChrome';

export default function SettingsScreen() {
  const chrome = useAppChrome();

  return (
    <>
      <StatusBar style={chrome.statusBar} />
      <ScreenShell contentClassName={groupedScreenPadding}>
        <SettingsPanel />
      </ScreenShell>
    </>
  );
}
