import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pbxprojPath = path.join(root, 'ios/Standby.xcodeproj/project.pbxproj');
const profilesDir = path.join(
  process.env.HOME ?? '',
  'Library/Developer/Xcode/UserData/Provisioning Profiles',
);

const appBundleId = 'Standby';
const widgetBundleId = 'Standby.widgets';
const appGroup = 'group.com.kurtgrung.standby';
const developmentTeam = '85FP2SN2JN';

const appEntitlements = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.application-groups</key>
    <array>
      <string>${appGroup}</string>
    </array>
  </dict>
</plist>
`;

function syncEntitlements() {
  fs.writeFileSync(path.join(root, 'ios/Standby/Standby.entitlements'), appEntitlements);
  fs.writeFileSync(path.join(root, 'ios/ExpoWidgetsTarget/ExpoWidgetsTarget.entitlements'), appEntitlements);
}

function removeStaleStandbyProfiles() {
  if (!fs.existsSync(profilesDir)) {
    return;
  }

  for (const fileName of fs.readdirSync(profilesDir)) {
    if (!fileName.endsWith('.mobileprovision')) {
      continue;
    }

    const filePath = path.join(profilesDir, fileName);
    const xml = fs.readFileSync(filePath, 'utf8');
    if (!xml.includes('85FP2SN2JN.Standby') && !xml.includes('Standby.widgets')) {
      continue;
    }

    if (xml.includes(appGroup)) {
      continue;
    }

    fs.unlinkSync(filePath);
  }
}

function syncTeamId() {
  if (!fs.existsSync(pbxprojPath)) {
    return;
  }

  let source = fs.readFileSync(pbxprojPath, 'utf8');
  const next = source.replace(
    /(DevelopmentTeam|DEVELOPMENT_TEAM) = [^;\n]+;/g,
    `$1 = ${developmentTeam};`,
  );

  if (next !== source) {
    fs.writeFileSync(pbxprojPath, next);
  }
}

function syncBundleIds() {
  if (!fs.existsSync(pbxprojPath)) {
    return;
  }

  let source = fs.readFileSync(pbxprojPath, 'utf8');
  const mainAppIds = new Set(['Standby', 'standby.app', 'com.kurtgrung.standby', 'com.standby.app']);
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
      continue;
    }

    if (current === 'com.kurtgrung.standby.widgets') {
      lines[i] = line.replace(current, widgetBundleId);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(pbxprojPath, lines.join('\n'));
  }
}

function profileSupportsAppGroup() {
  if (!fs.existsSync(profilesDir)) {
    return false;
  }

  let hasMainProfile = false;
  let hasWidgetProfile = false;

  for (const fileName of fs.readdirSync(profilesDir)) {
    if (!fileName.endsWith('.mobileprovision')) {
      continue;
    }

    const xml = fs.readFileSync(path.join(profilesDir, fileName), 'utf8');
    if (!xml.includes(appGroup)) {
      continue;
    }

    if (xml.includes(`85FP2SN2JN.${appBundleId}`)) {
      hasMainProfile = true;
    }

    if (xml.includes(`85FP2SN2JN.${widgetBundleId}`)) {
      hasWidgetProfile = true;
    }
  }

  return hasMainProfile && hasWidgetProfile;
}

removeStaleStandbyProfiles();
syncTeamId();
syncBundleIds();

syncEntitlements();

if (!profileSupportsAppGroup()) {
  process.stderr.write(
    [
      'Widgets need App Groups in Apple Developer and matching provisioning profiles.',
      `Main: ${appBundleId} + App Group ${appGroup}`,
      `Widget: ${widgetBundleId} + same App Group`,
      'Then rebuild (Xcode will refresh profiles): make device',
      '',
    ].join('\n'),
  );
}
