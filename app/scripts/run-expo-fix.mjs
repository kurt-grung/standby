import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const ignoredDirs = new Set(['node_modules', 'ios', 'android', '.expo', 'dist', 'web-build']);
const reactNavigationImport =
  /(?:import\s+[^'"]+\s+from\s+['"]@react-navigation\/|require\s*\(\s*['"]@react-navigation\/)/;
const codemodPaths = ['app', 'components', 'hooks', 'lib', 'theme', 'widgets'];

function collectSourceFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) {
      continue;
    }

    const path = join(dir, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      collectSourceFiles(path, files);
      continue;
    }

    if (sourceExtensions.has(entry.slice(entry.lastIndexOf('.')))) {
      files.push(path);
    }
  }

  return files;
}

function findReactNavigationImports() {
  const hits = [];

  for (const file of collectSourceFiles(appRoot)) {
    const content = readFileSync(file, 'utf8');
    if (!reactNavigationImport.test(content)) {
      continue;
    }

    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (reactNavigationImport.test(line)) {
        hits.push(`${relative(appRoot, file)}:${index + 1}: ${line.trim()}`);
      }
    });
  }

  return hits;
}

function findReactNavigationDependencies() {
  const pkg = JSON.parse(readFileSync(join(appRoot, 'package.json'), 'utf8'));
  const names = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ];

  return [...new Set(names.filter((name) => name.startsWith('@react-navigation/')))]
    .sort();
}

function runStep(label, command, { allowFailure = false } = {}) {
  console.log(`\n→ ${label}`);
  try {
    execSync(command, { cwd: appRoot, stdio: 'inherit' });
  } catch {
    if (!allowFailure) {
      process.exit(1);
    }
    console.warn(`${label}: skipped or no changes.`);
  }
}

const reactNavigationDeps = findReactNavigationDependencies();
if (reactNavigationDeps.length > 0) {
  runStep(
    'Remove @react-navigation dependencies',
    `npm uninstall ${reactNavigationDeps.join(' ')}`,
  );
}

if (findReactNavigationImports().length > 0) {
  runStep(
    'Expo Router import codemod',
    `npx --yes expo-codemod sdk-56-expo-router-react-navigation-replace ${codemodPaths.join(' ')}`,
  );
}

runStep(
  'Native patches',
  'node scripts/patch-expo-modules-jsi.mjs && node scripts/ensure-ios-bundle-id.mjs && node scripts/patch-widget-container-background.mjs',
);
runStep('Expo dependency versions', 'npx expo install --fix');
runStep('Verify', 'npm run verify');

console.log('\nFix complete.');
