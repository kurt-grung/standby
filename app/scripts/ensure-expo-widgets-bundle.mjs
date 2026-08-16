import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const buildScript = join(appRoot, 'node_modules/expo-widgets/scripts/build-bundle.mjs');

if (!existsSync(buildScript)) {
  console.error(`Missing ${buildScript}`);
  process.exit(1);
}

const result = spawnSync(process.execPath, [buildScript, appRoot], {
  cwd: appRoot,
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('ExpoWidgets.bundle built for widget extension');
