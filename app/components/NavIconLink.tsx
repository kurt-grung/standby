import { Link } from 'expo-router';
import { Pressable } from 'react-native';

import { navIcons, type NavIconName } from './navIcons';
import { useAppChrome } from '../theme/useAppChrome';

type NavIconLinkProps = {
  href: '/' | '/home' | '/ui';
  icon: NavIconName;
  accessibilityLabel: string;
  size?: number;
  iconSize?: number;
};

const DEFAULT_SIZE = 36;

export function NavIconLink({
  href,
  icon,
  accessibilityLabel,
  size = DEFAULT_SIZE,
  iconSize = 17,
}: NavIconLinkProps) {
  const chrome = useAppChrome();
  const Icon = navIcons[icon];

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
          backgroundColor: chrome.colors.navButtonBg,
          borderWidth: 1,
          borderColor: chrome.colors.navButtonBorder,
          borderRadius: 10,
        }}>
        <Icon size={iconSize} color={chrome.colors.navButtonIcon} />
      </Pressable>
    </Link>
  );
}
