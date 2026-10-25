import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Lock,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Zap,
} from 'lucide-react-native';
import { CounterIcon } from '@/components/CounterIcon';
import { CounterItem } from '@/types/counter';
import { getThemeById } from '@/constants/palettes';
import { triggerHaptic } from '@/utils/haptics';
import { useCounters } from '@/context/CounterContext';

interface CounterCardProps {
  counter: CounterItem;
  onIncrement: (counter: CounterItem) => void;
  onDecrement: (counter: CounterItem) => void;
  onReset: (counter: CounterItem) => void;
  onDelete: (counter: CounterItem) => void;
}

export function CounterCard({
  counter,
  onIncrement,
  onDecrement,
  onReset,
  onDelete,
}: CounterCardProps) {
  const { themeMode } = useCounters();
  const isDark = themeMode === 'dark';
  const theme = getThemeById(counter.themeId);
  const isTwoStep = counter.type === 'two-step';
  const step = counter.stepSize ?? 1;

  // Micro-animation scale values for tactile feedback
  const [incScaleAnim] = useState(() => new Animated.Value(1));
  const [decScaleAnim] = useState(() => new Animated.Value(1));

  const animatePress = (animVal: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animVal, {
        toValue: 0.92,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(animVal, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Decrement is disabled if current value is 0 and negative is disallowed
  const isDecDisabled = !counter.allowNegative && counter.value <= 0;

  const handleIncrementPress = () => {
    animatePress(incScaleAnim);
    onIncrement(counter);
  };

  const handleDecrementPress = () => {
    if (counter.disableDecrease) return;

    if (isDecDisabled) {
      triggerHaptic('warning');
      return;
    }

    animatePress(decScaleAnim);
    onDecrement(counter);
  };

  return (
    <View style={styles.cardOuter}>
      {/* Dynamic ambient backlight */}
      <View
        style={[
          styles.glowBackdrop,
          {
            backgroundColor: isDark ? theme.bgGlow : 'rgba(99, 102, 241, 0.06)',
            borderColor: isDark ? theme.borderColor : 'rgba(99, 102, 241, 0.2)',
          },
        ]}
      />

      <View
        style={[
          styles.glassCard,
          isDark ? styles.glassCardDark : styles.glassCardLight,
          {
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.14)'
              : 'rgba(255, 255, 255, 0.85)',
          },
        ]}>
        {/* Specular reflection line at the top */}
        <View
          style={[
            styles.specularBar,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.95)',
            },
          ]}
        />

        {/* Card Header */}
        <View style={styles.headerRow}>
          <View style={styles.titleInfoGroup}>
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: isDark
                    ? theme.badgeBg
                    : 'rgba(99, 102, 241, 0.12)',
                },
              ]}>
              <CounterIcon
                name={counter.iconName || 'sparkles'}
                size={15}
                color={theme.primary}
                strokeWidth={2.2}
              />
            </View>

            <View style={styles.titleColumn}>
              <Text
                style={[
                  styles.counterTitle,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                ]}
                numberOfLines={1}>
                {counter.title}
              </Text>

              {/* Badges Row */}
              <View style={styles.badgesRow}>
                {isTwoStep ? (
                  <View style={[styles.badgePill, styles.twoStepPill]}>
                    <ShieldCheck size={9.5} color="#10B981" strokeWidth={2.5} />
                    <Text style={styles.twoStepPillText}>Two-Step</Text>
                  </View>
                ) : (
                  <View style={[styles.badgePill, styles.simplePill]}>
                    <Zap size={9.5} color="#3B82F6" strokeWidth={2.5} />
                    <Text style={styles.simplePillText}>Simple</Text>
                  </View>
                )}

                {!counter.allowNegative && (
                  <View
                    style={[
                      styles.badgePill,
                      isDark ? styles.darkConstraintPill : styles.lightConstraintPill,
                    ]}>
                    <Text
                      style={[
                        styles.constraintText,
                        { color: isDark ? '#94A3B8' : '#475569' },
                      ]}>
                      Min: 0
                    </Text>
                  </View>
                )}

                {counter.disableDecrease && (
                  <View
                    style={[
                      styles.badgePill,
                      {
                        backgroundColor: isDark
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(245, 158, 11, 0.12)',
                      },
                    ]}>
                    <Lock size={8.5} color="#F59E0B" strokeWidth={2.5} />
                    <Text style={styles.incOnlyText}>Inc Only</Text>
                  </View>
                )}

                {step > 1 && (
                  <View
                    style={[
                      styles.badgePill,
                      isDark ? styles.darkConstraintPill : styles.lightConstraintPill,
                    ]}>
                    <Text
                      style={[
                        styles.constraintText,
                        { color: isDark ? '#A5B4FC' : '#6366F1' },
                      ]}>
                      Step: {step}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Quick Actions (Reset & Delete) */}
          <View style={styles.quickActionsGroup}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              onPress={() => onReset(counter)}
              accessibilityLabel={`Reset ${counter.title}`}
              accessibilityRole="button">
              <RotateCcw
                size={13}
                color={isDark ? '#94A3B8' : '#64748B'}
                strokeWidth={2}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.deleteActionBtn,
                {
                  backgroundColor: isDark
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(239, 68, 68, 0.08)',
                },
              ]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              onPress={() => onDelete(counter)}
              accessibilityLabel={`Delete ${counter.title}`}
              accessibilityRole="button">
              <Trash2 size={13} color="#EF4444" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Prominent High-Legibility Tabular Value */}
        <View style={styles.valueContainer}>
          <Text
            style={[
              styles.valueText,
              {
                color: isDark ? '#FFFFFF' : '#0F172A',
                fontVariant: ['tabular-nums'],
              },
              counter.value < 0 && styles.negativeValue,
              counter.value === 0 && (isDark ? styles.zeroValueDark : styles.zeroValueLight),
            ]}
            accessibilityLabel={`Current value is ${counter.value}`}>
            {counter.value}
          </Text>
        </View>

        {/* Main Controls Row */}
        <View style={styles.actionControlsRow}>
          {/* Decrement Button: Strictly conditionally rendered! */}
          {!counter.disableDecrease && (
            <Animated.View
              style={[
                styles.btnSlot,
                { transform: [{ scale: decScaleAnim }] },
              ]}>
              <TouchableOpacity
                style={[
                  styles.glassControlBtn,
                  styles.decBtn,
                  isDark ? styles.decBtnDark : styles.decBtnLight,
                  isDecDisabled && styles.disabledDecBtn,
                ]}
                disabled={isDecDisabled}
                onPress={handleDecrementPress}
                activeOpacity={0.75}
                accessibilityLabel={`Decrease by ${step}`}
                accessibilityRole="button"
                accessibilityState={{ disabled: isDecDisabled }}>
                <Minus
                  size={16}
                  color={
                    isDecDisabled
                      ? isDark
                        ? '#475569'
                        : '#CBD5E1'
                      : isDark
                      ? '#E2E8F0'
                      : '#1E293B'
                  }
                  strokeWidth={2.5}
                />
                <Text
                  style={[
                    styles.btnLabel,
                    {
                      color: isDecDisabled
                        ? isDark
                          ? '#475569'
                          : '#94A3B8'
                        : isDark
                        ? '#E2E8F0'
                        : '#1E293B',
                    },
                  ]}>
                  -{step}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Increment Button: Always present */}
          <Animated.View
            style={[
              styles.btnSlot,
              { transform: [{ scale: incScaleAnim }] },
            ]}>
            <TouchableOpacity
              style={styles.incTouch}
              onPress={handleIncrementPress}
              activeOpacity={0.85}
              accessibilityLabel={`Increase by ${step}`}
              accessibilityRole="button">
              <LinearGradient
                colors={theme.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.incGradient}>
                <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.incBtnLabel}>+{step}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginVertical: 3,
    width: '100%',
    position: 'relative',
  },
  glowBackdrop: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    bottom: -2,
    borderRadius: 20,
    borderWidth: 1,
    opacity: 0.9,
  },
  glassCard: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
  glassCardDark: {
    backgroundColor: 'rgba(18, 24, 38, 0.82)',
  },
  glassCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#64748B',
    shadowOpacity: 0.12,
  },
  specularBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    flex: 1,
  },
  counterTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 1.5,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  twoStepPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
  },
  twoStepPillText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '700',
  },
  simplePill: {
    backgroundColor: 'rgba(59, 130, 246, 0.14)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
  },
  simplePillText: {
    color: '#3B82F6',
    fontSize: 9,
    fontWeight: '700',
  },
  darkConstraintPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  lightConstraintPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  constraintText: {
    fontSize: 9,
    fontWeight: '600',
  },
  incOnlyText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '700',
  },
  quickActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    width: 27,
    height: 27,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionBtn: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
  },
  valueText: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  negativeValue: {
    color: '#F43F5E',
  },
  zeroValueDark: {
    color: '#CBD5E1',
  },
  zeroValueLight: {
    color: '#334155',
  },
  actionControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 1,
  },
  btnSlot: {
    flex: 1,
  },
  glassControlBtn: {
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
  },
  decBtn: {
    borderWidth: 1,
  },
  decBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  decBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  disabledDecBtn: {
    opacity: 0.35,
  },
  btnLabel: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  incTouch: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  incGradient: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  incBtnLabel: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
});
