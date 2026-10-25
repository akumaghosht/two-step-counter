import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { useCounters } from '@/context/CounterContext';
import { triggerHaptic } from '@/utils/haptics';

export function TopHeader() {
  const insets = useSafeAreaInsets();
  const { activeTab, themeMode, setIsCreateModalOpen } = useCounters();
  const isDark = themeMode === 'dark';

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      speed: 35,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 22,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

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
        {/* Left Title */}
        <View style={styles.titleGroup}>
          <Text
            style={[
              styles.screenTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}>
            {activeTab === 'counters' ? 'Counters' : 'Settings'}
          </Text>
        </View>

        {/* Right Action: Glowing Gradient Pill Button */}
        {activeTab === 'counters' ? (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.addBtnWrapper,
                isDark ? styles.addBtnWrapperDark : styles.addBtnWrapperLight,
              ]}
              onPress={handlePlusPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.88}
              accessibilityLabel="Add New Counter"
              accessibilityRole="button">
              <LinearGradient
                colors={
                  isDark
                    ? ['#6366F1', '#8B5CF6']
                    : ['#4F46E5', '#7C3AED']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addBtnGradient}>
                {/* Specular sheen on top half for realistic liquid glass look */}
                <View style={styles.btnSpecularSheen} />

                <View style={styles.iconCircle}>
                  <Plus size={14} color="#FFFFFF" strokeWidth={2.8} />
                </View>
                <Text style={styles.addBtnText}>New Counter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
  addBtnWrapper: {
    borderRadius: 22,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 6,
  },
  addBtnWrapperDark: {
    shadowColor: '#818CF8',
  },
  addBtnWrapperLight: {
    shadowColor: '#4F46E5',
  },
  addBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingLeft: 7,
    paddingRight: 14,
    borderRadius: 22,
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
    height: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  placeholderRight: {
    width: 42,
    height: 42,
  },
});
