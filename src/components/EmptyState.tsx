import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calculator,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { useCounters } from '@/context/CounterContext';

interface EmptyStateProps {
  onAddPress: () => void;
  onLoadSamples: () => void;
}

export function EmptyState({ onAddPress, onLoadSamples }: EmptyStateProps) {
  const { themeMode } = useCounters();
  const isDark = themeMode === 'dark';

  return (
    <View style={styles.container}>
      {/* Visual glowing icon display */}
      <View style={styles.glowContainer}>
        <View
          style={[
            styles.glowAura,
            {
              backgroundColor: isDark
                ? 'rgba(99, 102, 241, 0.25)'
                : 'rgba(99, 102, 241, 0.12)',
            },
          ]}
        />
        <LinearGradient
          colors={['#6366F1', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}>
          <Calculator size={42} color="#FFFFFF" strokeWidth={1.8} />
        </LinearGradient>
      </View>

      <Text
        style={[
          styles.title,
          { color: isDark ? '#FFFFFF' : '#0F172A' },
        ]}>
        No Counters Yet
      </Text>
      <Text
        style={[
          styles.description,
          { color: isDark ? '#94A3B8' : '#64748B' },
        ]}>
        Create your first counter to track habits, gym reps, water intake, or critical tallies
        with instant or two-step confirmed updates.
      </Text>

      {/* Feature Pills */}
      <View style={styles.pillRow}>
        <View
          style={[
            styles.featurePill,
            isDark ? styles.pillDark : styles.pillLight,
          ]}>
          <ShieldCheck size={14} color="#10B981" />
          <Text
            style={[
              styles.featurePillText,
              { color: isDark ? '#CBD5E1' : '#334155' },
            ]}>
            Two-Step Confirmed
          </Text>
        </View>
        <View
          style={[
            styles.featurePill,
            isDark ? styles.pillDark : styles.pillLight,
          ]}>
          <Zap size={14} color="#3B82F6" />
          <Text
            style={[
              styles.featurePillText,
              { color: isDark ? '#CBD5E1' : '#334155' },
            ]}>
            Instant Simple
          </Text>
        </View>
        <View
          style={[
            styles.featurePill,
            isDark ? styles.pillDark : styles.pillLight,
          ]}>
          <Lock size={14} color="#F59E0B" />
          <Text
            style={[
              styles.featurePillText,
              { color: isDark ? '#CBD5E1' : '#334155' },
            ]}>
            Custom Constraints
          </Text>
        </View>
      </View>

      {/* Primary Action Button */}
      <TouchableOpacity
        style={styles.primaryBtnWrapper}
        onPress={() => {
          triggerHaptic('medium');
          onAddPress();
        }}
        activeOpacity={0.88}
        accessibilityLabel="Create Your First Counter"
        accessibilityRole="button">
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryBtnGradient}>
          <View style={styles.btnSpecularSheen} />
          <View style={styles.btnIconBadge}>
            <Plus size={16} color="#FFFFFF" strokeWidth={2.8} />
          </View>
          <Text style={styles.primaryBtnText}>Create Your First Counter</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Quick Template Loading */}
      <TouchableOpacity
        style={[
          styles.sampleBtn,
          {
            backgroundColor: isDark
              ? 'rgba(99, 102, 241, 0.12)'
              : 'rgba(99, 102, 241, 0.08)',
            borderColor: isDark
              ? 'rgba(99, 102, 241, 0.3)'
              : 'rgba(99, 102, 241, 0.25)',
          },
        ]}
        onPress={() => {
          triggerHaptic('light');
          onLoadSamples();
        }}
        activeOpacity={0.7}
        accessibilityLabel="Load 3 Ready-to-use Counters"
        accessibilityRole="button">
        <Sparkles size={16} color="#818CF8" />
        <Text
          style={[
            styles.sampleBtnText,
            { color: isDark ? '#C7D2FE' : '#4F46E5' },
          ]}>
          Or Load 3 Ready-to-use Counters
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  glowContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  glowAura: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 360,
    marginBottom: 20,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  pillDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pillLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  featurePillText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  primaryBtnWrapper: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 7,
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
    position: 'relative',
    overflow: 'hidden',
  },
  btnSpecularSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  btnIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  sampleBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
