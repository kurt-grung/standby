//
//  Standby_WidgetLiveActivity.swift
//  Standby Widget
//
//  Created by Kurt Grüng on 07/08/2026.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct Standby_WidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct Standby_WidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: Standby_WidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension Standby_WidgetAttributes {
    fileprivate static var preview: Standby_WidgetAttributes {
        Standby_WidgetAttributes(name: "World")
    }
}

extension Standby_WidgetAttributes.ContentState {
    fileprivate static var smiley: Standby_WidgetAttributes.ContentState {
        Standby_WidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: Standby_WidgetAttributes.ContentState {
         Standby_WidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: Standby_WidgetAttributes.preview) {
   Standby_WidgetLiveActivity()
} contentStates: {
    Standby_WidgetAttributes.ContentState.smiley
    Standby_WidgetAttributes.ContentState.starEyes
}
