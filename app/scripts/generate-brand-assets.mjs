import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { standbyConfig } from '../config.ts';

const { brand } = standbyConfig;
const brandAssets = brand.assets;

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(appRoot, 'assets');
const iosSplashDir = join(
  appRoot,
  'ios',
  'Standby',
  'Images.xcassets',
  'SplashScreenLogo.imageset',
);
const iosAppIconPath = join(
  appRoot,
  'ios',
  'Standby',
  'Images.xcassets',
  'AppIcon.appiconset',
  'App-Icon-1024x1024@1x.png',
);
const brandMarkScript = join(appRoot, 'scripts', 'render-brand-mark.swift');

const iconOutput = join(assetsDir, 'icon.png');
const adaptiveOutput = join(assetsDir, 'adaptive-icon.png');
const splashOutput = join(assetsDir, 'splash.png');

const splashWidth = brandAssets.canvasSize;
const splashHeight = brandAssets.canvasSize;
const iconSize = brandAssets.canvasSize;

const textColor = brand.textColor;
const plusColor = brand.plusColor;
const backgroundColor = brand.backgroundColor;

const iconPointSize = brandAssets.iconPointSize;
const iconPlusPointSize = brandAssets.iconPlusPointSize;
const iconPlusOffsetY = brandAssets.iconPlusOffsetY;
const letterWeight = brand.wordmark.letterWeight;
const plusWeight = brand.wordmark.plusWeight;
const splashPointSize = brandAssets.splashPointSize;
const splashKerning = brandAssets.splashKerning;
const splashLogoMaxWidth = brandAssets.splashLogoMaxWidth;
const iosSplashImageWidth = brand.splashImageWidth;
const iconLogoMaxScale = brandAssets.iconLogoMaxScale;

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

function ensureMagick() {
  try {
    execSync('magick -version', { stdio: 'ignore' });
  } catch {
    console.error('ImageMagick is required. Install with: brew install imagemagick');
    process.exit(1);
  }
}

function renderBrandMark({
  tmpDir,
  prefix,
  letter,
  pointSize,
  plusPointSize = pointSize,
  kerning = 0,
  plusOffsetY = 0,
  plusAlign,
  letterWeight,
  plusWeight,
}) {
  const logoPath = join(tmpDir, `${prefix}-logo.png`);

  run(
    [
      'swift',
      `"${brandMarkScript}"`,
      '--letter',
      letter,
      '--point-size',
      String(pointSize),
      '--plus-point-size',
      String(plusPointSize),
      '--kerning',
      String(kerning),
      '--plus-offset-y',
      String(plusOffsetY),
      ...(plusAlign ? ['--plus-align', plusAlign] : []),
      '--letter-weight',
      String(letterWeight),
      '--plus-weight',
      String(plusWeight),
      '--text-color',
      `'${textColor}'`,
      '--plus-color',
      `'${plusColor}'`,
      '--output',
      `"${logoPath}"`,
    ].join(' '),
  );

  return logoPath;
}

function compositeLogo({ logoPath, width, height, output, maxWidth }) {
  run(
    [
      `magick -size ${width}x${height} xc:'${backgroundColor}'`,
      `\\( "${logoPath}" -trim +repage -resize ${maxWidth}x \\) -gravity center -composite "${output}"`,
    ].join(' '),
  );
}

function generateIcon() {
  const tmpDir = join(tmpdir(), 'standby-brand-assets');
  mkdirSync(tmpDir, { recursive: true });

  const logoPath = renderBrandMark({
    tmpDir,
    prefix: 'icon',
    letter: 'S',
    pointSize: iconPointSize,
    plusPointSize: iconPlusPointSize,
    plusOffsetY: iconPlusOffsetY,
    plusAlign: 'center',
    letterWeight,
    plusWeight,
  });

  compositeLogo({
    logoPath,
    width: iconSize,
    height: iconSize,
    output: iconOutput,
    maxWidth: iconSize * iconLogoMaxScale,
  });

  console.log(`Wrote ${iconOutput}`);
}

function generateAdaptiveIcon() {
  copyFileSync(iconOutput, adaptiveOutput);
  console.log(`Wrote ${adaptiveOutput}`);
}

function generateSplash() {
  const tmpDir = join(tmpdir(), 'standby-brand-assets');
  mkdirSync(tmpDir, { recursive: true });

  const logoPath = renderBrandMark({
    tmpDir,
    prefix: 'splash',
    letter: 'StandBy',
    pointSize: splashPointSize,
    kerning: splashKerning,
    letterWeight,
    plusWeight,
  });

  compositeLogo({
    logoPath,
    width: splashWidth,
    height: splashHeight,
    output: splashOutput,
    maxWidth: splashLogoMaxWidth,
  });

  console.log(`Wrote ${splashOutput}`);
}

function syncIosSplashImages() {
  if (!existsSync(iosSplashDir)) {
    console.log('Skipping iOS splash imageset (ios/ not generated yet)');
    return;
  }

  if (!existsSync(splashOutput)) {
    console.error('splash.png missing — run generateSplash first');
    process.exit(1);
  }

  for (const ratio of [1, 2, 3]) {
    const size = iosSplashImageWidth * ratio;
    const suffix = ratio === 1 ? '' : `@${ratio}x`;
    const output = join(iosSplashDir, `image${suffix}.png`);
    run(
      [
        `magick "${splashOutput}" -trim +repage`,
        `-background '${backgroundColor}' -gravity center`,
        `-filter Lanczos -resize ${size}x`,
        `-extent ${size}x${size} "${output}"`,
      ].join(' '),
    );
  }

  console.log(`Synced iOS splash imageset from splash.png in ${iosSplashDir}`);
}

function syncIosAppIcon() {
  if (!existsSync(iosAppIconPath)) {
    console.log('Skipping iOS app icon (ios/ not generated yet)');
    return;
  }

  copyFileSync(iconOutput, iosAppIconPath);
  console.log(`Synced iOS app icon at ${iosAppIconPath}`);
}

ensureMagick();
generateIcon();
generateAdaptiveIcon();
generateSplash();
syncIosSplashImages();
syncIosAppIcon();

console.log('Brand assets generated (S+ icon, StandBy+ splash)');
