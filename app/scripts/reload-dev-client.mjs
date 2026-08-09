import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const port = process.env.EXPO_PORT ?? '8081';
const root = path.dirname(fileURLToPath(import.meta.url));
const configSource = readFileSync(path.join(root, '../app.config.ts'), 'utf8');
const bundleIdMatch = configSource.match(/bundleIdentifier:\s*['"]([^'"]+)['"]/);
const bundleId = bundleIdMatch?.[1] ?? 'com.kurtgrung.standby';

async function metroRunning() {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/status`);
    return response.ok;
  } catch {
    return false;
  }
}

function relaunchBootedSimulators() {
  let relaunched = 0;
  try {
    const raw = execSync('xcrun simctl list devices booted -j', { encoding: 'utf8' });
    const { devices } = JSON.parse(raw);
    for (const runtimeDevices of Object.values(devices)) {
      for (const device of runtimeDevices) {
        if (device.state !== 'Booted') continue;
        try {
          execSync(`xcrun simctl terminate ${device.udid} ${bundleId}`, { stdio: 'ignore' });
        } catch {}
        try {
          execSync(`xcrun simctl launch ${device.udid} ${bundleId}`, { stdio: 'ignore' });
          relaunched += 1;
        } catch {}
      }
    }
  } catch {}
  return relaunched;
}

if (!(await metroRunning())) {
  console.log(`Metro not running on port ${port}; reload skipped.`);
  process.exit(0);
}

try {
  await fetch(`http://127.0.0.1:${port}/reload`, { method: 'POST' });
} catch {}

const relaunched = relaunchBootedSimulators();
if (relaunched > 0) {
  console.log(
    `Reloaded dev client via Metro on port ${port} (relaunched ${relaunched} simulator).`,
  );
} else {
  console.log(`Reloaded dev client via Metro on port ${port}.`);
}
