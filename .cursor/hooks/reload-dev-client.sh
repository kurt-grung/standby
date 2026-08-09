#!/usr/bin/env bash
cat >/dev/null
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
if [[ -f "$ROOT/app/package.json" ]]; then
  cd "$ROOT/app" && node scripts/reload-dev-client.mjs
fi
exit 0
