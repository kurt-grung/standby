export type ThemeId = 'night' | 'ultra' | 'mono' | 'graphite';

export type StandbyTheme = {
  id: ThemeId;
  name: string;
  description: string;
  badge: string;
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
  };
};

export const themes: Record<ThemeId, StandbyTheme> = {
  night: {
    id: 'night',
    name: 'Night',
    description: 'StandBy night palette — monochromatic red on black',
    badge: 'Night',
    statusBar: 'light',
    colors: {
      bg: '#000000',
      surface: '#110808',
      card: '#160A0A',
      border: '#3A1512',
      primary: '#FF453A',
      secondary: '#A8423A',
      muted: '#6B2E28',
      accent: '#FF453A',
      accentSoft: 'rgba(255, 69, 58, 0.15)',
      track: '#2A1210',
    },
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra',
    description: 'Apple Watch Ultra orange on pure black',
    badge: 'Ultra',
    statusBar: 'light',
    colors: {
      bg: '#000000',
      surface: '#0D0D0D',
      card: '#141414',
      border: '#2C2C2E',
      primary: '#FFFFFF',
      secondary: '#8E8E93',
      muted: '#636366',
      accent: '#FF9F0A',
      accentSoft: 'rgba(255, 159, 10, 0.15)',
      track: '#1C1C1E',
    },
  },
  mono: {
    id: 'mono',
    name: 'Mono',
    description: 'StandBy mono — white and grey only',
    badge: 'Mono',
    statusBar: 'light',
    colors: {
      bg: '#000000',
      surface: '#0A0A0A',
      card: '#121212',
      border: '#3A3A3C',
      primary: '#FFFFFF',
      secondary: '#AEAEB2',
      muted: '#636366',
      accent: '#FFFFFF',
      accentSoft: 'rgba(255, 255, 255, 0.12)',
      track: '#1F1F1F',
    },
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite',
    description: 'Dieter Rams industrial cool grey',
    badge: 'Graphite',
    statusBar: 'light',
    colors: {
      bg: '#0A0A0B',
      surface: '#141416',
      card: '#1C1C1F',
      border: '#323236',
      primary: '#ECECEF',
      secondary: '#98989D',
      muted: '#6E6E73',
      accent: '#64D2FF',
      accentSoft: 'rgba(100, 210, 255, 0.12)',
      track: '#252528',
    },
  },
};

export const themeList = Object.values(themes);

export const defaultThemeId: ThemeId = 'night';
