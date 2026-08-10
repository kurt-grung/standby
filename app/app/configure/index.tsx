import { StatusBar } from 'expo-status-bar';

import { WidgetConfigurePanel } from '../../ui/WidgetConfigurePanel';

export default function ConfigureScreen() {
  return (
    <>
      <StatusBar style="light" />
      <WidgetConfigurePanel />
    </>
  );
}
