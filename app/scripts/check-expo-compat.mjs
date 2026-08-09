import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const ignoredDirs = new Set(['node_modules', 'ios', 'android', '.expo', 'dist', 'web-build']);
const reactNavigationImport =
  /(?:import\s+[^'"]+\s+from\s+['"]@react-navigation\/|require\s*\(\s*['"]@react-navigation\/)/;

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
  const names = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})];

  return [...new Set(names.filter((name) => name.startsWith('@react-navigation/')))].sort();
}

const importHits = findReactNavigationImports();
const dependencyHits = findReactNavigationDependencies();
const failures = [];

if (dependencyHits.length > 0) {
  failures.push(
    `Remove direct @react-navigation dependencies from package.json: ${dependencyHits.join(', ')}`,
  );
}

if (importHits.length > 0) {
  failures.push('Replace @react-navigation imports with expo-router entry points:');
  failures.push(...importHits.map((hit) => `  ${hit}`));
}

if (failures.length > 0) {
  console.error('Expo Router SDK 57 compatibility check failed.\n');
  for (const failure of failures) {
    console.error(failure);
  }
  console.error('\nSee https://docs.expo.dev/router/migrate/sdk-55-to-56/');
  process.exit(1);
}

execSync('npx expo install --check', { cwd: appRoot, stdio: 'inherit' });
console.log('Expo compatibility check passed.');
