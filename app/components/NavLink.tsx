import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { useAppChrome } from '../theme/useAppChrome';

type NavLinkProps = {
  href: '/' | '/preview' | '/ui';
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const chrome = useAppChrome();

  return (
    <Link href={href} asChild>
      <Pressable
        className="rounded-full border px-4 py-2 active:opacity-70"
        style={{
          borderColor: chrome.colors.border,
          backgroundColor: chrome.colors.surface,
        }}
      >
        <Text
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: chrome.colors.secondary }}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}
