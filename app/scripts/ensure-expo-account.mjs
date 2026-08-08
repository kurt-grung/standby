import { execSync } from 'node:child_process';

const EXPECTED_OWNER = 'kurtgrung';
const EXPECTED_SLUG = 'standby';
const EXPECTED_PROJECT_ID = 'c112d885-1090-4f24-81fc-74ec7a64ad98';
const ACCOUNT_URL = 'https://expo.dev/accounts/kurtgrung';
const PROJECT_URL = 'https://expo.dev/accounts/kurtgrung/projects/standby';

function readWhoami() {
  try {
    return execSync('npx expo whoami', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
      .trim()
      .split('\n')
      .at(-1)
      ?.trim();
  } catch {
    return null;
  }
}

const whoami = readWhoami();
if (whoami !== EXPECTED_OWNER) {
  console.error(
    `Expo CLI must be logged in as "${EXPECTED_OWNER}" (${ACCOUNT_URL}). Current: ${whoami ?? 'not logged in'}.`,
  );
  process.exit(1);
}

const configJson = execSync('npx expo config --type public --json', {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
const config = JSON.parse(configJson);

if (config.owner !== EXPECTED_OWNER || config.slug !== EXPECTED_SLUG) {
  console.error(
    `App config must use owner "${EXPECTED_OWNER}" and slug "${EXPECTED_SLUG}" (${PROJECT_URL}).`,
  );
  process.exit(1);
}

if (config.extra?.eas?.projectId !== EXPECTED_PROJECT_ID) {
  console.error(`App config projectId must match ${PROJECT_URL}.`);
  process.exit(1);
}
