import AppKit
import Foundation

enum PlusAlign {
  case baseline
  case top
  case center
}

struct Options {
  let letter: String
  let pointSize: CGFloat
  let plusPointSize: CGFloat
  let kerning: CGFloat
  let plusOffsetY: CGFloat
  let plusAlign: PlusAlign
  let letterWeight: NSFont.Weight
  let plusWeight: NSFont.Weight
  let textColor: NSColor
  let plusColor: NSColor
  let outputPath: String
}

func parseWeight(_ value: String, fallback: NSFont.Weight) -> NSFont.Weight {
  guard let number = Double(value) else {
    return fallback
  }

  switch number {
  case ..<150:
    return .ultraLight
  case ..<250:
    return .thin
  case ..<350:
    return .light
  case ..<450:
    return .regular
  default:
    return .medium
  }
}

func parseOptions() -> Options {
  var letter = "StandBy"
  var pointSize: CGFloat = 200
  var plusPointSize: CGFloat = 200
  var kerning: CGFloat = -2
  var plusOffsetY: CGFloat = 0
  var plusAlign = PlusAlign.baseline
  var letterWeight = NSFont.Weight.thin
  var plusWeight = NSFont.Weight.light
  var textColor = NSColor.white
  var plusColor = NSColor(red: 240.0 / 255.0, green: 42.0 / 255.0, blue: 31.0 / 255.0, alpha: 1)
  var outputPath = ""

  var index = 1
  let args = CommandLine.arguments
  while index < args.count {
    let flag = args[index]
    index += 1
    guard index < args.count else { break }

    let value = args[index]
    index += 1

    switch flag {
    case "--letter":
      letter = value
    case "--point-size":
      pointSize = CGFloat(Double(value) ?? 200)
    case "--plus-point-size":
      plusPointSize = CGFloat(Double(value) ?? 200)
    case "--kerning":
      kerning = CGFloat(Double(value) ?? -2)
    case "--plus-offset-y":
      plusOffsetY = CGFloat(Double(value) ?? 0)
    case "--plus-align":
      switch value {
      case "top":
        plusAlign = .top
      case "center":
        plusAlign = .center
      default:
        plusAlign = .baseline
      }
    case "--letter-weight":
      letterWeight = parseWeight(value, fallback: .thin)
    case "--plus-weight":
      plusWeight = parseWeight(value, fallback: .light)
    case "--text-color":
      textColor = NSColor(hex: value) ?? .white
    case "--plus-color":
      plusColor = NSColor(hex: value) ?? plusColor
    case "--output":
      outputPath = value
    default:
      break
    }
  }

  if outputPath.isEmpty {
    fputs("Missing --output path\n", stderr)
    exit(1)
  }

  return Options(
    letter: letter,
    pointSize: pointSize,
    plusPointSize: plusPointSize,
    kerning: kerning,
    plusOffsetY: plusOffsetY,
    plusAlign: plusAlign,
    letterWeight: letterWeight,
    plusWeight: plusWeight,
    textColor: textColor,
    plusColor: plusColor,
    outputPath: outputPath
  )
}

extension NSColor {
  convenience init?(hex: String) {
    var cleaned = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    if cleaned.hasPrefix("#") {
      cleaned.removeFirst()
    }
    guard cleaned.count == 6, let value = UInt64(cleaned, radix: 16) else {
      return nil
    }

    let red = CGFloat((value & 0xFF0000) >> 16) / 255
    let green = CGFloat((value & 0x00FF00) >> 8) / 255
    let blue = CGFloat(value & 0x0000FF) / 255
    self.init(red: red, green: green, blue: blue, alpha: 1)
  }
}

func attributedSegment(_ text: String, font: NSFont, color: NSColor, kerning: CGFloat) -> NSAttributedString {
  NSAttributedString(
    string: text,
    attributes: [
      .font: font,
      .foregroundColor: color,
      .kern: kerning,
    ]
  )
}

func typographicBounds(_ attributed: NSAttributedString) -> (size: CGSize, ascent: CGFloat, descent: CGFloat) {
  let line = CTLineCreateWithAttributedString(attributed)
  var ascent: CGFloat = 0
  var descent: CGFloat = 0
  let width = CGFloat(CTLineGetTypographicBounds(line, &ascent, &descent, nil))
  return (CGSize(width: ceil(width), height: ceil(ascent + descent)), ascent, descent)
}

let options = parseOptions()
let letterFont = NSFont.systemFont(ofSize: options.pointSize, weight: options.letterWeight)
let plusFont = NSFont.systemFont(ofSize: options.plusPointSize, weight: options.plusWeight)

let letterAttributed = attributedSegment(
  options.letter,
  font: letterFont,
  color: options.textColor,
  kerning: options.kerning
)
let plusAttributed = attributedSegment("+", font: plusFont, color: options.plusColor, kerning: 0)

let letterMetrics = typographicBounds(letterAttributed)
let plusMetrics = typographicBounds(plusAttributed)

let letterBaseline = letterMetrics.descent
let plusBaseline: CGFloat
switch options.plusAlign {
case .top:
  plusBaseline = letterBaseline + letterMetrics.ascent - plusMetrics.ascent + options.plusOffsetY
case .center:
  plusBaseline =
    letterBaseline + letterFont.capHeight / 2 - plusFont.capHeight / 2 + options.plusOffsetY
case .baseline:
  plusBaseline = letterBaseline + options.plusOffsetY
}

let letterMinY = letterBaseline - letterMetrics.descent
let letterMaxY = letterBaseline + letterMetrics.ascent
let plusMinY = plusBaseline - plusMetrics.descent
let plusMaxY = plusBaseline + plusMetrics.ascent
let minY = min(letterMinY, plusMinY)
let maxY = max(letterMaxY, plusMaxY)

let canvasWidth = letterMetrics.size.width + plusMetrics.size.width
let canvasHeight = maxY - minY

let image = NSImage(size: CGSize(width: canvasWidth, height: canvasHeight))
image.lockFocus()
NSColor.clear.set()
NSRect(origin: .zero, size: CGSize(width: canvasWidth, height: canvasHeight)).fill()

letterAttributed.draw(at: NSPoint(x: 0, y: letterBaseline - minY))
plusAttributed.draw(at: NSPoint(x: letterMetrics.size.width, y: plusBaseline - minY))
image.unlockFocus()

guard
  let bitmap = NSBitmapImageRep(data: image.tiffRepresentation ?? Data()),
  let pngData = bitmap.representation(using: .png, properties: [:])
else {
  fputs("Failed to encode brand mark PNG\n", stderr)
  exit(1)
}

do {
  try pngData.write(to: URL(fileURLWithPath: options.outputPath))
} catch {
  fputs("Failed to write brand mark PNG: \(error)\n", stderr)
  exit(1)
}
