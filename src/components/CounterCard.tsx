import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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

interface PendingConfirmation {
  type: 'increment' | 'decrement';
  targetValue: number;
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

  // Inline Two-Step Confirmation State
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Micro-animation scale values
  const [incScaleAnim] = useState(() => new Animated.Value(1));
  const [decScaleAnim] = useState(() => new Animated.Value(1));
  const [confirmFadeAnim] = useState(() => new Animated.Value(0));

  const dismissConfirmation = useCallback(() => {
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = null;
    }
    setPendingConfirmation(null);
  }, []);

  // Auto-dismiss confirmation after 4 seconds of inactivity
  useEffect(() => {
    if (pendingConfirmation) {
      Animated.timing(confirmFadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();

      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current);
      }

      confirmTimeoutRef.current = setTimeout(() => {
        dismissConfirmation();
      }, 4000);
    } else {
      Animated.timing(confirmFadeAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current);
      }
    };
  }, [pendingConfirmation, confirmFadeAnim, dismissConfirmation]);

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
    const targetValue = counter.value + step;

    if (isTwoStep) {
      triggerHaptic('light');
      setPendingConfirmation({
        type: 'increment',
        targetValue,
      });
    } else {
      triggerHaptic('medium');
      onIncrement(counter);
    }
  };

  const handleDecrementPress = () => {
    if (counter.disableDecrease) return;

    if (isDecDisabled) {
      triggerHaptic('warning');
      return;
    }

    animatePress(decScaleAnim);
    let targetValue = counter.value - step;
    if (!counter.allowNegative && targetValue < 0) {
      targetValue = 0;
    }

    if (isTwoStep) {
      triggerHaptic('light');
      setPendingConfirmation({
        type: 'decrement',
        targetValue,
      });
    } else {
      triggerHaptic('medium');
      onDecrement(counter);
    }
  };

  const handleConfirmCommit = () => {
    if (!pendingConfirmation) return;
    triggerHaptic('success');
    if (pendingConfirmation.type === 'increment') {
      onIncrement(counter);
    } else {
      onDecrement(counter);
    }
    dismissConfirmation();
  };

  const handleCancelCommit = () => {
    triggerHaptic('light');
    dismissConfirmation();
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
              <Ionicons
                name={(counter.iconName || 'sparkles') as any}
                size={18}
                color={theme.primary}
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
                    <Ionicons name="shield-checkmark" size={10} color="#10B981" />
                    <Text style={styles.twoStepPillText}>Two-Step</Text>
                  </View>
                ) : (
                  <View style={[styles.badgePill, styles.simplePill]}>
                    <Ionicons name="flash" size={10} color="#3B82F6" />
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
                    <Ionicons name="lock-closed" size={9} color="#F59E0B" />
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
              onPress={() => onReset(counter)}
              accessibilityLabel={`Reset ${counter.title}`}
              accessibilityRole="button">
              <Ionicons
                name="refresh-outline"
                size={16}
                color={isDark ? '#94A3B8' : '#64748B'}
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
              onPress={() => onDelete(counter)}
              accessibilityLabel={`Delete ${counter.title}`}
              accessibilityRole="button">
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
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

          {counter.notes ? (
            <Text
              style={[
                styles.notesText,
                { color: isDark ? '#64748B' : '#64748B' },
              ]}
              numberOfLines={1}>
              {counter.notes}
            </Text>
          ) : null}
        </View>

        {/* Controls Container with Inline Two-Step Confirmation Popover */}
        <View style={styles.controlsRowWrapper}>
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
                  <Ionicons
                    name="remove"
                    size={22}
                    color={
                      isDecDisabled
                        ? isDark
                          ? '#475569'
                          : '#CBD5E1'
                        : isDark
                        ? '#E2E8F0'
                        : '#1E293B'
                    }
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
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                  <Text style={styles.incBtnLabel}>+{step}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Inline Liquid Glass Two-Step Confirmation Pill Overlay */}
          {pendingConfirmation && (
            <Animated.View
              style={[
                styles.inlineConfirmOverlay,
                isDark ? styles.confirmOverlayDark : styles.confirmOverlayLight,
                { opacity: confirmFadeAnim },
              ]}>
              <View style={styles.confirmPromptCol}>
                <Text
                  style={[
                    styles.confirmPromptTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}>
                  Confirm change to{' '}
                  <Text style={{ color: theme.primary, fontWeight: '900' }}>
                    {pendingConfirmation.targetValue}
                  </Text>
                  ?
                </Text>
                <Text
                  style={[
                    styles.confirmSubText,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}>
                  {counter.value} → {pendingConfirmation.targetValue} (auto-cancels in 4s)
                </Text>
              </View>

              <View style={styles.confirmActionsRow}>
                <TouchableOpacity
                  style={[
                    styles.glassPillBtn,
                    styles.cancelPillBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.06)',
                    },
                  ]}
                  onPress={handleCancelCommit}
                  activeOpacity={0.8}
                  accessibilityLabel="Cancel value change"
                  accessibilityRole="button">
                  <Ionicons
                    name="close"
                    size={16}
                    color={isDark ? '#E2E8F0' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.pillBtnText,
                      { color: isDark ? '#E2E8F0' : '#475569' },
                    ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.glassPillBtn, styles.confirmCommitBtn]}
                  onPress={handleConfirmCommit}
                  activeOpacity={0.85}
                  accessibilityLabel="Confirm value change"
                  accessibilityRole="button">
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmCommitGradient}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    <Text style={styles.confirmCommitText}>Confirm</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginVertical: 10,
    width: '100%',
    position: 'relative',
  },
  glowBackdrop: {
    position: 'absolute',
    top: 2,
    left: 6,
    right: 6,
    bottom: -2,
    borderRadius: 28,
    borderWidth: 1,
    opacity: 0.9,
  },
  glassCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    flex: 1,
  },
  counterTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2.5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  twoStepPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
  },
  twoStepPillText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '700',
  },
  simplePill: {
    backgroundColor: 'rgba(59, 130, 246, 0.14)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
  },
  simplePillText: {
    color: '#3B82F6',
    fontSize: 10.5,
    fontWeight: '700',
  },
  darkConstraintPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  lightConstraintPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  constraintText: {
    fontSize: 10,
    fontWeight: '600',
  },
  incOnlyText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700',
  },
  quickActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
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
    paddingVertical: 18,
  },
  valueText: {
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: -1,
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
  notesText: {
    fontSize: 12.5,
    marginTop: 4,
    fontWeight: '500',
  },
  controlsRowWrapper: {
    position: 'relative',
    marginTop: 4,
  },
  actionControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnSlot: {
    flex: 1,
  },
  glassControlBtn: {
    paddingVertical: 13,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
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
    fontSize: 17,
    fontWeight: '800',
  },
  incTouch: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  incGradient: {
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  incBtnLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  inlineConfirmOverlay: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmOverlayDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderColor: 'rgba(16, 185, 129, 0.45)',
  },
  confirmOverlayLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  confirmPromptCol: {
    flex: 1,
    paddingRight: 8,
  },
  confirmPromptTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  confirmSubText: {
    fontSize: 10.5,
    marginTop: 2,
  },
  confirmActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glassPillBtn: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelPillBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  pillBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  confirmCommitBtn: {
    overflow: 'hidden',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  confirmCommitGradient: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
  },
  confirmCommitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
