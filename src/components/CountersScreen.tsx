import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ShieldCheck, Zap } from 'lucide-react-native';
import { CounterItem, FilterCategory } from '@/types/counter';
import { useCounters } from '@/context/CounterContext';
import { CounterCard } from '@/components/CounterCard';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmationModal, DialogConfig } from '@/components/ConfirmationModal';
import { triggerHaptic } from '@/utils/haptics';

export function CountersScreen() {
  const {
    counters,
    incrementCounter,
    decrementCounter,
    resetCounter,
    deleteCounter,
    setIsCreateModalOpen,
    loadSamples,
    themeMode,
  } = useCounters();

  const isDark = themeMode === 'dark';
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);

  const filteredCounters = useMemo(() => {
    if (filter === 'all') return counters;
    return counters.filter((c) => c.type === filter);
  }, [counters, filter]);

  const handleIncrementPress = (counter: CounterItem) => {
    const step = counter.stepSize ?? 1;
    const targetValue = counter.value + step;

    if (counter.type === 'two-step') {
      triggerHaptic('medium');
      setDialogConfig({
        visible: true,
        variant: 'increment',
        title: 'Confirm Value Change',
        counterTitle: counter.title,
        message: `Confirm increasing "${counter.title}" by +${step}?`,
        currentValue: counter.value,
        targetValue,
        confirmLabel: `Confirm (+${step})`,
        cancelLabel: 'Cancel',
        onConfirm: async () => {
          await incrementCounter(counter);
        },
      });
    } else {
      triggerHaptic('light');
      incrementCounter(counter);
    }
  };

  const handleDecrementPress = (counter: CounterItem) => {
    const step = counter.stepSize ?? 1;
    let targetValue = counter.value - step;
    if (!counter.allowNegative && targetValue < 0) {
      targetValue = 0;
    }

    if (counter.type === 'two-step') {
      triggerHaptic('medium');
      setDialogConfig({
        visible: true,
        variant: 'decrement',
        title: 'Confirm Value Change',
        counterTitle: counter.title,
        message: `Confirm decreasing "${counter.title}" by -${step}?`,
        currentValue: counter.value,
        targetValue,
        confirmLabel: `Confirm (-${step})`,
        cancelLabel: 'Cancel',
        onConfirm: async () => {
          await decrementCounter(counter);
        },
      });
    } else {
      triggerHaptic('light');
      decrementCounter(counter);
    }
  };

  const handleResetPress = (counter: CounterItem) => {
    triggerHaptic('warning');
    setDialogConfig({
      visible: true,
      variant: 'reset',
      title: 'Reset Counter?',
      counterTitle: counter.title,
      message: `Are you sure you want to reset "${counter.title}" back to 0?`,
      currentValue: counter.value,
      targetValue: 0,
      confirmLabel: 'Reset',
      cancelLabel: 'Keep Current',
      onConfirm: async () => {
        await resetCounter(counter);
      },
    });
  };

  const handleDeletePress = (counter: CounterItem) => {
    triggerHaptic('error');
    setDialogConfig({
      visible: true,
      variant: 'delete',
      title: 'Delete Counter?',
      counterTitle: counter.title,
      message: `Permanently delete "${counter.title}"? Stored counts and rules will be deleted.`,
      currentValue: counter.value,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        await deleteCounter(counter);
      },
    });
  };

  return (
    <View
      style={[
        styles.screenWrap,
        { backgroundColor: isDark ? '#0B0F17' : '#F1F5F9' },
      ]}>
      {/* Background ambient liquid orbs for true glass depth */}
      <View
        style={[
          styles.ambientOrbCyan,
          {
            backgroundColor: isDark
              ? 'rgba(6, 182, 212, 0.12)'
              : 'rgba(6, 182, 212, 0.08)',
          },
        ]}
      />
      <View
        style={[
          styles.ambientOrbViolet,
          {
            backgroundColor: isDark
              ? 'rgba(139, 92, 246, 0.12)'
              : 'rgba(139, 92, 246, 0.08)',
          },
        ]}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {counters.length > 0 && (
          <View
            style={[
              styles.filterBar,
              isDark ? styles.filterBarDark : styles.filterBarLight,
            ]}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === 'all' &&
                  (isDark ? styles.filterTabActiveDark : styles.filterTabActiveLight),
              ]}
              onPress={() => {
                triggerHaptic('light');
                setFilter('all');
              }}
              accessibilityLabel="Show all counters">
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color:
                      filter === 'all'
                        ? isDark
                          ? '#FFFFFF'
                          : '#0F172A'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B',
                    fontWeight: filter === 'all' ? '800' : '600',
                  },
                ]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === 'two-step' &&
                  (isDark ? styles.filterTabActiveDark : styles.filterTabActiveLight),
              ]}
              onPress={() => {
                triggerHaptic('light');
                setFilter('two-step');
              }}
              accessibilityLabel="Show two-step counters">
              <ShieldCheck
                size={13}
                color={
                  filter === 'two-step'
                    ? '#10B981'
                    : isDark
                    ? '#64748B'
                    : '#94A3B8'
                }
                strokeWidth={2.4}
              />
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color:
                      filter === 'two-step'
                        ? isDark
                          ? '#FFFFFF'
                          : '#0F172A'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B',
                    fontWeight: filter === 'two-step' ? '800' : '600',
                  },
                ]}>
                Two-Step
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === 'simple' &&
                  (isDark ? styles.filterTabActiveDark : styles.filterTabActiveLight),
              ]}
              onPress={() => {
                triggerHaptic('light');
                setFilter('simple');
              }}
              accessibilityLabel="Show simple counters">
              <Zap
                size={13}
                color={
                  filter === 'simple'
                    ? '#3B82F6'
                    : isDark
                    ? '#64748B'
                    : '#94A3B8'
                }
                strokeWidth={2.4}
              />
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color:
                      filter === 'simple'
                        ? isDark
                          ? '#FFFFFF'
                          : '#0F172A'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B',
                    fontWeight: filter === 'simple' ? '800' : '600',
                  },
                ]}>
                Simple
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Counter Cards List or Empty State */}
        {filteredCounters.length === 0 ? (
          <EmptyState
            onAddPress={() => setIsCreateModalOpen(true)}
            onLoadSamples={loadSamples}
          />
        ) : (
          <View style={styles.cardsList}>
            {filteredCounters.map((counter) => (
              <CounterCard
                key={counter.id}
                counter={counter}
                onIncrement={handleIncrementPress}
                onDecrement={handleDecrementPress}
                onReset={handleResetPress}
                onDelete={handleDeletePress}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        config={dialogConfig}
        onClose={() => setDialogConfig(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientOrbCyan: {
    position: 'absolute',
    top: 60,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    pointerEvents: 'none',
  },
  ambientOrbViolet: {
    position: 'absolute',
    bottom: 120,
    left: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    pointerEvents: 'none',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110, // Prevents counters from being obscured by floating tab bar
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    gap: 8,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    gap: 6,
    marginBottom: 6,
  },
  filterBarDark: {
    backgroundColor: 'rgba(18, 24, 38, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  filterBarLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
  },
  filterTabActiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  filterTabActiveLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 12.5,
  },
  cardsList: {
    gap: 4,
  },
});
