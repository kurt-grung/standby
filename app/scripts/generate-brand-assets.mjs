import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const iconOutput = join(assetsDir, 'icon.png');
const adaptiveOutput = join(assetsDir, 'adaptive-icon.png');
const splashOutput = join(assetsDir, 'splash.png');

const splashWidth = 1536;
const splashHeight = 1024;
const iconSize = 1024;

const textColor = '#FFFFFF';
const plusColor = '#FF453A';
const backgroundColor = '#000000';

const iconPointSize = 460;
const iconPlusPointSize = 382;
const iconLetterErode = 5.5;
const iconPlusOffsetY = 6;
const splashPointSize = 120;
const splashKerning = -2;
const splashResizeWidth = 780;

const fontCandidates = [
  '/System/Library/Fonts/SFNS.ttf',
  '/System/Library/Fonts/HelveticaNeue.ttc',
  '/System/Library/Fonts/Supplemental/Arial.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans-ExtraLight.ttf',
];

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

function probeSize(imagePath) {
  const output = execSync(`magick identify -format '%w %h' "${imagePath}"`, {
    encoding: 'utf8',
  }).trim();
  const [width, height] = output.split(' ').map(Number);
  return { width, height };
}

function ensureMagick() {
  try {
    execSync('magick -version', { stdio: 'ignore' });
  } catch {
    console.error('ImageMagick is required. Install with: brew install imagemagick');
    process.exit(1);
  }
}

function resolveFont() {
  for (const candidate of fontCandidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  console.error('No supported font found for brand asset rendering');
  process.exit(1);
}

function thinGlyph(inputPath, outputPath, erodeRadius) {
  run(
    `magick "${inputPath}" \\( -clone 0 -alpha extract -morphology Erode Disk:${erodeRadius} \\) -alpha off -compose CopyOpacity -composite "${outputPath}"`,
  );
}

function renderAppendedLogo({
  font,
  tmpDir,
  prefix,
  letter,
  pointSize,
  plusPointSize = pointSize,
  kerning = 0,
  thinLetter = false,
}) {
  const letterRawPath = join(tmpDir, `${prefix}-letter-raw.png`);
  const letterPath = join(tmpDir, `${prefix}-letter.png`);
  const plusPath = join(tmpDir, `${prefix}-plus.png`);
  const logoPath = join(tmpDir, `${prefix}-logo.png`);

  const letterCommand = [
    `magick -background none -fill '${textColor}'`,
    `-font "${font}" -weight 200 -pointsize ${pointSize}`,
    kerning ? `-kerning ${kerning}` : '',
    `caption:'${letter}' "${letterRawPath}"`,
  ]
    .filter(Boolean)
    .join(' ');

  run(letterCommand);

  if (thinLetter) {
    thinGlyph(letterRawPath, letterPath, iconLetterErode);
  } else {
    copyFileSync(letterRawPath, letterPath);
  }

  run(
    [
      `magick -background none -fill '${plusColor}'`,
      `-font "${font}" -weight 300 -pointsize ${plusPointSize}`,
      `caption:'+' "${plusPath}"`,
    ].join(' '),
  );

  run(`magick "${letterPath}" "${plusPath}" +append "${logoPath}"`);

  return logoPath;
}

function renderIconLogo({ font, tmpDir }) {
  const letterRawPath = join(tmpDir, 'icon-letter-raw.png');
  const letterPath = join(tmpDir, 'icon-letter.png');
  const plusPath = join(tmpDir, 'icon-plus.png');
  const logoPath = join(tmpDir, 'icon-logo.png');

  run(
    [
      `magick -background none -fill '${textColor}'`,
      `-font "${font}" -weight 200 -pointsize ${iconPointSize}`,
      `caption:'S' "${letterRawPath}"`,
    ].join(' '),
  );

  thinGlyph(letterRawPath, letterPath, iconLetterErode);

  run(
    [
      `magick -background none -fill '${plusColor}'`,
      `-font "${font}" -weight 300 -pointsize ${iconPlusPointSize}`,
      `caption:'+' "${plusPath}"`,
    ].join(' '),
  );

  const { width: letterWidth, height: letterHeight } = probeSize(letterPath);
  const { width: plusWidth } = probeSize(plusPath);

  run(
    [
      `magick -size ${letterWidth + plusWidth}x${letterHeight} xc:none`,
      `\\( "${letterPath}" \\) -geometry +0+0 -composite`,
      `\\( "${plusPath}" \\) -geometry +${letterWidth}+${iconPlusOffsetY} -composite`,
      `"${logoPath}"`,
    ].join(' '),
  );

  return logoPath;
}

function compositeLogo({ logoPath, width, height, output, maxWidth }) {
  run(
    [
      `magick -size ${width}x${height} xc:'${backgroundColor}'`,
      `\\( "${logoPath}" -resize ${maxWidth}x \\) -gravity center -composite "${output}"`,
    ].join(' '),
  );
}

function generateIcon() {
  const font = resolveFont();
  const tmpDir = join(tmpdir(), 'standby-brand-assets');
  mkdirSync(tmpDir, { recursive: true });

  const logoPath = renderIconLogo({ font, tmpDir });

  compositeLogo({
    logoPath,
    width: iconSize,
    height: iconSize,
    output: iconOutput,
    maxWidth: iconSize * 0.62,
  });

  console.log(`Wrote ${iconOutput}`);
}

function generateAdaptiveIcon() {
  copyFileSync(iconOutput, adaptiveOutput);
  console.log(`Wrote ${adaptiveOutput}`);
}

function generateSplash() {
  const font = resolveFont();
  const tmpDir = join(tmpdir(), 'standby-brand-assets');
  mkdirSync(tmpDir, { recursive: true });

  const logoPath = renderAppendedLogo({
    font,
    tmpDir,
    prefix: 'splash',
    letter: 'StandBy',
    pointSize: splashPointSize,
    kerning: splashKerning,
  });

  compositeLogo({
    logoPath,
    width: splashWidth,
    height: splashHeight,
    output: splashOutput,
    maxWidth: splashResizeWidth,
  });

  console.log(`Wrote ${splashOutput}`);
}

function syncIosSplashImages() {
  if (!existsSync(iosSplashDir)) {
    console.log('Skipping iOS splash imageset (ios/ not generated yet)');
    return;
  }

  for (const size of [200, 400, 600]) {
    const suffix = size === 200 ? '' : `@${size / 200}x`;
    const output = join(iosSplashDir, `image${suffix}.png`);
    run(
      `magick "${splashOutput}" -resize ${size}x${size}\\> -background '${backgroundColor}' -gravity center -extent ${size}x${size} "${output}"`,
    );
  }

  console.log(`Synced iOS splash imageset in ${iosSplashDir}`);
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
