import fs from 'node:fs';
import path from 'node:path';

const widgetTargetDir = path.join(process.cwd(), 'ios/ExpoWidgetsTarget');
const backgroundLine =
  '.containerBackground(Color.black, for: .widget)';

if (!fs.existsSync(widgetTargetDir)) {
  process.exit(0);
}

for (const fileName of fs.readdirSync(widgetTargetDir)) {
  if (!fileName.endsWith('Widget.swift')) {
    continue;
  }

  const filePath = path.join(widgetTargetDir, fileName);
  let source = fs.readFileSync(filePath, 'utf8');

  if (source.includes(backgroundLine)) {
    continue;
  }

  if (!source.includes('WidgetsEntryView(entry: entry)')) {
    continue;
  }

  source = source.replace(
    /WidgetsEntryView\(entry: entry\)/g,
    `WidgetsEntryView(entry: entry)\n        ${backgroundLine}`,
  );

  fs.writeFileSync(filePath, source);
}
