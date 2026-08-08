import fs from 'node:fs';
import path from 'node:path';

const target = path.join(
  'node_modules/expo-modules-jsi/apple/Sources/ExpoModulesJSI/Coding/JavaScriptCodable+Date.swift',
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const needle = 'abs(milliseconds) <= maxJavaScriptDateMilliseconds';
const replacement = 'Swift.abs(milliseconds) <= maxJavaScriptDateMilliseconds';

let source = fs.readFileSync(target, 'utf8');
source = source.replace(/Swift\.(Swift\.)*abs\(milliseconds\)/g, 'abs(milliseconds)');

if (source.includes(replacement)) {
  process.exit(0);
}

if (!source.includes(needle)) {
  process.exit(0);
}

fs.writeFileSync(target, source.replace(needle, replacement));
