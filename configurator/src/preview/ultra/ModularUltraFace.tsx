import { panelLayout, panelRingSize, panelTimeSize } from '../../lib/panelLayout';
import { useElementSize } from '../../hooks/useElementSize';
import { TempComplication, UvComplication } from './ArcGauge';
import { ActivityRings } from './ActivityRings';
import { BatteryComplication, DateComplication, SunsetComplication } from './Complications';
import { DayProgressStrip } from './DayProgressStrip';
import { nightMode } from './nightColors';
import { SecondsBezel } from './SecondsBezel';
import './UltraFace.css';

type ModularUltraFaceProps = {
  now: Date;
  temperature?: number;
  tempLow?: number;
  tempHigh?: number;
  uvIndex?: number;
  sunsetLabel?: string;
  batteryPercent?: number;
};

function formatTime(date: Date) {
  const hour12 = date.getHours() % 12 || 12;
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${hour12}:${minute}:${second}`;
}

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const;
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

export function ModularUltraFace({
  now,
  temperature = 72,
  tempLow = 52,
  tempHigh = 89,
  uvIndex = 5,
  sunsetLabel = '7:29PM',
  batteryPercent = 86,
}: ModularUltraFaceProps) {
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const timeLabel = formatTime(now);
  const ringSize = panelRingSize(height);
  const timeSize = panelTimeSize(height, width);
  const dateLabel = `${WEEKDAYS[now.getDay()]} ${MONTHS[now.getMonth()]} ${now.getDate()}`;

  return (
    <div
      ref={ref}
      className="ultra-face"
      style={{ backgroundColor: nightMode.bg, borderColor: nightMode.border }}
    >
      <SecondsBezel width={width} height={height} inset={1.5} cornerRadius={32} />

      <div
        className="ultra-face__body"
        style={{
          paddingInline: panelLayout.padX,
          paddingBlock: panelLayout.padY,
        }}
      >
        <div className="ultra-face__row">
          <TempComplication size={ringSize} value={temperature} low={tempLow} high={tempHigh} />
          <DateComplication size={ringSize} now={now} />
          <BatteryComplication size={ringSize} percent={batteryPercent} />
        </div>

        <div
          className="ultra-face__hero"
          style={{
            marginBlock: panelLayout.sectionGap,
          }}
        >
          <p className="ultra-face__eyebrow">CLOCK</p>
          <p
            className="ultra-face__time"
            style={{
              fontSize: timeSize,
              lineHeight: `${timeSize + 2}px`,
              textShadow: `0 0 12px ${nightMode.glow}`,
            }}
          >
            {timeLabel}
          </p>
          <p className="ultra-face__date">{dateLabel}</p>
        </div>

        <div style={{ marginBottom: panelLayout.sectionGap }}>
          <DayProgressStrip now={now} batteryPercent={batteryPercent} />
        </div>

        <div className="ultra-face__row">
          <ActivityRings size={ringSize} />
          <SunsetComplication size={ringSize} label={sunsetLabel} />
          <UvComplication size={ringSize} value={uvIndex} />
        </div>
      </div>
    </div>
  );
}
