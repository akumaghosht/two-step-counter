import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { CounterProvider, useCounters } from '@/context/CounterContext';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

function RootContent() {
  const { themeMode } = useCounters();
  const isDark = themeMode === 'dark';

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AnimatedSplashOverlay />
      <Slot />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CounterProvider>
        <RootContent />
      </CounterProvider>
    </SafeAreaProvider>
  );
}
