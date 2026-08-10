import { dayProgress } from '../../lib/standByPreviewLayout';
import { panelLayout, panelRingSize, panelStatusHeroSize } from '../../lib/panelLayout';
import { useElementSize } from '../../hooks/useElementSize';
import { ArcGauge, TempComplication, UvComplication } from './ArcGauge';
import { ActivityRings } from './ActivityRings';
import { BatteryComplication, NoiseComplication, SunsetComplication } from './Complications';
import { nightMode } from './nightColors';
import './UltraFace.css';

type StatusGaugeFaceProps = {
  now: Date;
  temperature?: number;
  tempLow?: number;
  tempHigh?: number;
  uvIndex?: number;
  sunsetLabel?: string;
  batteryPercent?: number;
  noiseDb?: number;
  focusPercent?: number;
};

function MetricRow({
  label,
  value,
  progress,
  last = false,
}: {
  label: string;
  value: string;
  progress: number;
  last?: boolean;
}) {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div style={{ marginBottom: last ? 0 : panelLayout.metricGap }}>
      <div
        className="ultra-face__metric-head"
        style={{ marginBottom: panelLayout.metricHeadGap }}
      >
        <span className="ultra-face__metric-label">{label}</span>
        <span className="ultra-face__metric-value">{value}</span>
      </div>
      <div
        className="ultra-face__metric-track"
        style={{ height: panelLayout.metricBarHeight }}
      >
        <div className="ultra-face__metric-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function StatusGaugeFace({
  now,
  temperature = 68,
  tempLow = 49,
  tempHigh = 84,
  uvIndex = 4,
  sunsetLabel = '7:31PM',
  batteryPercent = 74,
  noiseDb = 38,
  focusPercent,
}: StatusGaugeFaceProps) {
  const { ref, height } = useElementSize<HTMLDivElement>();
  const progress = dayProgress(now);
  const dayPercent = Math.round(progress * 100);
  const focus = focusPercent ?? Math.max(0.2, 1 - progress);
  const ringSize = panelRingSize(height);
  const heroSize = panelStatusHeroSize(height);

  return (
    <div
      ref={ref}
      className="ultra-face"
      style={{ backgroundColor: nightMode.bg, borderColor: nightMode.border }}
    >
      <div
        className="ultra-face__body"
        style={{
          paddingInline: panelLayout.padX,
          paddingBlock: panelLayout.padY,
        }}
      >
        <div className="ultra-face__row">
          <TempComplication size={ringSize} value={temperature} low={tempLow} high={tempHigh} />
          <NoiseComplication size={ringSize} db={noiseDb} />
          <BatteryComplication size={ringSize} percent={batteryPercent} />
        </div>

        <div className="ultra-face__hero" style={{ marginBlock: panelLayout.sectionGap }}>
          <p className="ultra-face__eyebrow">STATUS</p>
          <ArcGauge size={heroSize} progress={progress} stroke={heroSize * 0.11}>
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  display: 'block',
                  color: nightMode.primary,
                  fontSize: heroSize * 0.28,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: `${heroSize * 0.3}px`,
                }}
              >
                {dayPercent}
              </span>
              <span
                style={{
                  display: 'block',
                  color: nightMode.secondary,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  marginTop: 2,
                }}
              >
                DAY %
              </span>
            </div>
          </ArcGauge>
        </div>

        <div className="ultra-face__metrics" style={{ marginBottom: panelLayout.sectionGap }}>
          <MetricRow label="FOCUS" value={`${Math.round(focus * 100)}%`} progress={focus} />
          <MetricRow label="BATTERY" value={`${batteryPercent}%`} progress={batteryPercent / 100} />
          <MetricRow label="NOISE" value={`${noiseDb} dB`} progress={noiseDb / 100} last />
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
