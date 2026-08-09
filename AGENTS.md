# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Expo account and project

Use only this Expo account and project for Standby:

- Account: https://expo.dev/accounts/kurtgrung
- Project: https://expo.dev/accounts/kurtgrung/projects/standby

Run Expo/EAS CLI as `kurtgrung`. Do not link the repo to other Expo accounts or projects. Do not run `eas init` unless re-linking to this project (`owner: kurtgrung`, `slug: standby`, project ID `c112d885-1090-4f24-81fc-74ec7a64ad98`).

## After app changes

Run `make verify` before committing app changes (includes auto-reload when Metro is running). Keep `make dev` running in a terminal. A Cursor `stop` hook also reloads the dev client after each agent turn. Before push or dependency/config updates, run `make audit`. After dependency or SDK updates, run `make fix` then `make audit`. Lint touched files and use Expo MCP docs (v57) when unsure. Fix failures before finishing. Install git hooks once with `make hooks`. See `.cursor/rules/app-verify-mcp.mdc`.
