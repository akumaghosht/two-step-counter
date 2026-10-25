import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useCounters } from '@/context/CounterContext';
import { TopHeader } from '@/components/TopHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { CountersScreen } from '@/components/CountersScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { AddCounterModal } from '@/components/AddCounterModal';

const initialWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const {
    activeTab,
    themeMode,
    isCreateModalOpen,
    setIsCreateModalOpen,
    addCounter,
  } = useCounters();

  const isDark = themeMode === 'dark';
  const [viewportWidth, setViewportWidth] = useState(initialWidth);
  const isFirstRender = useRef(true);

  // tabProgress: 0 = Counters active, 1 = Settings active
  const tabProgress = useSharedValue(activeTab === 'counters' ? 0 : 1);

  const handleViewportLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - viewportWidth) > 1) {
      setViewportWidth(w);
    }
  };

  useEffect(() => {
    const target = activeTab === 'counters' ? 0 : 1;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      tabProgress.value = target;
      return;
    }

    // Fluid spring physics with gentle settling
    tabProgress.value = withSpring(target, {
      duration: 440,
      dampingRatio: 0.94,
    });
  }, [activeTab, tabProgress]);

  const animatedTrackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -tabProgress.value * viewportWidth }],
  }));

  // Subtle opacity & scale depth on leaving/entering elements for maximum fluidity
  const countersAnimatedStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(1, 1 - tabProgress.value));
    return {
      opacity: 0.28 + 0.72 * p,
      transform: [{ scale: 0.965 + 0.035 * p }],
    };
  });

  const settingsAnimatedStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(1, tabProgress.value));
    return {
      opacity: 0.28 + 0.72 * p,
      transform: [{ scale: 0.965 + 0.035 * p }],
    };
  });

  return (
    <View
      style={[
        styles.rootContainer,
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

      {/* Fixed Top Header (Displays screen title & liquid glass + button on Counters tab) */}
      <TopHeader />

      {/* Main Viewport Content with animated sliding elements */}
      <View
        style={styles.viewportContent}
        onLayout={handleViewportLayout}>
        <Animated.View
          style={[
            styles.slidingTrack,
            { width: viewportWidth * 2 },
            animatedTrackStyle,
          ]}>
          <View
            style={[styles.screenPanel, { width: viewportWidth }]}
            pointerEvents={activeTab === 'counters' ? 'auto' : 'none'}>
            <Animated.View style={[styles.panelInner, countersAnimatedStyle]}>
              <CountersScreen />
            </Animated.View>
          </View>
          <View
            style={[styles.screenPanel, { width: viewportWidth }]}
            pointerEvents={activeTab === 'settings' ? 'auto' : 'none'}>
            <Animated.View style={[styles.panelInner, settingsAnimatedStyle]}>
              <SettingsScreen />
            </Animated.View>
          </View>
        </Animated.View>
      </View>

      {/* Floating Liquid Glass Bottom Navigation Bar */}
      <BottomTabBar />

      {/* Create Counter Modal */}
      <AddCounterModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddCounter={addCounter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  viewportContent: {
    flex: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  slidingTrack: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  screenPanel: {
    height: '100%',
  },
  panelInner: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
