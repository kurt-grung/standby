import fs from 'node:fs';
import path from 'node:path';

const widgetTargetDir = path.join(process.cwd(), 'ios/ExpoWidgetsTarget');
const patchedBlock = `Group {
        if #available(iOS 17.0, *) {
          WidgetsEntryView(entry: entry)
            .containerBackground(Color.black, for: .widget)
        } else {
          WidgetsEntryView(entry: entry)
        }
      }`;

if (!fs.existsSync(widgetTargetDir)) {
  process.exit(0);
}

for (const fileName of fs.readdirSync(widgetTargetDir)) {
  if (!fileName.endsWith('Widget.swift')) {
    continue;
  }

  const filePath = path.join(widgetTargetDir, fileName);
  let source = fs.readFileSync(filePath, 'utf8');

  if (source.includes('if #available(iOS 17.0, *)')) {
    continue;
  }

  const simpleBackgroundPattern =
    /WidgetsEntryView\(entry: entry\)\n\s+\.containerBackground\(Color\.black, for: \.widget\)/g;

  if (simpleBackgroundPattern.test(source)) {
    source = source.replace(simpleBackgroundPattern, patchedBlock);
    fs.writeFileSync(filePath, source);
    continue;
  }

  if (!source.includes('WidgetsEntryView(entry: entry)')) {
    continue;
  }

  source = source.replace(/WidgetsEntryView\(entry: entry\)/g, patchedBlock);
  fs.writeFileSync(filePath, source);
}
