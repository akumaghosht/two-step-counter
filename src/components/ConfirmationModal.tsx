import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertCircle,
  ArrowRight,
  Check,
  RotateCcw,
  Timer,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { useCounters } from '@/context/CounterContext';

export type DialogVariant = 'increment' | 'decrement' | 'reset' | 'delete' | 'warning-negative';

export interface DialogConfig {
  visible: boolean;
  variant: DialogVariant;
  title: string;
  counterTitle: string;
  message: string;
  currentValue?: number;
  targetValue?: number;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ConfirmationModalProps {
  config: DialogConfig | null;
  onClose: () => void;
}

const AUTO_CANCEL_SECONDS = 5;

export function ConfirmationModal({ config, onClose }: ConfirmationModalProps) {
  const { themeMode } = useCounters();
  const isDark = themeMode === 'dark';

  const [timerProgress] = useState(() => new Animated.Value(1));
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CANCEL_SECONDS);
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isVisible = Boolean(config && config.visible);
  const isStepAction = config?.variant === 'increment' || config?.variant === 'decrement';

  const configRef = useRef(config);
  configRef.current = config;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const clearTimers = React.useCallback(() => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const handleCancel = React.useCallback(() => {
    clearTimers();
    triggerHaptic('light');
    configRef.current?.onCancel?.();
    onCloseRef.current();
  }, [clearTimers]);

  // Auto-dismiss after 5 seconds of inactivity for two-step actions with live countdown
  useEffect(() => {
    if (isVisible && isStepAction) {
      setSecondsLeft(AUTO_CANCEL_SECONDS);
      timerProgress.setValue(1);

      const animation = Animated.timing(timerProgress, {
        toValue: 0,
        duration: AUTO_CANCEL_SECONDS * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      });
      animation.start();

      countdownIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      autoDismissTimerRef.current = setTimeout(() => {
        handleCancel();
      }, AUTO_CANCEL_SECONDS * 1000);

      return () => {
        animation.stop();
        clearTimers();
      };
    } else {
      clearTimers();
    }
  }, [isVisible, isStepAction, handleCancel, timerProgress, clearTimers]);

  if (!config || !config.visible) return null;

  const {
    variant,
    title,
    counterTitle,
    message,
    currentValue,
    targetValue,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
  } = config;

  const isWarningOnly = variant === 'warning-negative';
  const isDelete = variant === 'delete';

  const getAccentConfig = () => {
    switch (variant) {
      case 'increment':
        return {
          Icon: TrendingUp,
          color: '#10B981',
          gradient: ['#10B981', '#059669'] as [string, string],
          tag: 'Two-Step Verification',
        };
      case 'decrement':
        return {
          Icon: TrendingDown,
          color: '#F59E0B',
          gradient: ['#F59E0B', '#D97706'] as [string, string],
          tag: 'Two-Step Verification',
        };
      case 'reset':
        return {
          Icon: RotateCcw,
          color: '#EC4899',
          gradient: ['#EC4899', '#DB2777'] as [string, string],
          tag: 'Reset Counter',
        };
      case 'delete':
        return {
          Icon: Trash2,
          color: '#EF4444',
          gradient: ['#EF4444', '#DC2626'] as [string, string],
          tag: 'Delete Counter',
        };
      case 'warning-negative':
        return {
          Icon: AlertCircle,
          color: '#F59E0B',
          gradient: ['#F59E0B', '#D97706'] as [string, string],
          tag: 'Rule Restricted',
        };
    }
  };

  const accent = getAccentConfig();

  const handleConfirm = () => {
    clearTimers();
    triggerHaptic(isDelete ? 'heavy' : 'medium');
    onConfirm?.();
    onClose();
  };

  const ConfirmActionIcon = isDelete
    ? Trash2
    : variant === 'reset'
    ? RotateCcw
    : isWarningOnly
    ? AlertCircle
    : Check;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={config.visible}
      onRequestClose={handleCancel}>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleCancel}
          accessibilityLabel="Close confirmation backdrop"
        />
        <View
          style={[
            styles.dialogCard,
            isDark ? styles.cardDark : styles.cardLight,
          ]}>
              {/* Header Badge */}
              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.badgePill,
                    {
                      backgroundColor: isDark
                        ? `${accent.color}25`
                        : `${accent.color}18`,
                    },
                  ]}>
                  <accent.Icon size={15} color={accent.color} strokeWidth={2.4} />
                  <Text style={[styles.badgeText, { color: accent.color }]}>
                    {accent.tag}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleCancel}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={[
                    styles.closeBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  ]}
                  accessibilityLabel="Close confirmation modal"
                  accessibilityRole="button">
                  <X
                    size={18}
                    color={isDark ? '#94A3B8' : '#64748B'}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>

              {/* Title & Message */}
              <Text
                style={[
                  styles.dialogTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}>
                {title}
              </Text>
              <Text
                style={[
                  styles.dialogMessage,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                {message.replace('{title}', `"${counterTitle}"`)}
              </Text>

              {/* Value Transition Visual for Two-Step Increment/Decrement */}
              {isStepAction &&
                currentValue !== undefined &&
                targetValue !== undefined && (
                  <View
                    style={[
                      styles.valuePreviewCard,
                      isDark
                        ? styles.valuePreviewDark
                        : styles.valuePreviewLight,
                    ]}>
                    <View style={styles.valueBox}>
                      <Text
                        style={[
                          styles.valueBoxLabel,
                          { color: isDark ? '#64748B' : '#94A3B8' },
                        ]}>
                        Current
                      </Text>
                      <Text
                        style={[
                          styles.valueBoxNum,
                          {
                            color: isDark ? '#CBD5E1' : '#334155',
                            fontVariant: ['tabular-nums'],
                          },
                        ]}>
                        {currentValue}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.arrowBox,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.06)'
                            : 'rgba(0, 0, 0, 0.04)',
                        },
                      ]}>
                      <ArrowRight
                        size={20}
                        color={accent.color}
                        strokeWidth={2.4}
                      />
                    </View>

                    <View
                      style={[
                        styles.valueBox,
                        styles.targetValueBox,
                        {
                          borderColor: accent.color,
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(255, 255, 255, 0.95)',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.valueBoxLabel,
                          { color: accent.color },
                        ]}>
                        New Value
                      </Text>
                      <Text
                        style={[
                          styles.valueBoxNum,
                          {
                            color: isDark ? '#FFFFFF' : '#0F172A',
                            fontVariant: ['tabular-nums'],
                          },
                        ]}>
                        {targetValue}
                      </Text>
                    </View>
                  </View>
                )}

              {/* Auto-Dismiss Timer Indicator */}
              {isStepAction && (
                <View style={styles.timerBarWrapper}>
                  <View
                    style={[
                      styles.timerTrack,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.06)',
                      },
                    ]}>
                    <Animated.View
                      style={[
                        styles.timerBarProgress,
                        {
                          backgroundColor: accent.color,
                          width: timerProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.timerSubTextRow}>
                    <Timer
                      size={13}
                      color={isDark ? '#64748B' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.timerSubText,
                        { color: isDark ? '#64748B' : '#94A3B8' },
                      ]}>
                      Auto-cancels in {secondsLeft}s of inactivity
                    </Text>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                {!isWarningOnly && (
                  <TouchableOpacity
                    style={[
                      styles.cancelBtn,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                      },
                    ]}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                    accessibilityLabel={cancelLabel}
                    accessibilityRole="button">
                    <Text
                      style={[
                        styles.cancelBtnText,
                        { color: isDark ? '#CBD5E1' : '#475569' },
                      ]}>
                      {cancelLabel}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.confirmBtnWrapper,
                    isWarningOnly && styles.fullWidthBtn,
                  ]}
                  onPress={handleConfirm}
                  activeOpacity={0.85}
                  accessibilityLabel={confirmLabel}
                  accessibilityRole="button">
                  <LinearGradient
                    colors={accent.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmBtnGradient}>
                    <ConfirmActionIcon
                      size={18}
                      color="#FFFFFF"
                      strokeWidth={2.4}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.confirmBtnText}>
                      {isWarningOnly ? 'Understood' : confirmLabel}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 20,
  },
  cardDark: {
    backgroundColor: 'rgba(16, 22, 34, 0.96)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  dialogMessage: {
    fontSize: 14.5,
    lineHeight: 22,
    marginBottom: 18,
  },
  valuePreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  valuePreviewDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  valuePreviewLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  valueBox: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  targetValueBox: {
    borderWidth: 1.5,
  },
  valueBoxLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  valueBoxNum: {
    fontSize: 30,
    fontWeight: '900',
  },
  arrowBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBarWrapper: {
    marginBottom: 18,
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  timerTrack: {
    width: '100%',
    height: 3.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerBarProgress: {
    height: '100%',
    borderRadius: 2,
  },
  timerSubTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timerSubText: {
    fontSize: 11.5,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  confirmBtnWrapper: {
    flex: 1.3,
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullWidthBtn: {
    flex: 1,
  },
  confirmBtnGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
