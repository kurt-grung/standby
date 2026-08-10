import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { standbyConfig } from '../config.ts';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const splashDisplayPath = join(appRoot, 'assets', 'splash-display.png');
const iosSplashAt3xPath = join(
  appRoot,
  'ios',
  'Standby',
  'Images.xcassets',
  'SplashScreenLogo.imageset',
  'image@3x.png',
);
const splashBrandScreenPath = join(appRoot, 'ui', 'SplashBrandScreen.tsx');
const appConfigPath = join(appRoot, 'app.config.ts');

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const failures = [];

if (!existsSync(splashDisplayPath)) {
  failures.push('Missing assets/splash-display.png — run make brand-assets');
}

if (existsSync(iosSplashAt3xPath) && existsSync(splashDisplayPath)) {
  if (sha256(iosSplashAt3xPath) !== sha256(splashDisplayPath)) {
    failures.push(
      'assets/splash-display.png does not match ios SplashScreenLogo image@3x.png — run make brand-assets',
    );
  }
}

const splashBrandScreen = readFileSync(splashBrandScreenPath, 'utf8');
if (!splashBrandScreen.includes("require('../assets/splash-display.png')")) {
  failures.push('SplashBrandScreen must load assets/splash-display.png, not splash.png');
}

if (!splashBrandScreen.includes('standbyConfig.brand.splashImageWidth')) {
  failures.push('SplashBrandScreen must size the logo with standbyConfig.brand.splashImageWidth');
}

const appConfig = readFileSync(appConfigPath, 'utf8');
if (!appConfig.includes('standbyConfig.brand.splashDisplay')) {
  failures.push(
    'app.config.ts expo-splash-screen plugin must use standbyConfig.brand.splashDisplay',
  );
}

if (!appConfig.includes('standbyConfig.brand.splashImageWidth')) {
  failures.push(
    'app.config.ts expo-splash-screen plugin must use standbyConfig.brand.splashImageWidth',
  );
}

if (failures.length > 0) {
  console.error('Splash sync check failed.\n');
  for (const failure of failures) {
    console.error(`  • ${failure}`);
  }
  console.error('\nSee AGENTS.md → Splash (native + JS loader).');
  process.exit(1);
}

console.log('Splash sync check passed.');
