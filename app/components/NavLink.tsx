import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { useTheme } from '../theme/ThemeContext';

type NavLinkProps = {
  href: '/' | '/home' | '/ui';
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const { theme } = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable
        className="rounded-full border px-4 py-2 active:opacity-70"
        style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
        <Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.colors.secondary }}>
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}
