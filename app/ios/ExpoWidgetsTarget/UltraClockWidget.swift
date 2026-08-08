import WidgetKit
import SwiftUI
internal import ExpoWidgets

struct UltraClockWidget: Widget {
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
    .configurationDisplayName("Ultra Clock")
    .description("Left StandBy column — live clock with day ring (Small)")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}