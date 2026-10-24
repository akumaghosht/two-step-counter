import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CounterItem, ThemeMode } from '@/types/counter';
import {
  clearAllCounters,
  deleteCounterAndValue,
  loadAllCounters,
  loadSavedTheme,
  populateSampleCounters,
  resetAllCounterValues,
  resetCounterValue,
  SAMPLE_COUNTERS,
  saveCounterMetaList,
  saveCounterValue,
  saveThemePreference,
} from '@/storage/counterStorage';

interface CounterContextType {
  counters: CounterItem[];
  isLoading: boolean;
  activeTab: 'counters' | 'settings';
  setActiveTab: (tab: 'counters' | 'settings') => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  addCounter: (item: Omit<CounterItem, 'id' | 'storageKey' | 'createdAt'>) => Promise<void>;
  incrementCounter: (counter: CounterItem) => Promise<void>;
  decrementCounter: (counter: CounterItem) => Promise<void>;
  resetCounter: (counter: CounterItem) => Promise<void>;
  deleteCounter: (counter: CounterItem) => Promise<void>;
  resetAllCounters: () => Promise<void>;
  clearAllData: () => Promise<void>;
  loadSamples: () => Promise<void>;
  stats: {
    total: number;
    twoStep: number;
    simple: number;
    sum: number;
  };
}

const CounterContext = createContext<CounterContextType | null>(null);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [counters, setCounters] = useState<CounterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'counters' | 'settings'>('counters');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load initial data and theme on mount
  useEffect(() => {
    async function init() {
      try {
        const [savedTheme, loadedCounters] = await Promise.all([
          loadSavedTheme(),
          loadAllCounters(),
        ]);

        setThemeModeState(savedTheme);
        // Apply HTML attribute on web
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', savedTheme);
        }

        if (loadedCounters.length === 0) {
          // Populate sample counters on first launch
          const samples = await populateSampleCounters();
          setCounters(samples);
        } else {
          setCounters(loadedCounters);
        }
      } catch (err) {
        console.error('Failed to init counter context:', err);
        setCounters(SAMPLE_COUNTERS);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
    await saveThemePreference(mode);
  };

  const toggleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
  };

  const addCounter = async (
    itemData: Omit<CounterItem, 'id' | 'storageKey' | 'createdAt'>
  ) => {
    const id = `counter_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const storageKey = `tsc_val_${id}`;
    const newCounter: CounterItem = {
      ...itemData,
      id,
      storageKey,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      stepSize: itemData.stepSize ?? 1,
    };

    const updated = [newCounter, ...counters];
    setCounters(updated);
    await saveCounterMetaList(updated);
    await saveCounterValue(storageKey, newCounter.value);
  };

  const incrementCounter = async (counter: CounterItem) => {
    const step = counter.stepSize ?? 1;
    const newValue = counter.value + step;

    setCounters((prev) =>
      prev.map((c) =>
        c.id === counter.id ? { ...c, value: newValue, lastUpdated: Date.now() } : c
      )
    );
    await saveCounterValue(counter.storageKey, newValue);
  };

  const decrementCounter = async (counter: CounterItem) => {
    if (counter.disableDecrease) return;

    const step = counter.stepSize ?? 1;
    let newValue = counter.value - step;
    if (!counter.allowNegative && newValue < 0) {
      newValue = 0;
    }

    setCounters((prev) =>
      prev.map((c) =>
        c.id === counter.id ? { ...c, value: newValue, lastUpdated: Date.now() } : c
      )
    );
    await saveCounterValue(counter.storageKey, newValue);
  };

  const resetCounter = async (counter: CounterItem) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === counter.id ? { ...c, value: 0, lastUpdated: Date.now() } : c))
    );
    await resetCounterValue(counter.storageKey);
  };

  const deleteCounter = async (counter: CounterItem) => {
    setCounters((prev) => prev.filter((c) => c.id !== counter.id));
    await deleteCounterAndValue(counter.id, counter.storageKey);
  };

  const resetAllCounters = async () => {
    const updated = await resetAllCounterValues();
    setCounters(updated);
  };

  const clearAllData = async () => {
    await clearAllCounters();
    setCounters([]);
  };

  const loadSamples = async () => {
    const samples = await populateSampleCounters();
    setCounters(samples);
  };

  const stats = useMemo(() => {
    const total = counters.length;
    let twoStep = 0;
    let simple = 0;
    let sum = 0;

    for (const c of counters) {
      if (c.type === 'two-step') twoStep++;
      else simple++;
      sum += c.value;
    }

    return { total, twoStep, simple, sum };
  }, [counters]);

  return (
    <CounterContext.Provider
      value={{
        counters,
        isLoading,
        activeTab,
        setActiveTab,
        themeMode,
        setThemeMode,
        toggleTheme,
        isCreateModalOpen,
        setIsCreateModalOpen,
        addCounter,
        incrementCounter,
        decrementCounter,
        resetCounter,
        deleteCounter,
        resetAllCounters,
        clearAllData,
        loadSamples,
        stats,
      }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounters() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounters must be used within a CounterProvider');
  }
  return context;
}
