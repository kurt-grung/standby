import WidgetKit
import SwiftUI
internal import ExpoWidgets

struct UltraClockWidget: Widget {
  let name: String = "UltraClockWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: name, provider: WidgetsTimelineProvider(name: name)) { entry in
      WidgetsEntryView(entry: entry)
        .containerBackground(Color.black, for: .widget)
    }
    .configurationDisplayName("Ultra Clock")
    .description("Apple Watch Ultra-style night clock for StandBy mode")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}