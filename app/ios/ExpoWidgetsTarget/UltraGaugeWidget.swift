import WidgetKit
import SwiftUI
internal import ExpoWidgets

struct WidgetRight: Widget {
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
    .configurationDisplayName("Widget Right")
    .description("Right StandBy column")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}
