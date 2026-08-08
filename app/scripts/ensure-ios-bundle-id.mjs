import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pbxprojPath = path.join(root, 'ios/Standby.xcodeproj/project.pbxproj');
const appBundleId = 'Standby';
const widgetBundleId = 'Standby.widgets';

if (!fs.existsSync(pbxprojPath)) {
  process.exit(0);
}

let source = fs.readFileSync(pbxprojPath, 'utf8');
const mainAppIds = new Set([
  'Standby',
  'standby.app',
  'com.kurtgrung.standby',
  'com.standby.app',
  appBundleId,
]);
const lines = source.split('\n');
let changed = false;

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  if (!line.includes('PRODUCT_BUNDLE_IDENTIFIER =')) {
    continue;
  }

  const match = line.match(/PRODUCT_BUNDLE_IDENTIFIER = (.+);$/);
  if (!match) {
    continue;
  }

  const current = match[1].trim();
  if (current === widgetBundleId) {
    continue;
  }

  if (current !== appBundleId && mainAppIds.has(current)) {
    lines[i] = line.replace(current, appBundleId);
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync(pbxprojPath, lines.join('\n'));
}
