import { createHash } from 'node:crypto';
import { basename } from 'node:path';
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
const splashBrandPath = join(appRoot, 'lib', 'splashBrand.ts');
const splashBrandScreenPath = join(appRoot, 'ui', 'SplashBrandScreen.tsx');
const appConfigPath = join(appRoot, 'app.config.ts');
const iosSplashStoryboardPath = join(appRoot, 'ios', 'Standby', 'SplashScreen.storyboard');
const splashImageWidth = standbyConfig.brand.splashImageWidth;
const splashDisplayBasename = basename(standbyConfig.brand.splashDisplay);

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

const splashBrand = readFileSync(splashBrandPath, 'utf8');
if (!splashBrand.includes("from '../config'")) {
  failures.push('lib/splashBrand.ts must import standbyConfig from config.ts');
}
if (!splashBrand.includes('brand.splashImageWidth')) {
  failures.push('lib/splashBrand.ts must use standbyConfig.brand.splashImageWidth');
}
if (!splashBrand.includes('brand.splashResizeMode')) {
  failures.push('lib/splashBrand.ts must use standbyConfig.brand.splashResizeMode');
}
if (!splashBrand.includes('brand.backgroundColor')) {
  failures.push('lib/splashBrand.ts must use standbyConfig.brand.backgroundColor');
}
if (!splashBrand.includes(`require('../assets/${splashDisplayBasename}')`)) {
  failures.push(
    `lib/splashBrand.ts must require assets/${splashDisplayBasename} from standbyConfig.brand.splashDisplay`,
  );
}

const splashBrandScreen = readFileSync(splashBrandScreenPath, 'utf8');
if (!splashBrandScreen.includes("from '../lib/splashBrand'")) {
  failures.push('SplashBrandScreen must import splashBrand from lib/splashBrand.ts');
}
if (splashBrandScreen.includes('standbyConfig.brand.splashImageWidth')) {
  failures.push('SplashBrandScreen must read splash size via splashBrand, not standbyConfig.brand');
}
if (!splashBrandScreen.includes('splashBrand.imageSource')) {
  failures.push('SplashBrandScreen must render splashBrand.imageSource');
}
if (!splashBrandScreen.includes('splashBrand.resizeMode')) {
  failures.push('SplashBrandScreen must use splashBrand.resizeMode');
}

const appConfig = readFileSync(appConfigPath, 'utf8');
if (!appConfig.includes("from './config'")) {
  failures.push('app.config.ts must import standbyConfig from config.ts');
}
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
if (!appConfig.includes('standbyConfig.brand.splashResizeMode')) {
  failures.push(
    'app.config.ts expo-splash-screen plugin must use standbyConfig.brand.splashResizeMode',
  );
}
if (!appConfig.includes('standbyConfig.brand.backgroundColor')) {
  failures.push(
    'app.config.ts expo-splash-screen plugin must use standbyConfig.brand.backgroundColor',
  );
}

if (existsSync(iosSplashStoryboardPath)) {
  const storyboard = readFileSync(iosSplashStoryboardPath, 'utf8');
  const storyboardLogoSize = `<image name="SplashScreenLogo" width="${splashImageWidth}" height="${splashImageWidth}"/>`;
  if (!storyboard.includes(storyboardLogoSize)) {
    failures.push(
      `SplashScreen.storyboard logo must be ${splashImageWidth}pt — run make brand-assets`,
    );
  }
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
