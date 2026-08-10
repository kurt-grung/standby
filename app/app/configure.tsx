import { StatusBar } from 'expo-status-bar';

import { WidgetConfigurePanel } from '../ui/WidgetConfigurePanel';
import { useAppChrome } from '../theme/useAppChrome';

export default function ConfigureScreen() {
  const chrome = useAppChrome();

  return (
    <>
      <StatusBar style={chrome.statusBar} />
      <WidgetConfigurePanel />
    </>
  );
}
