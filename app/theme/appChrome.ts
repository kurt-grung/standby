export type AppChrome = {
  statusBar: 'light' | 'dark';
  colors: {
    bg: string;
    surface: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    accentSoft: string;
    track: string;
    navButtonBg: string;
    navButtonIcon: string;
    navButtonBorder: string;
  };
};

export const appChromeDark: AppChrome = {
  statusBar: 'light',
  colors: {
    bg: '#000000',
    surface: '#1C1C1E',
    card: '#1C1C1E',
    border: '#38383A',
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    muted: '#636366',
    accent: '#FFFFFF',
    accentSoft: 'rgba(255, 255, 255, 0.12)',
    track: '#3A3A3C',
    navButtonBg: '#FFFFFF',
    navButtonIcon: '#000000',
    navButtonBorder: 'rgba(0, 0, 0, 0.08)',
  },
};

export const appChromeLight: AppChrome = {
  statusBar: 'dark',
  colors: {
    bg: '#FFFFFF',
    surface: '#F2F2F7',
    card: '#F2F2F7',
    border: '#C6C6C8',
    primary: '#000000',
    secondary: '#3C3C43',
    muted: '#8E8E93',
    accent: '#000000',
    accentSoft: 'rgba(0, 0, 0, 0.08)',
    track: '#E5E5EA',
    navButtonBg: '#FFFFFF',
    navButtonIcon: '#000000',
    navButtonBorder: 'rgba(0, 0, 0, 0.1)',
  },
};

export function getAppChrome(colorScheme: 'light' | 'dark' | null | undefined | 'unspecified'): AppChrome {
  return colorScheme === 'light' ? appChromeLight : appChromeDark;
}
