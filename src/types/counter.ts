export type CounterType = 'simple' | 'two-step';
export type ThemeMode = 'dark' | 'light';

export interface CounterTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: [string, string];
  bgGlow: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface CounterItem {
  id: string;
  title: string;
  type: CounterType;
  allowNegative: boolean;
  disableDecrease: boolean;
  storageKey: string;
  value: number;
  themeId: string;
  iconName: string;
  createdAt: number;
  lastUpdated?: number;
  notes?: string;
  stepSize?: number;
}

export type FilterCategory = 'all' | 'simple' | 'two-step';

