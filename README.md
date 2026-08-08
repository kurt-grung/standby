# StandBy+

Expo React Native app with **Apple Watch Ultra–style Night Mode widgets** for iPhone **StandBy**.

The app lives in [`app/`](./app/).

Built with [`expo-widgets`](https://docs.expo.dev/versions/latest/sdk/widgets/), [`@expo/ui`](https://docs.expo.dev/versions/latest/sdk/ui/swift-ui/), **NativeWind** (Tailwind), and **EAS** — no SwiftUI source to maintain.

## Widgets

| Widget | StandBy sizes | Description |
|--------|---------------|-------------|
| **Ultra Clock** | Small, Medium, Large | Live time, date, and day-progress ring on pure black |
| **Ultra Gauge** | Small, Medium, Large | Circular capacity gauge with Ultra orange accent |

StandBy promotes `systemSmall` and `systemMedium` home-screen widgets when your iPhone is charging in landscape (iOS 17+).

## Requirements

- macOS with Xcode
- iOS 17+ device or simulator
- **Not supported in Expo Go** — use a [development build](https://docs.expo.dev/develop/development-builds/introduction/)

## Run

```bash
make install
make i         # build + run on iOS simulator (same as make ios)
make device    # build + run on connected iPhone (default: K Phone)
```

Override the device name:

```bash
make device IOS_DEVICE="My iPhone"
```

Phone must be USB-connected, unlocked, and trusted in Xcode (**Window → Devices and Simulators**).

Or start Metro only:

```bash
make run
make kill   # stop dev servers
```

## Expo project

- Account: [kurtgrung](https://expo.dev/accounts/kurtgrung)
- Project: [standby](https://expo.dev/accounts/kurtgrung/projects/standby)

Log in as `kurtgrung` before EAS commands (`npx expo login`). Apple Team ID lives in `app/app.config.ts`.

## EAS (cloud builds)

Link the project once:

```bash
make eas-init
```

Then build:

```bash
make eas-build-dev          # simulator dev client
make eas-build-dev-device   # device dev client (widgets)
make eas-build-preview      # internal preview
make eas-build-production   # App Store
make eas-submit             # submit to App Store
```

This runs `expo run:ios`, which prebuilds the native project (including the Widget Extension) and launches the app.

## Add widgets to StandBy

1. Plug in your iPhone and rotate to **landscape**.
2. StandBy appears automatically (Settings → StandBy to enable).
3. Long-press → **Edit** → add **Ultra Clock** or **Ultra Gauge**.
4. In StandBy appearance settings, pick **Night** (red tint) or **Mono** for the classic Ultra night look.

You can also add the widgets to the Home Screen; they appear in StandBy automatically.

## Customize the gauge

Open the app to:

- Switch gauge labels (Day / Energy / Focus)
- Set a manual value, or leave **Auto** to track day progress
- Refresh the 24-hour widget timeline

## Project layout

```
standby/
└── app/
    ├── app/
    │   ├── index.tsx              # Home screen
    │   └── ui.tsx                 # Design system (/ui)
    ├── assets/icon.png            # App icon
    ├── components/                # Shared UI components
    ├── theme/
    │   ├── themes.ts              # Night, Ultra, Mono, Graphite
    │   └── ThemeContext.tsx       # Theme provider
    └── widgets/                   # StandBy widget UIs
```
