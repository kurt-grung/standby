# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Expo account and project

Use only this Expo account and project for Standby:

- Account: https://expo.dev/accounts/kurtgrung
- Project: https://expo.dev/accounts/kurtgrung/projects/standby

Run Expo/EAS CLI as `kurtgrung`. Do not link the repo to other Expo accounts or projects. Do not run `eas init` unless re-linking to this project (`owner: kurtgrung`, `slug: standby`, project ID `c112d885-1090-4f24-81fc-74ec7a64ad98`).

## Project layout

All paths are under `app/` unless noted.

| Path | Purpose |
|------|---------|
| `app/app/` | Expo Router **screens only** (`index`, `preview`, `ui`, `_layout`) |
| `app/ui/` | **All components** — shared UI, custom components, glass buttons, shells, widget faces (`ui/ultra/`) |
| `app/config.ts` | App identity, Expo/iOS/widget IDs, brand asset tuning (splash size, icon geometry) |
| `app/design-system.ts` | UI tokens — typography, spacing, themes, layout metrics, widget night colors |
| `app/theme/` | Thin re-exports from `design-system.ts` plus `ThemeContext` / `useAppChrome` |
| `app/widgets/` | StandBy widget UIs (Swift UI via expo-widgets) |
| `app/hooks/`, `app/lib/` | Hooks and utilities |
| `app/assets/` | Icons, splash, branding PNGs |
| `app/scripts/` | Asset generation, Expo checks, dev reload |

**Conventions**

- New React components go in `app/ui/`, not `app/components/`.
- Screens import from `../ui/…`, never inline large UI in `app/app/`.
- Tune brand/splash in `config.ts`; tune UI spacing, type, and themes in `design-system.ts`.
- Widget preview surfaces (`StandByPreview`, `nightMode`) stay night-themed; app chrome uses `useAppChrome()` for system light/dark.

## Splash (native + JS loader)

Three surfaces must match at handoff — same trimmed wordmark, same **280pt** width (`brand.splashImageWidth`):

| Surface | Source |
|---------|--------|
| Native launch screen | `ios/StandBy/Images.xcassets/SplashScreenLogo.imageset` |
| Expo splash plugin | `brand.splashDisplay` → `assets/splash-display.png` in `app.config.ts` |
| JS loader overlay | `ui/SplashBrandScreen.tsx` → `splash-display.png` at `splashImageWidth` |

**Do not** use `splash.png` for launch or the loader. That file is the 1024×1024 master with extra canvas padding; native and JS use the trimmed square instead.

**Tune wordmark size** in `config.ts` → `brand.assets`: `splashPointSize`, `splashLogoMaxWidth`. Display width is `brand.splashImageWidth` (must stay aligned across all three surfaces).

**After any splash change**

1. `make brand-assets` — renders `splash.png`, syncs iOS imageset, copies `@3x` → `splash-display.png` (single pipeline; they cannot drift).
2. `make verify` — includes `splash:check` (hashes `splash-display.png` vs iOS `@3x`, wiring in `SplashBrandScreen` + `app.config.ts`).
3. `make ios` or `make device` — native launch screen reads the imageset from the installed build.

**Edit only** `scripts/generate-brand-assets.mjs` → `writeTrimmedSplashSquare` for trim/resize logic; do not hand-edit `splash-display.png` or the imageset PNGs.

## After app changes

Run `make verify` before committing app changes (includes auto-reload when Metro is running). Keep `make dev` running in a terminal. A Cursor `stop` hook also reloads the dev client after each agent turn. Before push or dependency/config updates, run `make audit`. After dependency or SDK updates, run `make fix` then `make audit`. Lint touched files and use Expo MCP docs (v57) when unsure. Fix failures before finishing. Install git hooks once with `make hooks`. See `.cursor/rules/app-verify-mcp.mdc`.
