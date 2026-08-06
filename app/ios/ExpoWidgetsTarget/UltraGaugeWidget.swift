import WidgetKit
import SwiftUI
internal import ExpoWidgets

struct UltraGaugeWidget: Widget {
  let name: String = "UltraGaugeWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: name, provider: WidgetsTimelineProvider(name: name)) { entry in
      WidgetsEntryView(entry: entry)
    }
    .configurationDisplayName("Ultra Gauge")
    .description("Circular Ultra-style gauge for StandBy mode")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}