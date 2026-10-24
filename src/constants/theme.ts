import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F1F5F9',
    backgroundElement: 'rgba(255, 255, 255, 0.75)',
    backgroundSelected: 'rgba(255, 255, 255, 0.95)',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    glassBorder: 'rgba(0, 0, 0, 0.08)',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    accent: '#6366F1',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0B0F17',
    backgroundElement: 'rgba(18, 24, 38, 0.72)',
    backgroundSelected: 'rgba(30, 41, 59, 0.85)',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    glassBorder: 'rgba(255, 255, 255, 0.14)',
    cardBg: 'rgba(18, 24, 38, 0.82)',
    accent: '#6366F1',
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
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
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

export const BottomTabInset = Platform.select({ ios: 60, android: 80 }) ?? 60;
export const MaxContentWidth = 720;
