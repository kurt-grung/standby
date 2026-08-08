import WidgetKit
import SwiftUI
internal import ExpoWidgets

struct UltraGaugeWidget: Widget {
  let name: String = "UltraGaugeWidget"

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
    .configurationDisplayName("Ultra Gauge")
    .description("Right StandBy column — Ultra gauge with live value (Small)")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}