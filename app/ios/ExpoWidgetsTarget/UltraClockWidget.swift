import WidgetKit
import SwiftUI
internal import ExpoWidgets

struct WidgetLeft: Widget {
  let name: String = "UltraClockWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: name, provider: WidgetsTimelineProvider(name: name)) { entry in
      Group {
        if #available(iOS 17.0, *) {
          WidgetsEntryView(entry: entry)
            .containerBackground(Color.black, for: .widget)
        } else {
          WidgetsEntryView(entry: entry)
        }
      }
    }
    .configurationDisplayName("Widget Left")
    .description("Left StandBy column")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}
