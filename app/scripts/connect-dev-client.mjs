import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { connectDevClient, ensureDevServer, metroRunning } from './metro-dev.mjs';

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

execSync('node scripts/patch-dev-client-url.mjs', { cwd: appRoot, stdio: 'inherit' });

const port = process.env.EXPO_PORT ?? '8081';

if (!(await metroRunning(port))) {
  const result = await ensureDevServer({ port });
  if (result.started) {
    console.log(`Started Metro on port ${port} (${result.devServerUrl}).`);
  }
}

const { devServerUrl, deepLink, opened } = await connectDevClient({ port });

if (opened > 0) {
  console.log(`Connected dev client to ${devServerUrl}`);
} else {
  console.log(`Metro: ${devServerUrl}`);
  console.log(`Deep link: ${deepLink}`);
  if (process.env.IOS_DEVICE) {
    console.log(
      `Could not auto-open on "${process.env.IOS_DEVICE}". Unlock the phone and run make connect again.`,
    );
  } else {
    console.log(
      'Set IOS_DEVICE="Your iPhone" and run make connect to deep-link a physical device.',
    );
  }
}
