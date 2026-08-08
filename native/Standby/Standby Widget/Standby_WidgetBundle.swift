//
//  Standby_WidgetBundle.swift
//  Standby Widget
//
//  Created by Kurt Grüng on 07/08/2026.
//

import WidgetKit
import SwiftUI

@main
struct Standby_WidgetBundle: WidgetBundle {
    var body: some Widget {
        Standby_Widget()
        Standby_WidgetControl()
        Standby_WidgetLiveActivity()
    }
}
