import { requireOptionalNativeModule } from 'expo-modules-core';

type DevMenuPreferencesModule = {
  setPreferencesAsync: (settings: Record<string, unknown>) => Promise<void>;
};

export function disableDevToolsButton() {
  const DevMenuPreferences =
    requireOptionalNativeModule<DevMenuPreferencesModule>('DevMenuPreferences');

  void DevMenuPreferences?.setPreferencesAsync({ showFloatingActionButton: false });
}
