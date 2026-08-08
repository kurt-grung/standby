import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import { useAppChrome } from '../theme/useAppChrome';

type NavIconLinkProps = {
  href: '/' | '/home' | '/ui';
  symbol: SFSymbol;
  accessibilityLabel: string;
  size?: number;
  iconSize?: number;
};

const DEFAULT_SIZE = 38;

export function NavIconLink({
  href,
  symbol,
  accessibilityLabel,
  size = DEFAULT_SIZE,
  iconSize = 18,
}: NavIconLinkProps) {
  const chrome = useAppChrome();

  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        className="active:opacity-60"
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: chrome.colors.surface,
          borderRadius: 11,
        }}>
        <SymbolView name={symbol} size={iconSize} tintColor={chrome.colors.primary} weight="medium" />
      </Pressable>
    </Link>
  );
}
