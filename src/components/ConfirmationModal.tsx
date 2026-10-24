import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { triggerHaptic } from '@/utils/haptics';

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

export function ConfirmationModal({ config, onClose }: ConfirmationModalProps) {
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
    onCancel,
  } = config;

  const isWarningOnly = variant === 'warning-negative';
  const isDelete = variant === 'delete';
  const isStepAction = variant === 'increment' || variant === 'decrement';

  const getAccentConfig = () => {
    switch (variant) {
      case 'increment':
        return {
          icon: 'trending-up' as const,
          color: '#10B981',
          gradient: ['#10B981', '#059669'] as [string, string],
          tag: 'Two-Step Verification',
        };
      case 'decrement':
        return {
          icon: 'trending-down' as const,
          color: '#F59E0B',
          gradient: ['#F59E0B', '#D97706'] as [string, string],
          tag: 'Two-Step Verification',
        };
      case 'reset':
        return {
          icon: 'refresh' as const,
          color: '#EC4899',
          gradient: ['#EC4899', '#DB2777'] as [string, string],
          tag: 'Reset Counter',
        };
      case 'delete':
        return {
          icon: 'trash' as const,
          color: '#EF4444',
          gradient: ['#EF4444', '#DC2626'] as [string, string],
          tag: 'Delete Counter',
        };
      case 'warning-negative':
        return {
          icon: 'alert-circle' as const,
          color: '#F59E0B',
          gradient: ['#F59E0B', '#D97706'] as [string, string],
          tag: 'Rule Restricted',
        };
    }
  };

  const accent = getAccentConfig();

  const handleConfirm = () => {
    triggerHaptic(isDelete ? 'heavy' : 'medium');
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    triggerHaptic('light');
    onCancel?.();
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={config.visible}
      onRequestClose={handleCancel}>
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.dialogCard}>
              {/* Header Badge */}
              <View style={styles.headerRow}>
                <View style={[styles.badgePill, { backgroundColor: `${accent.color}20` }]}>
                  <Ionicons name={accent.icon} size={15} color={accent.color} />
                  <Text style={[styles.badgeText, { color: accent.color }]}>{accent.tag}</Text>
                </View>
                <TouchableOpacity
                  onPress={handleCancel}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.closeBtn}>
                  <Ionicons name="close" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Title & Message */}
              <Text style={styles.dialogTitle}>{title}</Text>
              <Text style={styles.dialogMessage}>
                {message.replace('{title}', `"${counterTitle}"`)}
              </Text>

              {/* Value Transition Visual for Two-Step Increment/Decrement */}
              {isStepAction && currentValue !== undefined && targetValue !== undefined && (
                <View style={styles.valuePreviewCard}>
                  <View style={styles.valueBox}>
                    <Text style={styles.valueBoxLabel}>Current</Text>
                    <Text style={styles.valueBoxNum}>{currentValue}</Text>
                  </View>
                  <View style={styles.arrowBox}>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={accent.color}
                    />
                  </View>
                  <View style={[styles.valueBox, styles.targetValueBox, { borderColor: accent.color }]}>
                    <Text style={[styles.valueBoxLabel, { color: accent.color }]}>New Value</Text>
                    <Text style={[styles.valueBoxNum, { color: '#FFFFFF' }]}>{targetValue}</Text>
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actionRow}>
                {!isWarningOnly && (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCancel}
                    activeOpacity={0.7}>
                    <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.confirmBtnWrapper, isWarningOnly && styles.fullWidthBtn]}
                  onPress={handleConfirm}
                  activeOpacity={0.85}>
                  <LinearGradient
                    colors={accent.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmBtnGradient}>
                    <Text style={styles.confirmBtnText}>
                      {isWarningOnly ? 'Understood' : confirmLabel}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 15, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#161922',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  dialogMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: '#94A3B8',
    marginBottom: 20,
  },
  valuePreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  valueBox: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  targetValueBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
  },
  valueBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  valueBoxNum: {
    fontSize: 28,
    fontWeight: '900',
    color: '#CBD5E1',
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmBtnWrapper: {
    flex: 1.2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullWidthBtn: {
    flex: 1,
  },
  confirmBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
