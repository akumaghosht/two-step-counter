import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { useCounters } from '@/context/CounterContext';
import { triggerHaptic } from '@/utils/haptics';

export function TopHeader() {
  const insets = useSafeAreaInsets();
  const { activeTab, themeMode, setIsCreateModalOpen } = useCounters();
  const isDark = themeMode === 'dark';

  const isCounters = activeTab === 'counters';
  const isFirstRender = useRef(true);

  // btnProgress: 1 = Counters active (button visible), 0 = Settings active (button slid away)
  const btnProgress = useSharedValue(isCounters ? 1 : 0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      btnProgress.value = isCounters ? 1 : 0;
      return;
    }

    btnProgress.value = withSpring(isCounters ? 1 : 0, {
      duration: 420,
      dampingRatio: 0.92,
    });
  }, [isCounters, btnProgress]);

  const handlePressIn = () => {
    pressScale.value = withSpring(0.93, {
      duration: 150,
      dampingRatio: 0.8,
    });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, {
      duration: 250,
      dampingRatio: 0.7,
    });
  };

  const handlePlusPress = () => {
    triggerHaptic('medium');
    setIsCreateModalOpen(true);
  };

  // Button slides smoothly away to the right when moving to Settings
  const animatedAddBtnStyle = useAnimatedStyle(() => {
    const slideRight = (1 - btnProgress.value) * 90;
    return {
      opacity: btnProgress.value,
      transform: [
        { translateX: slideRight },
        { scale: pressScale.value * (0.92 + 0.08 * btnProgress.value) },
      ],
    };
  });

  const countersTitleStyle = useAnimatedStyle(() => ({
    opacity: btnProgress.value,
    transform: [{ translateX: (1 - btnProgress.value) * -14 }],
  }));

  const settingsTitleStyle = useAnimatedStyle(() => ({
    opacity: 1 - btnProgress.value,
    transform: [{ translateX: btnProgress.value * 14 }],
  }));

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
        {/* Left Title: Smooth cross-fade with subtle parallax */}
        <View style={styles.titleGroup}>
          <Animated.View style={countersTitleStyle}>
            <Text
              style={[
                styles.screenTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}>
              Counters
            </Text>
          </Animated.View>
          <Animated.View
            style={[styles.settingsTitleWrap, settingsTitleStyle]}
            pointerEvents={!isCounters ? 'auto' : 'none'}>
            <Text
              style={[
                styles.screenTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}>
              Settings
            </Text>
          </Animated.View>
        </View>

        {/* Right Action: Glowing Gradient Pill Button sliding away to the right */}
        <Animated.View
          style={animatedAddBtnStyle}
          pointerEvents={isCounters ? 'auto' : 'none'}>
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
              <View style={styles.iconCircle}>
                <Plus size={14} color="#FFFFFF" strokeWidth={2.8} />
              </View>
              <Text style={styles.addBtnText}>New Counter</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    position: 'relative',
    justifyContent: 'center',
    minHeight: 34,
  },
  settingsTitleWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
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
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderTopColor: 'rgba(255, 255, 255, 0.55)',
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
