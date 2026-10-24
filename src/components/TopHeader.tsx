import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCounters } from '@/context/CounterContext';
import { triggerHaptic } from '@/utils/haptics';

export function TopHeader() {
  const insets = useSafeAreaInsets();
  const { activeTab, themeMode, setIsCreateModalOpen, stats } = useCounters();
  const isDark = themeMode === 'dark';

  const handlePlusPress = () => {
    triggerHaptic('medium');
    setIsCreateModalOpen(true);
  };

  return (
    <View
      style={[
        styles.headerContainer,
        isDark ? styles.headerDark : styles.headerLight,
        {
          paddingTop: Math.max(insets.top, 14),
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}>
      {/* Specular border line at top */}
      <View
        style={[
          styles.specularBar,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(255, 255, 255, 0.8)',
          },
        ]}
      />

      <View style={styles.contentRow}>
        {/* Left Title with App Status */}
        <View style={styles.titleGroup}>
          <Text
            style={[
              styles.screenTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}>
            {activeTab === 'counters' ? 'Counters' : 'Settings'}
          </Text>

          {activeTab === 'counters' && (
            <View style={styles.counterCountPill}>
              <View style={styles.liveGreenDot} />
              <Text
                style={[
                  styles.counterCountText,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                {stats.total === 1 ? '1 counter' : `${stats.total} counters`}
              </Text>
            </View>
          )}
        </View>

        {/* Right Action: Liquid Glass '+' Button (on Counters tab) */}
        {activeTab === 'counters' ? (
          <TouchableOpacity
            style={[
              styles.liquidGlassPlusBtn,
              isDark ? styles.plusBtnDark : styles.plusBtnLight,
            ]}
            onPress={handlePlusPress}
            activeOpacity={0.75}
            accessibilityLabel="Create Counter"
            accessibilityRole="button">
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderRight} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    position: 'relative',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  headerDark: {
    backgroundColor: 'rgba(11, 15, 23, 0.88)',
  },
  headerLight: {
    backgroundColor: 'rgba(241, 245, 249, 0.88)',
  },
  specularBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  counterCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  counterCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  liquidGlassPlusBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  plusBtnDark: {
    backgroundColor: '#6366F1',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  plusBtnLight: {
    backgroundColor: '#4F46E5',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  placeholderRight: {
    width: 42,
    height: 42,
  },
});
