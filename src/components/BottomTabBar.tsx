import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layers, Settings } from 'lucide-react-native';
import { useCounters } from '@/context/CounterContext';
import { triggerHaptic } from '@/utils/haptics';

export function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const { activeTab, setActiveTab, themeMode } = useCounters();
  const isDark = themeMode === 'dark';

  const [countersTabScale] = useState(() => new Animated.Value(1));
  const [settingsTabScale] = useState(() => new Animated.Value(1));

  const animatePress = (animVal: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animVal, {
        toValue: 0.92,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(animVal, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTabPress = (tab: 'counters' | 'settings') => {
    if (tab === activeTab) return;
    triggerHaptic('light');
    if (tab === 'counters') {
      animatePress(countersTabScale);
    } else {
      animatePress(settingsTabScale);
    }
    setActiveTab(tab);
  };

  return (
    <View
      style={[
        styles.floatingContainer,
        {
          bottom: Math.max(insets.bottom + 10, 18),
        },
      ]}>
      {/* Outer Glow aura */}
      <View
        style={[
          styles.ambientGlow,
          {
            backgroundColor: isDark
              ? 'rgba(99, 102, 241, 0.15)'
              : 'rgba(99, 102, 241, 0.08)',
          },
        ]}
      />

      <View
        style={[
          styles.glassBar,
          isDark ? styles.glassBarDark : styles.glassBarLight,
          {
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.85)',
          },
        ]}>
        {/* Specular highlight on top edge */}
        <View
          style={[
            styles.specularBar,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.22)'
                : 'rgba(255, 255, 255, 0.95)',
            },
          ]}
        />

        {/* Tab 1: Counters */}
        <Animated.View
          style={[
            styles.tabWrapper,
            { transform: [{ scale: countersTabScale }] },
          ]}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'counters' &&
                (isDark ? styles.activeTabDark : styles.activeTabLight),
            ]}
            onPress={() => handleTabPress('counters')}
            activeOpacity={0.8}
            accessibilityLabel="Counters tab"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'counters' }}>
            <Layers
              size={19}
              color={
                activeTab === 'counters'
                  ? '#6366F1'
                  : isDark
                  ? '#94A3B8'
                  : '#64748B'
              }
              strokeWidth={activeTab === 'counters' ? 2.4 : 1.8}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    activeTab === 'counters'
                      ? isDark
                        ? '#FFFFFF'
                        : '#0F172A'
                      : isDark
                      ? '#94A3B8'
                      : '#64748B',
                  fontWeight: activeTab === 'counters' ? '800' : '600',
                },
              ]}>
              Counters
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Tab 2: Settings */}
        <Animated.View
          style={[
            styles.tabWrapper,
            { transform: [{ scale: settingsTabScale }] },
          ]}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'settings' &&
                (isDark ? styles.activeTabDark : styles.activeTabLight),
            ]}
            onPress={() => handleTabPress('settings')}
            activeOpacity={0.8}
            accessibilityLabel="Settings tab"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'settings' }}>
            <Settings
              size={19}
              color={
                activeTab === 'settings'
                  ? '#6366F1'
                  : isDark
                  ? '#94A3B8'
                  : '#64748B'
              }
              strokeWidth={activeTab === 'settings' ? 2.4 : 1.8}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    activeTab === 'settings'
                      ? isDark
                        ? '#FFFFFF'
                        : '#0F172A'
                      : isDark
                      ? '#94A3B8'
                      : '#64748B',
                  fontWeight: activeTab === 'settings' ? '800' : '600',
                },
              ]}>
              Settings
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 30,
    pointerEvents: 'box-none',
  },
  ambientGlow: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    bottom: -2,
    borderRadius: 28,
  },
  glassBar: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  glassBarDark: {
    backgroundColor: 'rgba(15, 20, 32, 0.88)',
  },
  glassBarLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#64748B',
    shadowOpacity: 0.18,
  },
  specularBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  tabWrapper: {
    flex: 1,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  activeTabDark: {
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
    borderColor: 'rgba(99, 102, 241, 0.35)',
    borderWidth: 1,
  },
  activeTabLight: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 13.5,
    letterSpacing: -0.1,
  },
});
