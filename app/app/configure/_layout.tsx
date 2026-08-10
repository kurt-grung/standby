import { Stack } from 'expo-router';

const configureSheetBg = '#000000';

export default function ConfigureLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="picker"
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.48, 0.92],
          sheetInitialDetentIndex: 0,
          sheetCornerRadius: 20,
          contentStyle: { backgroundColor: configureSheetBg },
        }}
      />
    </Stack>
  );
}
