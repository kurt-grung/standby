import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { standbyConfig } from '../config.ts';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const widgetTargetDir = join(appRoot, 'ios', 'ExpoWidgetsTarget');
const widgetInfoPlistPath = join(widgetTargetDir, 'Info.plist');
const widgetSources = ['UltraClockWidget.tsx', 'UltraGaugeWidget.tsx'];

function widgetScopeNightBlock(palette) {
  return `{
    bg: '${palette.bg}',
    primary: '${palette.primary}',
    secondary: '${palette.secondary}',
    muted: '${palette.muted}',
    track: '${palette.track}',
    border: '${palette.border}',
  }`;
}

function readWidgetScopeNightPalette() {
  const result = spawnSync(
    'npx',
    [
      'tsx',
      '-e',
      `import { buildStandByNightPalette } from './lib/standByNightPalette.ts';
import { standbyConfig } from './config.ts';
const palette = buildStandByNightPalette(standbyConfig.brand.plusColor);
console.log(JSON.stringify({ bg: palette.bg, primary: palette.primary, secondary: palette.secondary, muted: palette.muted, track: palette.track, border: palette.border }));`,
    ],
    { cwd: appRoot, encoding: 'utf8' },
  );

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }

  return JSON.parse(result.stdout.trim());
}

function syncWidgetNightPalette(palette) {
  const replacement = widgetScopeNightBlock(palette);
  const pattern = /const \{([^}]+)\} = \{\s*bg: '#[0-9A-Fa-f]+'[\s\S]*?\};/;

  for (const fileName of widgetSources) {
    const filePath = join(appRoot, 'widgets', fileName);
    if (!existsSync(filePath)) {
      console.error(`Missing ${filePath}`);
      process.exit(1);
    }

    const content = readFileSync(filePath, 'utf8');
    const match = content.match(pattern);
    if (!match) {
      console.error(`Widget night palette block not found in ${fileName}`);
      process.exit(1);
    }

    const next = content.replace(pattern, `const {${match[1]}} = ${replacement};`);
    writeFileSync(filePath, next);
    console.log(`Synced widget night palette → ${fileName}`);
  }
}

function syncWidgetSwift(widget) {
  const swiftPath = join(widgetTargetDir, `${widget.name}.swift`);
  if (!existsSync(swiftPath)) {
    console.error(`Missing ${swiftPath}`);
    process.exit(1);
  }

  let content = readFileSync(swiftPath, 'utf8');
  content = content.replace(
    /\.configurationDisplayName\("[^"]*"\)/,
    `.configurationDisplayName(${JSON.stringify(widget.displayName)})`,
  );
  content = content.replace(
    /\.description\("[^"]*"\)/,
    `.description(${JSON.stringify(widget.description)})`,
  );
  writeFileSync(swiftPath, content);
  console.log(`Synced ${widget.name} → ${widget.displayName}`);
}

function bumpWidgetExtensionVersion() {
  if (!existsSync(widgetInfoPlistPath)) {
    return;
  }

  let plist = readFileSync(widgetInfoPlistPath, 'utf8');
  const match = plist.match(/<key>CFBundleVersion<\/key>\s*<string>(\d+)<\/string>/);
  const nextVersion = match ? String(Number(match[1]) + 1) : '2';
  plist = plist.replace(
    /<key>CFBundleVersion<\/key>\s*<string>\d+<\/string>/,
    `<key>CFBundleVersion</key>\n\t<string>${nextVersion}</string>`,
  );
  writeFileSync(widgetInfoPlistPath, plist);
  console.log(`Bumped ExpoWidgetsTarget CFBundleVersion → ${nextVersion}`);
}

if (!existsSync(widgetTargetDir)) {
  console.log('Skipping iOS widget catalog sync (ios/ not generated yet)');
  process.exit(0);
}

for (const widget of standbyConfig.widgets.catalog) {
  syncWidgetSwift(widget);
}

syncWidgetNightPalette(readWidgetScopeNightPalette());

bumpWidgetExtensionVersion();

console.log('iOS widget catalog synced from config.ts');
