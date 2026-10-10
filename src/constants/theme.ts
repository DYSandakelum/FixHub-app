import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    background: '#FFFFFF',
    backgroundElement: '#F8FAFC',
    backgroundSelected: '#E2E8F0',
    primary: '#2563EB',
    accent: '#EF9F27',
  },
  dark: {
    text: '#0F172A',
    textSecondary: '#64748B',
    background: '#FFFFFF',
    backgroundElement: '#F8FAFC',
    backgroundSelected: '#E2E8F0',
    primary: '#2563EB',
    accent: '#EF9F27',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Typography = {
  h1: { fontSize: 24, fontWeight: '700' as const },
  h2: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const, color: '#60646C' },
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
