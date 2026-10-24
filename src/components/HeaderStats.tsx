import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FilterCategory } from '@/types/counter';
import { triggerHaptic } from '@/utils/haptics';

interface HeaderStatsProps {
  totalCounters: number;
  twoStepCount: number;
  simpleCount: number;
  totalSum: number;
  selectedFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  onAddPress: () => void;
}

export function HeaderStats({
  totalCounters,
  twoStepCount,
  simpleCount,
  totalSum,
  selectedFilter,
  onSelectFilter,
  onAddPress,
}: HeaderStatsProps) {
  return (
    <View style={styles.container}>
      {/* Top Brand & Add Action Bar */}
      <View style={styles.topRow}>
        <View style={styles.brandGroup}>
          <View style={styles.brandIconWrap}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.brandIconGradient}>
              <Ionicons name="layers" size={18} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.appName}>PulseCounter</Text>
            <View style={styles.statusPill}>
              <View style={styles.pulsingDot} />
              <Text style={styles.statusText}>
                {totalCounters === 1 ? '1 Active Counter' : `${totalCounters} Active Counters`}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBtnWrapper}
          onPress={() => {
            triggerHaptic('medium');
            onAddPress();
          }}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['#6366F1', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtnGradient}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addBtnText}>New Counter</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bento Metric Cards */}
      <View style={styles.bentoStatsRow}>
        <View style={styles.bentoCard}>
          <Text style={styles.bentoLabel}>TOTAL SUM</Text>
          <Text style={styles.bentoValue}>{totalSum}</Text>
          <Text style={styles.bentoSub}>Across all tallies</Text>
        </View>

        <View style={styles.bentoCard}>
          <Text style={styles.bentoLabel}>TWO-STEP</Text>
          <View style={styles.statInline}>
            <Ionicons name="shield-checkmark" size={14} color="#34D399" />
            <Text style={[styles.bentoValue, { color: '#6EE7B7' }]}>{twoStepCount}</Text>
          </View>
          <Text style={styles.bentoSub}>Accident safe</Text>
        </View>

        <View style={styles.bentoCard}>
          <Text style={styles.bentoLabel}>INSTANT</Text>
          <View style={styles.statInline}>
            <Ionicons name="flash" size={14} color="#60A5FA" />
            <Text style={[styles.bentoValue, { color: '#93C5FD' }]}>{simpleCount}</Text>
          </View>
          <Text style={styles.bentoSub}>Fast taps</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'all' && styles.activeFilterTab,
          ]}
          onPress={() => {
            triggerHaptic('light');
            onSelectFilter('all');
          }}>
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'all' && styles.activeFilterTabText,
            ]}>
            All ({totalCounters})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'two-step' && styles.activeFilterTab,
          ]}
          onPress={() => {
            triggerHaptic('light');
            onSelectFilter('two-step');
          }}>
          <Ionicons
            name="shield-checkmark"
            size={12}
            color={selectedFilter === 'two-step' ? '#34D399' : '#64748B'}
          />
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'two-step' && styles.activeFilterTabText,
            ]}>
            Two-Step ({twoStepCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'simple' && styles.activeFilterTab,
          ]}
          onPress={() => {
            triggerHaptic('light');
            onSelectFilter('simple');
          }}>
          <Ionicons
            name="flash"
            size={12}
            color={selectedFilter === 'simple' ? '#60A5FA' : '#64748B'}
          />
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'simple' && styles.activeFilterTabText,
            ]}>
            Simple ({simpleCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  brandIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  addBtnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  addBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bentoStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
  },
  bentoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bentoValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  statInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bentoSub: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
  filterTabsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  activeFilterTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
});
