import fs from 'node:fs';
import path from 'node:path';

const target = path.join('node_modules/expo-dev-launcher/ios/EXDevLauncherController.m');

if (!fs.existsSync(target)) {
  process.exit(0);
}

let source = fs.readFileSync(target, 'utf8');

const patches = [
  {
    marker: '/* standby-autoconnect-embedded */',
    original: `  if ([[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"] != nil) {
    [self navigateToLauncher];
    return;
  }`,
    patched: `  if ([[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"] != nil) {
    [self launchDefaultUrlFallbackOrNavigateToLauncher];
    return; /* standby-autoconnect-embedded */
  }`,
  },
  {
    marker: '/* standby-autoconnect */',
    original: `  if (self.useDefaultLaunchUrlFallback) {
    [self loadApp: self.defaultLaunchURL withProjectUrl:nil withTimeout:EXDevLauncherDefaultRequestTimeout onSuccess:nil onError:navigateToLauncher];
  }

  [self navigateToLauncher];
}`,
    patched: `  if (self.useDefaultLaunchUrlFallback) {
    [self loadApp: self.defaultLaunchURL withProjectUrl:nil withTimeout:EXDevLauncherDefaultRequestTimeout onSuccess:nil onError:navigateToLauncher];
    return; /* standby-autoconnect */
  }

  [self navigateToLauncher];
}`,
  },
];

let changed = false;

for (const patch of patches) {
  if (source.includes(patch.marker)) {
    continue;
  }

  if (!source.includes(patch.original)) {
    continue;
  }

  source = source.replace(patch.original, patch.patched);
  changed = true;
}

if (changed) {
  fs.writeFileSync(target, source);
}
