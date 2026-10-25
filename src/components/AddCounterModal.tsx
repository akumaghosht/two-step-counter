import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertCircle,
  ArrowUpCircle,
  Ban,
  Check,
  CheckCircle2,
  Plus,
  PlusCircle,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react-native';
import { CounterIcon } from '@/components/CounterIcon';
import { CounterItem, CounterType } from '@/types/counter';
import { AVAILABLE_ICONS, COUNTER_THEMES, getThemeById } from '@/constants/palettes';
import { triggerHaptic } from '@/utils/haptics';
import { useCounters } from '@/context/CounterContext';

interface AddCounterModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCounter: (counter: Omit<CounterItem, 'id' | 'storageKey' | 'createdAt'>) => void;
}

const STEP_PRESETS = [1, 5, 10];

export function AddCounterModal({ visible, onClose, onAddCounter }: AddCounterModalProps) {
  const { counters, themeMode } = useCounters();
  const isDark = themeMode === 'dark';

  const defaultName = useMemo(() => `Counter ${counters.length + 1}`, [counters.length]);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<CounterType>('two-step');
  const [allowNegative, setAllowNegative] = useState(false);
  const [disableDecrease, setDisableDecrease] = useState(false);
  const [initialValueStr, setInitialValueStr] = useState('0');
  const [stepSize, setStepSize] = useState<number>(1);
  const [selectedThemeId, setSelectedThemeId] = useState(COUNTER_THEMES[0].id);
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const [errorMsg, setErrorMsg] = useState('');

  const currentTheme = getThemeById(selectedThemeId);

  const resetForm = () => {
    setTitle('');
    setType('two-step');
    setAllowNegative(false);
    setDisableDecrease(false);
    setInitialValueStr('0');
    setStepSize(1);
    setSelectedThemeId(COUNTER_THEMES[0].id);
    setSelectedIcon(AVAILABLE_ICONS[0]);
    setErrorMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = () => {
    // If submitted empty or whitespace, assign defaultName automatically
    const finalTitle = title.trim() ? title.trim() : defaultName;

    const parsedVal = parseInt(initialValueStr, 10);
    const initialVal = isNaN(parsedVal) ? 0 : parsedVal;

    if (!allowNegative && initialVal < 0) {
      setErrorMsg('Initial value cannot be negative when Disable Negative is active.');
      triggerHaptic('error');
      return;
    }

    triggerHaptic('success');
    onAddCounter({
      title: finalTitle,
      type,
      allowNegative,
      disableDecrease,
      value: initialVal,
      stepSize: Math.max(1, stepSize),
      themeId: selectedThemeId,
      iconName: selectedIcon,
    });

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityLabel="Close creation modal backdrop"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
          pointerEvents="box-none">
          <View
            style={[
              styles.modalCard,
              isDark ? styles.modalDark : styles.modalLight,
            ]}>
            {/* Header */}
            <View
              style={[
                styles.modalHeader,
                {
                  borderBottomColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
              ]}>
              <View style={styles.headerTitleGroup}>
                <View
                  style={[
                    styles.headerIconWrap,
                    {
                      backgroundColor: isDark
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(99, 102, 241, 0.1)',
                    },
                  ]}>
                  <PlusCircle size={22} color="#6366F1" strokeWidth={2.2} />
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}>
                  New Counter
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.closeIconBtn,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                ]}
                onPress={handleClose}
                accessibilityLabel="Close creation modal"
                accessibilityRole="button">
                <X
                  size={20}
                  color={isDark ? '#94A3B8' : '#64748B'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <ScrollView
              style={styles.formScroll}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              bounces={true}
              contentContainerStyle={styles.formContent}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.groupLabel,
                    { color: isDark ? '#E2E8F0' : '#1E293B' },
                  ]}>
                  Counter Name
                </Text>
                <View
                  style={[
                    styles.glassInputWrap,
                    isDark ? styles.glassInputDark : styles.glassInputLight,
                  ]}>
                  <TextInput
                    style={[
                      styles.textInput,
                      { color: isDark ? '#FFFFFF' : '#0F172A' },
                    ]}
                    placeholder={defaultName}
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    value={title}
                    onChangeText={(t) => {
                      setTitle(t);
                      if (errorMsg) setErrorMsg('');
                    }}
                    maxLength={40}
                    returnKeyType="done"
                  />
                </View>
                <Text
                  style={[
                    styles.inputHelp,
                    { color: isDark ? '#64748B' : '#94A3B8' },
                  ]}>
                  Leave blank to automatically assign {defaultName}
                </Text>
              </View>

              {/* Segmented Glass Switch for Counter Type */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.groupLabel,
                    { color: isDark ? '#E2E8F0' : '#1E293B' },
                  ]}>
                  Counter Type
                </Text>
                <View
                  style={[
                    styles.segmentedSwitch,
                    isDark ? styles.segmentedDark : styles.segmentedLight,
                  ]}>
                  {/* Two-Step Option */}
                  <TouchableOpacity
                    style={[
                      styles.segmentBtn,
                      type === 'two-step' &&
                      (isDark
                        ? styles.segmentActiveDark
                        : styles.segmentActiveLight),
                    ]}
                    onPress={() => {
                      triggerHaptic('light');
                      setType('two-step');
                    }}
                    activeOpacity={0.8}>
                    <ShieldCheck
                      size={15}
                      color={
                        type === 'two-step'
                          ? '#10B981'
                          : isDark
                            ? '#64748B'
                            : '#94A3B8'
                      }
                      strokeWidth={2.4}
                    />
                    <View style={styles.segmentTextCol}>
                      <Text
                        style={[
                          styles.segmentTitle,
                          {
                            color:
                              type === 'two-step'
                                ? isDark
                                  ? '#FFFFFF'
                                  : '#0F172A'
                                : isDark
                                  ? '#94A3B8'
                                  : '#64748B',
                          },
                        ]}>
                        Two-Step
                      </Text>
                      <Text
                        style={[
                          styles.segmentDesc,
                          { color: isDark ? '#64748B' : '#94A3B8' },
                        ]}>
                        Requires confirm
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Simple Option */}
                  <TouchableOpacity
                    style={[
                      styles.segmentBtn,
                      type === 'simple' &&
                      (isDark
                        ? styles.segmentActiveDark
                        : styles.segmentActiveLight),
                    ]}
                    onPress={() => {
                      triggerHaptic('light');
                      setType('simple');
                    }}
                    activeOpacity={0.8}>
                    <Zap
                      size={15}
                      color={
                        type === 'simple'
                          ? '#3B82F6'
                          : isDark
                            ? '#64748B'
                            : '#94A3B8'
                      }
                      strokeWidth={2.4}
                    />
                    <View style={styles.segmentTextCol}>
                      <Text
                        style={[
                          styles.segmentTitle,
                          {
                            color:
                              type === 'simple'
                                ? isDark
                                  ? '#FFFFFF'
                                  : '#0F172A'
                                : isDark
                                  ? '#94A3B8'
                                  : '#64748B',
                          },
                        ]}>
                        Simple
                      </Text>
                      <Text
                        style={[
                          styles.segmentDesc,
                          { color: isDark ? '#64748B' : '#94A3B8' },
                        ]}>
                        Instant tap
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Constraint Toggles */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.groupLabel,
                    { color: isDark ? '#E2E8F0' : '#1E293B' },
                  ]}>
                  Counter Constraints
                </Text>

                {/* Disable Negative Values */}
                <View
                  style={[
                    styles.constraintCard,
                    isDark ? styles.constraintDark : styles.constraintLight,
                  ]}>
                  <View style={styles.constraintInfo}>
                    <View style={styles.constraintTitleRow}>
                      <Ban size={16} color="#EC4899" strokeWidth={2.2} />
                      <Text
                        style={[
                          styles.constraintTitle,
                          { color: isDark ? '#F8FAFC' : '#0F172A' },
                        ]}>
                        Disable Negative Values
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.constraintSub,
                        { color: isDark ? '#94A3B8' : '#64748B' },
                      ]}>
                      Prevents value from dropping below 0
                    </Text>
                  </View>
                  <Switch
                    value={!allowNegative}
                    onValueChange={(val) => {
                      triggerHaptic('light');
                      setAllowNegative(!val);
                    }}
                    trackColor={{
                      false: isDark ? '#334155' : '#CBD5E1',
                      true: '#EC4899',
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Disable Decrement Option */}
                <View
                  style={[
                    styles.constraintCard,
                    isDark ? styles.constraintDark : styles.constraintLight,
                  ]}>
                  <View style={styles.constraintInfo}>
                    <View style={styles.constraintTitleRow}>
                      <ArrowUpCircle
                        size={16}
                        color="#F59E0B"
                        strokeWidth={2.2}
                      />
                      <Text
                        style={[
                          styles.constraintTitle,
                          { color: isDark ? '#F8FAFC' : '#0F172A' },
                        ]}>
                        Disable Decrement Option
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.constraintSub,
                        { color: isDark ? '#94A3B8' : '#64748B' },
                      ]}>
                      Hides minus (−) button completely (Increment only)
                    </Text>
                  </View>
                  <Switch
                    value={disableDecrease}
                    onValueChange={(val) => {
                      triggerHaptic('light');
                      setDisableDecrease(val);
                    }}
                    trackColor={{
                      false: isDark ? '#334155' : '#CBD5E1',
                      true: '#F59E0B',
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* Initial Value & Step Size Row */}
              <View style={styles.rowTwoCols}>
                {/* Initial Value */}
                <View style={styles.colHalf}>
                  <Text
                    style={[
                      styles.groupLabel,
                      { color: isDark ? '#E2E8F0' : '#1E293B' },
                    ]}>
                    Initial Value
                  </Text>
                  <View
                    style={[
                      styles.glassInputWrap,
                      isDark ? styles.glassInputDark : styles.glassInputLight,
                    ]}>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          color: isDark ? '#FFFFFF' : '#0F172A',
                          fontVariant: ['tabular-nums'],
                        },
                      ]}
                      keyboardType="numeric"
                      value={initialValueStr}
                      onChangeText={(v) => {
                        setInitialValueStr(v);
                        if (errorMsg) setErrorMsg('');
                      }}
                    />
                  </View>
                </View>

                {/* Step Size */}
                <View style={styles.colHalf}>
                  <Text
                    style={[
                      styles.groupLabel,
                      { color: isDark ? '#E2E8F0' : '#1E293B' },
                    ]}>
                    Step Size
                  </Text>
                  <View style={styles.stepPillsRow}>
                    {STEP_PRESETS.map((p) => {
                      const active = stepSize === p;
                      return (
                        <TouchableOpacity
                          key={p}
                          style={[
                            styles.stepPill,
                            active
                              ? { backgroundColor: currentTheme.primary }
                              : isDark
                                ? styles.stepPillDark
                                : styles.stepPillLight,
                          ]}
                          onPress={() => {
                            triggerHaptic('light');
                            setStepSize(p);
                          }}>
                          <Text
                            style={[
                              styles.stepPillText,
                              {
                                color: active
                                  ? '#FFFFFF'
                                  : isDark
                                    ? '#94A3B8'
                                    : '#475569',
                              },
                            ]}>
                            {p}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Theme Accent Selection */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.groupLabel,
                    { color: isDark ? '#E2E8F0' : '#1E293B' },
                  ]}>
                  Visual Palette
                </Text>
                <View style={styles.paletteRow}>
                  {COUNTER_THEMES.map((th) => {
                    const selected = th.id === selectedThemeId;
                    return (
                      <TouchableOpacity
                        key={th.id}
                        style={[
                          styles.paletteCircle,
                          { backgroundColor: th.primary },
                          selected && styles.paletteSelected,
                        ]}
                        onPress={() => {
                          triggerHaptic('light');
                          setSelectedThemeId(th.id);
                        }}>
                        {selected && (
                          <Check size={14} color="#FFFFFF" strokeWidth={3} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Icon Selection */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.groupLabel,
                    { color: isDark ? '#E2E8F0' : '#1E293B' },
                  ]}>
                  Icon
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.iconsRow}>
                  {AVAILABLE_ICONS.map((iconName) => {
                    const isSelected = iconName === selectedIcon;
                    return (
                      <TouchableOpacity
                        key={iconName}
                        style={[
                          styles.iconSelectBtn,
                          isSelected
                            ? {
                              backgroundColor: currentTheme.primary,
                              borderColor: currentTheme.primary,
                            }
                            : isDark
                              ? styles.iconBtnDark
                              : styles.iconBtnLight,
                        ]}
                        onPress={() => {
                          triggerHaptic('light');
                          setSelectedIcon(iconName);
                        }}>
                        <CounterIcon
                          name={iconName}
                          size={18}
                          color={
                            isSelected
                              ? '#FFFFFF'
                              : isDark
                                ? '#94A3B8'
                                : '#64748B'
                          }
                          strokeWidth={2.2}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {errorMsg ? (
                <View style={styles.errorBanner}>
                  <AlertCircle size={16} color="#EF4444" strokeWidth={2} />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}
            </ScrollView>

            {/* Modal Footer Actions */}
            <View
              style={[
                styles.modalFooter,
                {
                  borderTopColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.08)',
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.cancelModalBtn,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                ]}
                onPress={handleClose}>
                <Text
                  style={[
                    styles.cancelBtnText,
                    { color: isDark ? '#E2E8F0' : '#475569' },
                  ]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitModalBtn,
                  {
                    shadowColor: currentTheme.primary,
                  },
                ]}
                onPress={handleCreate}
                activeOpacity={0.85}>
                <LinearGradient
                  colors={currentTheme.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}>
                  <View style={styles.modalBtnSheen} />
                  <View style={styles.submitIconBadge}>
                    <Plus size={15} color="#FFFFFF" strokeWidth={2.8} />
                  </View>
                  <Text style={styles.submitBtnText}>Add Counter</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '100%',
    maxHeight: '100%',
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
  },
  modalDark: {
    backgroundColor: 'rgba(15, 20, 32, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  modalLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  closeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: {
    maxHeight: 460,
    flexShrink: 1,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  glassInputWrap: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  glassInputDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  glassInputLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  textInput: {
    fontSize: 15,
    fontWeight: '600',
    padding: 0,
  },
  inputHelp: {
    fontSize: 11,
  },
  segmentedSwitch: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    gap: 6,
  },
  segmentedDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  segmentedLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  segmentActiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  segmentActiveLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentTextCol: {
    alignItems: 'flex-start',
  },
  segmentTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  segmentDesc: {
    fontSize: 10,
  },
  constraintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  constraintDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  constraintLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  constraintInfo: {
    flex: 1,
    paddingRight: 10,
  },
  constraintTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  constraintTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  constraintSub: {
    fontSize: 11,
    marginTop: 2,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  colHalf: {
    flex: 1,
    gap: 8,
  },
  stepPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  stepPillDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepPillLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  stepPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  paletteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paletteCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteSelected: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.15 }],
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  iconSelectBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconBtnLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  cancelModalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitModalBtn: {
    flex: 2,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  submitGradient: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
    position: 'relative',
    overflow: 'hidden',
  },
  modalBtnSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  submitIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
