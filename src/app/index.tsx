import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useCounters } from '@/context/CounterContext';
import { TopHeader } from '@/components/TopHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { CountersScreen } from '@/components/CountersScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { AddCounterModal } from '@/components/AddCounterModal';

export default function HomeScreen() {
  const {
    activeTab,
    themeMode,
    isCreateModalOpen,
    setIsCreateModalOpen,
    addCounter,
  } = useCounters();

  const isDark = themeMode === 'dark';

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: isDark ? '#0B0F17' : '#F1F5F9' },
      ]}>
      {/* Fixed Top Header (Displays screen title & liquid glass + button on Counters tab) */}
      <TopHeader />

      {/* Main Viewport Content */}
      <View style={styles.viewportContent}>
        {activeTab === 'counters' ? <CountersScreen /> : <SettingsScreen />}
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
  },
  viewportContent: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
});
