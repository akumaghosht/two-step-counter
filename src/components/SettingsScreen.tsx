import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Calculator,
  ChevronRight,
  Layers,
  Moon,
  Palette,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  Zap,
} from 'lucide-react-native';
import { useCounters } from '@/context/CounterContext';
import { triggerHaptic } from '@/utils/haptics';
import { ConfirmationModal, DialogConfig } from '@/components/ConfirmationModal';

export function SettingsScreen() {
  const {
    themeMode,
    setThemeMode,
    stats,
    resetAllCounters,
    clearAllData,
    loadSamples,
  } = useCounters();

  const isDark = themeMode === 'dark';
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);

  const handleToggleTheme = (mode: 'dark' | 'light') => {
    triggerHaptic('light');
    setThemeMode(mode);
  };

  const handleResetAllPress = () => {
    triggerHaptic('warning');
    setDialogConfig({
      visible: true,
      variant: 'reset',
      title: 'Reset All Counters?',
      counterTitle: 'All Active Counters',
      message:
        'This will reset the value of all counters back to 0. Counters and their rules will be preserved.',
      confirmLabel: 'Reset All',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        await resetAllCounters();
      },
    });
  };

  const handleClearAllPress = () => {
    triggerHaptic('error');
    setDialogConfig({
      visible: true,
      variant: 'delete',
      title: 'Delete All Counters?',
      counterTitle: 'Permanent Purge',
      message:
        'Are you sure you want to delete all counters? This action cannot be undone.',
      confirmLabel: 'Delete All',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        await clearAllData();
      },
    });
  };

  const handleLoadSamplesPress = () => {
    triggerHaptic('medium');
    setDialogConfig({
      visible: true,
      variant: 'increment',
      title: 'Load Ready Counters?',
      counterTitle: 'Starter Kit',
      message:
        'This will populate 3 pre-configured counters (Water, Gym, Espresso) showcasing Two-Step, Min:0, and Inc-Only rules.',
      confirmLabel: 'Load Starters',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        await loadSamples();
      },
    });
  };

  return (
    <ScrollView
      style={[
        styles.scrollContainer,
        { backgroundColor: isDark ? '#0B0F17' : '#F1F5F9' },
      ]}
      contentContainerStyle={styles.contentWrap}
      showsVerticalScrollIndicator={false}>
      {/* 1. Theme Switcher Section */}
      <View style={styles.sectionBlock}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#94A3B8' : '#64748B' },
          ]}>
          APPEARANCE & THEME
        </Text>

        <View
          style={[
            styles.glassPanel,
            styles.themePanel,
            isDark ? styles.panelDark : styles.panelLight,
          ]}>
          <View style={styles.themeToggleRow}>
            <View style={styles.themeInfoCol}>
              <Text
                style={[
                  styles.cardMainText,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}>
                Interface Mode
              </Text>
            </View>

            {/* Segmented Switch */}
            <View
              style={[
                styles.themeSwitchGroup,
                isDark ? styles.themeSwitchDark : styles.themeSwitchLight,
              ]}>
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  !isDark && styles.themeOptionActiveLight,
                ]}
                onPress={() => handleToggleTheme('light')}
                activeOpacity={0.8}
                accessibilityLabel="Switch to Light Theme">
                <Sun
                  size={16}
                  color={!isDark ? '#F59E0B' : '#94A3B8'}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: !isDark ? '#0F172A' : '#94A3B8' },
                  ]}>
                  Light
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  isDark && styles.themeOptionActiveDark,
                ]}
                onPress={() => handleToggleTheme('dark')}
                activeOpacity={0.8}
                accessibilityLabel="Switch to Dark Theme">
                <Moon
                  size={16}
                  color={isDark ? '#818CF8' : '#64748B'}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: isDark ? '#FFFFFF' : '#64748B' },
                  ]}>
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Bento App Stats Section */}
      <View style={styles.sectionBlock}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#94A3B8' : '#64748B' },
          ]}>
          METRICS & TOTALS
        </Text>

        <View style={styles.bentoGrid}>
          {/* Total Counters */}
          <View
            style={[
              styles.bentoTile,
              isDark ? styles.tileDark : styles.tileLight,
            ]}>
            <View style={styles.bentoTop}>
              <Layers size={18} color="#6366F1" strokeWidth={2} />
              <Text
                style={[
                  styles.bentoTag,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                ACTIVE
              </Text>
            </View>
            <Text
              style={[
                styles.bentoNumber,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}>
              {stats.total}
            </Text>
            <Text
              style={[
                styles.bentoLabel,
                { color: isDark ? '#64748B' : '#94A3B8' },
              ]}>
              Total Counters
            </Text>
          </View>

          {/* Net Sum */}
          <View
            style={[
              styles.bentoTile,
              isDark ? styles.tileDark : styles.tileLight,
            ]}>
            <View style={styles.bentoTop}>
              <Calculator size={18} color="#10B981" strokeWidth={2} />
              <Text
                style={[
                  styles.bentoTag,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                NET SUM
              </Text>
            </View>
            <Text
              style={[
                styles.bentoNumber,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}>
              {stats.sum}
            </Text>
            <Text
              style={[
                styles.bentoLabel,
                { color: isDark ? '#64748B' : '#94A3B8' },
              ]}>
              Combined Values
            </Text>
          </View>

          {/* Two-Step Protected */}
          <View
            style={[
              styles.bentoTile,
              isDark ? styles.tileDark : styles.tileLight,
            ]}>
            <View style={styles.bentoTop}>
              <ShieldCheck size={18} color="#34D399" strokeWidth={2} />
              <Text
                style={[
                  styles.bentoTag,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                TWO-STEP
              </Text>
            </View>
            <Text
              style={[
                styles.bentoNumber,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}>
              {stats.twoStep}
            </Text>
            <Text
              style={[
                styles.bentoLabel,
                { color: isDark ? '#64748B' : '#94A3B8' },
              ]}>
              Confirmation Safe
            </Text>
          </View>

          {/* Simple Instant */}
          <View
            style={[
              styles.bentoTile,
              isDark ? styles.tileDark : styles.tileLight,
            ]}>
            <View style={styles.bentoTop}>
              <Zap size={18} color="#60A5FA" strokeWidth={2} />
              <Text
                style={[
                  styles.bentoTag,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                INSTANT
              </Text>
            </View>
            <Text
              style={[
                styles.bentoNumber,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}>
              {stats.simple}
            </Text>
            <Text
              style={[
                styles.bentoLabel,
                { color: isDark ? '#64748B' : '#94A3B8' },
              ]}>
              Fast One-Tap
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Data Controls Section */}
      <View style={styles.sectionBlock}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#94A3B8' : '#64748B' },
          ]}>
          DATA MANAGEMENT
        </Text>

        <View
          style={[
            styles.glassPanel,
            isDark ? styles.panelDark : styles.panelLight,
          ]}>
          {/* Load Sample Counters */}
          <TouchableOpacity
            style={styles.dataActionRow}
            onPress={handleLoadSamplesPress}
            activeOpacity={0.7}>
            <View
              style={[
                styles.dataActionIcon,
                {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(99, 102, 241, 0.1)',
                },
              ]}>
              <Sparkles size={18} color="#6366F1" strokeWidth={2} />
            </View>
            <View style={styles.dataActionInfo}>
              <Text
                style={[
                  styles.dataActionTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}>
                Load Starter Template Counters
              </Text>
              <Text
                style={[
                  styles.dataActionDesc,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                Adds sample counters showcasing two-step and lock constraints
              </Text>
            </View>
            <ChevronRight
              size={18}
              color={isDark ? '#64748B' : '#94A3B8'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.dividerLine,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          />

          {/* Reset All Values to 0 */}
          <TouchableOpacity
            style={styles.dataActionRow}
            onPress={handleResetAllPress}
            activeOpacity={0.7}>
            <View
              style={[
                styles.dataActionIcon,
                {
                  backgroundColor: isDark
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(245, 158, 11, 0.1)',
                },
              ]}>
              <RotateCcw size={18} color="#F59E0B" strokeWidth={2} />
            </View>
            <View style={styles.dataActionInfo}>
              <Text
                style={[
                  styles.dataActionTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}>
                Reset All Values to 0
              </Text>
              <Text
                style={[
                  styles.dataActionDesc,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                Zeroes out current tally without removing any counters
              </Text>
            </View>
            <ChevronRight
              size={18}
              color={isDark ? '#64748B' : '#94A3B8'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.dividerLine,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          />

          {/* Clear All Counters */}
          <TouchableOpacity
            style={styles.dataActionRow}
            onPress={handleClearAllPress}
            activeOpacity={0.7}>
            <View
              style={[
                styles.dataActionIcon,
                {
                  backgroundColor: isDark
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(239, 68, 68, 0.1)',
                },
              ]}>
              <Trash2 size={18} color="#EF4444" strokeWidth={2} />
            </View>
            <View style={styles.dataActionInfo}>
              <Text style={[styles.dataActionTitle, { color: '#EF4444' }]}>
                Clear All Data
              </Text>
              <Text
                style={[
                  styles.dataActionDesc,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}>
                Permanently purge all counters and reset application state
              </Text>
            </View>
            <ChevronRight
              size={18}
              color={isDark ? '#64748B' : '#94A3B8'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. About System & Ergonomics */}
      <View style={styles.sectionBlock}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#94A3B8' : '#64748B' },
          ]}>
          LIQUID GLASS 2.0 SYSTEM
        </Text>

        <View
          style={[
            styles.glassPanel,
            isDark ? styles.panelDark : styles.panelLight,
          ]}>
          <View style={styles.aboutRow}>
            <Smartphone size={18} color="#6366F1" strokeWidth={2} />
            <Text
              style={[
                styles.aboutLabel,
                { color: isDark ? '#E2E8F0' : '#1E293B' },
              ]}>
              Safe Area Insets: Fully active with notch and gesture bar compensation
            </Text>
          </View>
          <View style={styles.aboutRow}>
            <ShieldCheck size={18} color="#10B981" strokeWidth={2} />
            <Text
              style={[
                styles.aboutLabel,
                { color: isDark ? '#E2E8F0' : '#1E293B' },
              ]}>
              Two-Step Flow: Prevents unintended count mutations with 5s auto-dismiss
            </Text>
          </View>
          <View style={styles.aboutRow}>
            <Palette size={18} color="#F59E0B" strokeWidth={2} />
            <Text
              style={[
                styles.aboutLabel,
                { color: isDark ? '#E2E8F0' : '#1E293B' },
              ]}>
              Liquid Glass: Multi-layered frosted glass with specular highlight lines
            </Text>
          </View>
        </View>
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        config={dialogConfig}
        onClose={() => setDialogConfig(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // Ensure bottom content is never obscured by floating tab bar
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    gap: 24,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginLeft: 4,
  },
  glassPanel: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  panelDark: {
    backgroundColor: '#121826',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  panelLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  themePanel: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  themeInfoCol: {
    flex: 1,
  },
  cardMainText: {
    fontSize: 15,
    fontWeight: '700',
  },
  themeSwitchGroup: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 2.5,
    borderWidth: 1,
  },
  themeSwitchDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  themeSwitchLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  themeOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  themeOptionActiveDark: {
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
  },
  themeOptionActiveLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bentoTile: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 6,
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tileDark: {
    backgroundColor: '#121826',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tileLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  bentoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bentoTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bentoNumber: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  bentoLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  dataActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  dataActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataActionInfo: {
    flex: 1,
  },
  dataActionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  dataActionDesc: {
    fontSize: 11.5,
    marginTop: 2,
  },
  dividerLine: {
    height: 1,
    marginVertical: 4,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  aboutLabel: {
    fontSize: 12.5,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
});
