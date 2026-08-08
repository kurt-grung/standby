import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';

type SectionCardProps = {
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ label, title, children, className = 'mb-8' }: SectionCardProps) {
  const { theme } = useTheme();

  return (
    <View
      className={`overflow-hidden rounded-3xl border p-5 ${className}`}
      style={{
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      }}>
      {label ? (
        <Text
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: theme.colors.accent }}>
          {label}
        </Text>
      ) : null}
      {title ? (
        <Text
          className={`${label ? 'mt-2' : ''} text-lg font-medium`}
          style={{ color: theme.colors.primary }}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
