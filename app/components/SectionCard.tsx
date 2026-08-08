import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useAppChrome } from '../theme/useAppChrome';

type SectionCardProps = {
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ label, title, children, className = 'mb-8' }: SectionCardProps) {
  const chrome = useAppChrome();

  return (
    <View
      className={`overflow-hidden rounded-3xl border p-5 ${className}`}
      style={{
        backgroundColor: chrome.colors.card,
        borderColor: chrome.colors.border,
      }}>
      {label ? (
        <Text
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: chrome.colors.secondary }}>
          {label}
        </Text>
      ) : null}
      {title ? (
        <Text
          className={`${label ? 'mt-2' : ''} text-lg font-medium`}
          style={{ color: chrome.colors.primary }}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
