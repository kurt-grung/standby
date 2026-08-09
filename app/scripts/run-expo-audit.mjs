import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const expectedDoctorWarning = 'non-CNG project';

function runStep(label, command) {
  console.log(`\n→ ${label}`);
  execSync(command, { cwd: appRoot, stdio: 'inherit' });
}

function runExpoDoctor() {
  console.log('\n→ Expo doctor');
  try {
    execSync('npx expo-doctor', {
      cwd: appRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return;
  } catch (error) {
    const output = `${error.stdout ?? ''}\n${error.stderr ?? ''}`;
    const failedChecks = [...output.matchAll(/(\d+)\/(\d+) checks passed/g)].at(-1);
    const failedCount = failedChecks ? Number(failedChecks[2]) - Number(failedChecks[1]) : null;
    const onlyPrebuildWarning =
      failedCount === 1 &&
      output.includes(expectedDoctorWarning) &&
      output.includes('1 checks failed');

    if (onlyPrebuildWarning) {
      process.stdout.write(output);
      console.warn(
        'Expo doctor: expected prebuild/CNG warning for committed ios/ — continuing audit.',
      );
      return;
    }

    process.stdout.write(error.stdout ?? '');
    process.stderr.write(error.stderr ?? '');
    process.exit(typeof error.status === 'number' ? error.status : 1);
  }
}

runStep('Typecheck', 'npx tsc --noEmit');
runStep('Expo compat', 'node scripts/check-expo-compat.mjs');
runExpoDoctor();

const exportDir = mkdtempSync(join(tmpdir(), 'standby-audit-export-'));
try {
  runStep('iOS bundle export', `npx expo export --platform ios --output-dir "${exportDir}"`);
} finally {
  rmSync(exportDir, { recursive: true, force: true });
}

console.log('\nAudit passed.');
