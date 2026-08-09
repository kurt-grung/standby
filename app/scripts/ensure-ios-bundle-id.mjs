import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pbxprojPath = path.join(root, 'ios/Standby.xcodeproj/project.pbxproj');
const profilesDir = path.join(
  process.env.HOME ?? '',
  'Library/Developer/Xcode/UserData/Provisioning Profiles',
);

const preferredAppBundleId = 'Standby';
const preferredWidgetBundleId = 'Standby.widgets';
const fallbackAppBundleId = 'com.kurtgrung.standby';
const fallbackWidgetBundleId = 'com.kurtgrung.standby.widgets';
const appGroup = 'group.com.kurtgrung.standby';
const developmentTeam = '85FP2SN2JN';

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

function profileSupportsAppGroup(appBundleId, widgetBundleId) {
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

function resolveBundleIds() {
  if (profileSupportsAppGroup(preferredAppBundleId, preferredWidgetBundleId)) {
    return {
      appBundleId: preferredAppBundleId,
      widgetBundleId: preferredWidgetBundleId,
      source: preferredAppBundleId,
    };
  }

  if (profileSupportsAppGroup(fallbackAppBundleId, fallbackWidgetBundleId)) {
    return {
      appBundleId: fallbackAppBundleId,
      widgetBundleId: fallbackWidgetBundleId,
      source: fallbackAppBundleId,
    };
  }

  return {
    appBundleId: preferredAppBundleId,
    widgetBundleId: preferredWidgetBundleId,
    source: null,
  };
}

function syncBundleIds(appBundleId, widgetBundleId) {
  if (!fs.existsSync(pbxprojPath)) {
    return false;
  }

  const mainAppIds = new Set([
    preferredAppBundleId,
    fallbackAppBundleId,
    'standby.app',
    'com.standby.app',
  ]);
  const widgetAppIds = new Set([preferredWidgetBundleId, fallbackWidgetBundleId]);
  const lines = fs.readFileSync(pbxprojPath, 'utf8').split('\n');
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
    if (widgetAppIds.has(current) && current !== widgetBundleId) {
      lines[i] = line.replace(current, widgetBundleId);
      changed = true;
      continue;
    }

    if (mainAppIds.has(current) && current !== appBundleId) {
      lines[i] = line.replace(current, appBundleId);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(pbxprojPath, lines.join('\n'));
  }

  return changed;
}

const { appBundleId, widgetBundleId, source } = resolveBundleIds();

removeStaleStandbyProfiles();
syncTeamId();
const bundleIdsChanged = syncBundleIds(appBundleId, widgetBundleId);

if (!source) {
  process.stderr.write(
    [
      'Widgets need App Groups in Apple Developer and matching provisioning profiles.',
      `Preferred: ${preferredAppBundleId} + ${preferredWidgetBundleId}`,
      `Fallback: ${fallbackAppBundleId} + ${fallbackWidgetBundleId}`,
      `App Group: ${appGroup}`,
      'Then rebuild: make device',
      '',
    ].join('\n'),
  );
} else if (source === fallbackAppBundleId && bundleIdsChanged) {
  process.stderr.write(
    [
      `Using ${fallbackAppBundleId} (profiles with App Groups are installed).`,
      `Enable App Groups on ${preferredAppBundleId} in Apple Developer to switch back.`,
      '',
    ].join('\n'),
  );
}
