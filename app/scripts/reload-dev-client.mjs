import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ensureDevServer, metroRunning, reloadDevClient } from './metro-dev.mjs';

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

execSync('node scripts/patch-dev-client-url.mjs', { cwd: appRoot, stdio: 'inherit' });

const port = process.env.EXPO_PORT ?? '8081';
const ensureMetro = process.env.EXPO_ENSURE_METRO !== '0';

if (!(await metroRunning(port))) {
  if (!ensureMetro) {
    console.log(`Metro not running on port ${port}; reload skipped.`);
    process.exit(0);
  }

  try {
    const result = await ensureDevServer({ port });
    if (result.started) {
      console.log(`Started Metro on port ${port} (${result.devServerUrl}).`);
    }
  } catch (error) {
    console.log(`Metro not running on port ${port}; reload skipped.`);
    console.log(String(error));
    process.exit(0);
  }
}

const opened = await reloadDevClient({ port });

if (opened > 0) {
  console.log(`Reloaded dev client via Metro on port ${port}.`);
} else {
  console.log(`Reloaded Metro on port ${port}. Run make connect if the dev client is stuck.`);
}
