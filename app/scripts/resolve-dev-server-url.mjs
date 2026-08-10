import { execSync } from 'node:child_process';
import { networkInterfaces } from 'node:os';

function resolvePort(port = process.env.EXPO_PORT) {
  return port ?? '8081';
}

function readLanAddress() {
  for (const interfaceName of ['en0', 'en1', 'en2']) {
    try {
      const address = execSync(`ipconfig getifaddr ${interfaceName}`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();

      if (address) {
        return address;
      }
    } catch {}
  }

  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        return entry.address;
      }
    }
  }

  return null;
}

export function resolveDevServerUrl({ port = resolvePort(), preferLan = true } = {}) {
  const lanAddress = readLanAddress();

  if (preferLan && lanAddress) {
    return `http://${lanAddress}:${port}`;
  }

  return `http://127.0.0.1:${port}`;
}

export function resolvePackagerHostname({ preferLan = true } = {}) {
  const lanAddress = readLanAddress();

  if (preferLan && lanAddress) {
    return lanAddress;
  }

  return '127.0.0.1';
}

export function devClientDeepLink(metroUrl, scheme = 'exp+standby') {
  return `${scheme}://expo-development-client/?url=${encodeURIComponent(metroUrl)}`;
}
