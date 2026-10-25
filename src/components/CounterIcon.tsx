import React from 'react';
import {
  BookOpen,
  Box,
  CheckSquare,
  Coffee,
  Code,
  Droplets,
  Dumbbell,
  Flame,
  Heart,
  Layers,
  LucideProps,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react-native';

export function getLucideIconComponent(name?: string) {
  switch (name) {
    case 'flame':
      return Flame;
    case 'water':
      return Droplets;
    case 'barbell':
      return Dumbbell;
    case 'cafe':
      return Coffee;
    case 'book':
      return BookOpen;
    case 'code-slash':
    case 'code':
      return Code;
    case 'heart':
      return Heart;
    case 'checkbox-outline':
    case 'check-square':
      return CheckSquare;
    case 'trophy':
      return Trophy;
    case 'rocket':
      return Rocket;
    case 'cube':
    case 'box':
      return Box;
    case 'wallet':
      return Wallet;
    case 'sparkles':
      return Sparkles;
    case 'layers':
      return Layers;
    case 'zap':
    case 'flash':
      return Zap;
    case 'shield-checkmark':
      return ShieldCheck;
    default:
      return Sparkles;
  }
}

interface CounterIconProps extends LucideProps {
  name?: string;
}

export function CounterIcon({ name, ...props }: CounterIconProps) {
  const Component = getLucideIconComponent(name);
  return <Component {...props} />;
}
