import { CounterTheme } from '@/types/counter';

export const COUNTER_THEMES: CounterTheme[] = [
  {
    id: 'cyber-indigo',
    name: 'Cyber Indigo',
    primary: '#6366F1',
    secondary: '#4F46E5',
    gradient: ['#6366F1', '#4338CA'],
    bgGlow: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.35)',
    badgeBg: 'rgba(99, 102, 241, 0.2)',
    badgeText: '#A5B4FC',
  },
  {
    id: 'emerald-mint',
    name: 'Emerald Mint',
    primary: '#10B981',
    secondary: '#059669',
    gradient: ['#10B981', '#047857'],
    bgGlow: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeText: '#6EE7B7',
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    gradient: ['#8B5CF6', '#6D28D9'],
    bgGlow: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
    badgeBg: 'rgba(139, 92, 246, 0.2)',
    badgeText: '#C4B5FD',
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    primary: '#F43F5E',
    secondary: '#E11D48',
    gradient: ['#F43F5E', '#BE123C'],
    bgGlow: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.35)',
    badgeBg: 'rgba(244, 63, 94, 0.2)',
    badgeText: '#FDA4AF',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    primary: '#F59E0B',
    secondary: '#D97706',
    gradient: ['#F59E0B', '#B45309'],
    bgGlow: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeText: '#FCD34D',
  },
  {
    id: 'cyan-pulse',
    name: 'Cyan Pulse',
    primary: '#06B6D4',
    secondary: '#0891B2',
    gradient: ['#06B6D4', '#0E7490'],
    bgGlow: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
    badgeBg: 'rgba(6, 182, 212, 0.2)',
    badgeText: '#67E8F9',
  },
];

export const AVAILABLE_ICONS = [
  'flame',
  'water',
  'barbell',
  'cafe',
  'book',
  'code-slash',
  'heart',
  'checkbox-outline',
  'trophy',
  'rocket',
  'cube',
  'wallet',
];

export function getThemeById(themeId?: string): CounterTheme {
  const found = COUNTER_THEMES.find((t) => t.id === themeId);
  return found || COUNTER_THEMES[0];
}
