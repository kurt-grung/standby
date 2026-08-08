import fs from 'node:fs';
import path from 'node:path';

const target = path.join(
  'node_modules/expo-modules-jsi/apple/Sources/ExpoModulesJSI/Coding/JavaScriptCodable+Date.swift',
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const source = fs.readFileSync(target, 'utf8');
const patched = source.replace(
  'abs(milliseconds) <= maxJavaScriptDateMilliseconds',
  'Swift.abs(milliseconds) <= maxJavaScriptDateMilliseconds',
);

if (patched !== source) {
  fs.writeFileSync(target, patched);
}
