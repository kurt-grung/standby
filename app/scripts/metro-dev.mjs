import { execSync, spawn } from 'node:child_process';
import { appendFileSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  devClientDeepLink,
  resolveDevServerUrl,
  resolvePackagerHostname,
} from './resolve-dev-server-url.mjs';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(scriptsDir, '..');
const logPath = path.join(appRoot, '.expo-dev-server.log');
const pidPath = path.join(appRoot, '.expo-dev-server.pid');

function resolvePort(port = process.env.EXPO_PORT) {
  return port ?? '8081';
}

function readBundleId() {
  const configSource = readFileSync(path.join(appRoot, 'app.config.ts'), 'utf8');
  const bundleIdMatch = configSource.match(/bundleIdentifier:\s*['"]([^'"]+)['"]/);
  return bundleIdMatch?.[1] ?? 'com.kurtgrung.standby';
}

export async function metroRunning(port = resolvePort()) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/status`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function waitForMetro(port = resolvePort(), maxMs = 60_000) {
  const started = Date.now();

  while (Date.now() - started < maxMs) {
    if (await metroRunning(port)) {
      return true;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
  }

  return false;
}

export function openDevClientDeepLink(metroUrl = resolveDevServerUrl()) {
  const deepLink = devClientDeepLink(metroUrl);
  let opened = 0;

  try {
    execSync(`xcrun simctl openurl booted "${deepLink}"`, { stdio: 'ignore' });
    opened += 1;
  } catch {}

  return { deepLink, metroUrl, opened };
}

export function openPhysicalDeviceDeepLink(
  metroUrl = resolveDevServerUrl(),
  deviceName = process.env.IOS_DEVICE,
  bundleId = readBundleId(),
) {
  if (!deviceName) {
    return { deepLink: devClientDeepLink(metroUrl), opened: 0 };
  }

  const deepLink = devClientDeepLink(metroUrl);

  try {
    execSync(
      `xcrun devicectl device process launch --device "${deviceName}" --payload-url "${deepLink}" ${bundleId}`,
      { stdio: 'ignore' },
    );
    return { deepLink, opened: 1 };
  } catch {
    return { deepLink, opened: 0 };
  }
}

export function launchBootedSimulators(bundleId = readBundleId()) {
  let launched = 0;

  try {
    const raw = execSync('xcrun simctl list devices booted -j', { encoding: 'utf8' });
    const { devices } = JSON.parse(raw);

    for (const runtimeDevices of Object.values(devices)) {
      for (const device of runtimeDevices) {
        if (device.state !== 'Booted') {
          continue;
        }

        try {
          execSync(`xcrun simctl launch ${device.udid} ${bundleId}`, { stdio: 'ignore' });
          launched += 1;
        } catch {}
      }
    }
  } catch {}

  return launched;
}

export async function ensureDevServer({
  port = resolvePort(),
  openSimulator = process.env.EXPO_OPEN_IOS === '1',
} = {}) {
  const hostname = resolvePackagerHostname();

  if (await metroRunning(port)) {
    return { started: false, port, launched: 0, devServerUrl: resolveDevServerUrl({ port }) };
  }

  appendFileSync(logPath, `\n--- ensureDevServer ${new Date().toISOString()} ---\n`);

  const logFd = openSync(logPath, 'a');
  const child = spawn('npx', ['expo', 'start', '--dev-client', '--port', port, '--lan'], {
    cwd: appRoot,
    detached: true,
    stdio: ['ignore', logFd, logFd],
    env: {
      ...process.env,
      EXPO_PORT: port,
      REACT_NATIVE_PACKAGER_HOSTNAME: hostname,
    },
  });

  child.unref();
  writeFileSync(pidPath, String(child.pid));

  if (!(await waitForMetro(port))) {
    throw new Error(`Metro did not start on port ${port}. See ${logPath}`);
  }

  const devServerUrl = resolveDevServerUrl({ port });
  const launched = openSimulator ? launchBootedSimulators() : 0;

  return { started: true, port, launched, devServerUrl };
}

export async function connectDevClient({
  port = resolvePort(),
  deviceName = process.env.IOS_DEVICE,
} = {}) {
  const devServerUrl = resolveDevServerUrl({ port });
  const { deepLink, opened } = openDevClientDeepLink(devServerUrl);

  if (opened > 0) {
    return { devServerUrl, deepLink, opened };
  }

  const relaunched = launchBootedSimulators();
  if (relaunched > 0) {
    try {
      execSync(`xcrun simctl openurl booted "${deepLink}"`, { stdio: 'ignore' });
      return { devServerUrl, deepLink, opened: 1 };
    } catch {}
  }

  const physical = openPhysicalDeviceDeepLink(devServerUrl, deviceName);
  if (physical.opened > 0) {
    return { devServerUrl, deepLink: physical.deepLink, opened: 1 };
  }

  return { devServerUrl, deepLink, opened: 0 };
}

export async function reloadDevClient({ port = resolvePort() } = {}) {
  try {
    await fetch(`http://127.0.0.1:${port}/reload`, { method: 'POST' });
  } catch {}

  const connected = await connectDevClient({ port });
  return connected.opened;
}
