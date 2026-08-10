import type { LucideIcon } from 'lucide-react';
import './GlassIconButton.css';

type GlassIconButtonProps = {
  icon: LucideIcon;
  accessibilityLabel: string;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  outlineInset?: number;
};

export function GlassIconButton({
  icon: Icon,
  accessibilityLabel,
  onPress,
  size = 38,
  iconSize = 14,
  outlineInset = 4,
}: GlassIconButtonProps) {
  const outlineSize = size + outlineInset * 2;

  return (
    <div className="glass-icon-button" style={{ width: outlineSize, height: outlineSize }}>
      <span
        className="glass-icon-button__outline"
        style={{
          width: outlineSize,
          height: outlineSize,
        }}
        aria-hidden="true"
      />
      <button
        type="button"
        className="glass-icon-button__surface"
        aria-label={accessibilityLabel}
        style={{ width: size, height: size }}
        onClick={onPress}
      >
        <Icon size={iconSize} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
