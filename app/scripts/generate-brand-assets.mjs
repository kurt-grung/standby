import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
const splashDisplayOutput = join(assetsDir, 'splash-display.png');

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

function writeTrimmedSplashSquare({ sourcePath, size, output }) {
  run(
    [
      `magick "${sourcePath}" -trim +repage`,
      `-background '${backgroundColor}' -gravity center`,
      `-filter Lanczos -resize ${size}x`,
      `-extent ${size}x${size} "${output}"`,
    ].join(' '),
  );
}

function syncIosSplashImages() {
  if (!existsSync(splashOutput)) {
    console.error('splash.png missing — run generateSplash first');
    process.exit(1);
  }

  const displaySize = iosSplashImageWidth * 3;

  if (!existsSync(iosSplashDir)) {
    writeTrimmedSplashSquare({
      sourcePath: splashOutput,
      size: displaySize,
      output: splashDisplayOutput,
    });
    console.log('Skipping iOS splash imageset (ios/ not generated yet)');
    console.log(`Wrote ${splashDisplayOutput}`);
    return;
  }

  let iosSplashAt3xPath = null;

  for (const ratio of [1, 2, 3]) {
    const size = iosSplashImageWidth * ratio;
    const suffix = ratio === 1 ? '' : `@${ratio}x`;
    const output = join(iosSplashDir, `image${suffix}.png`);
    writeTrimmedSplashSquare({ sourcePath: splashOutput, size, output });
    if (ratio === 3) {
      iosSplashAt3xPath = output;
    }
  }

  copyFileSync(iosSplashAt3xPath, splashDisplayOutput);
  console.log(`Synced iOS splash imageset from splash.png in ${iosSplashDir}`);
  console.log(`Wrote ${splashDisplayOutput} (copy of iOS @3x splash)`);
}

function syncIosSplashStoryboard() {
  const storyboardPath = join(appRoot, 'ios', 'Standby', 'SplashScreen.storyboard');
  if (!existsSync(storyboardPath)) {
    console.log('Skipping iOS splash storyboard (ios/ not generated yet)');
    return;
  }

  const width = iosSplashImageWidth;
  const previewWidth = 393;
  const previewHeight = 852;
  const x = (previewWidth - width) / 2;
  const y = (previewHeight - width) / 2;

  let content = readFileSync(storyboardPath, 'utf8');

  content = content.replace(
    /(<image name="SplashScreenLogo" width=")\d+(" height=")\d+("\/>)/,
    `$1${width}$2${width}$3`,
  );

  content = content.replace(
    /(id="EXPO-SplashScreen"[\s\S]*?<rect key="frame" x=")[\d.]+(" y=")[\d.]+(" width=")\d+(" height=")\d+("\/>)/,
    `$1${x}$2${y}$3${width}$4${width}$5`,
  );

  writeFileSync(storyboardPath, content);
  console.log(`Synced iOS splash storyboard logo size to ${width}pt`);
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
syncIosSplashStoryboard();
syncIosAppIcon();

console.log('Brand assets generated (S+ icon, StandBy+ splash)');
