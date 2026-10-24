import AsyncStorage from '@react-native-async-storage/async-storage';
import { CounterItem, ThemeMode } from '@/types/counter';

const COUNTERS_META_KEY = '@tsc_counters_metadata_v2';
const THEME_STORAGE_KEY = '@tsc_theme_preference_v2';

export const SAMPLE_COUNTERS: CounterItem[] = [
  {
    id: 'sample-water',
    title: 'Daily Water (Glasses)',
    type: 'two-step',
    allowNegative: false,
    disableDecrease: false,
    storageKey: 'tsc_counter_val_sample-water',
    value: 6,
    themeId: 'cyan-pulse',
    iconName: 'water',
    createdAt: Date.now() - 86400000 * 2,
    notes: 'Goal: 8 glasses daily with tap confirmation',
    stepSize: 1,
  },
  {
    id: 'sample-gym',
    title: 'Bench Press Sets',
    type: 'simple',
    allowNegative: false,
    disableDecrease: false,
    storageKey: 'tsc_counter_val_sample-gym',
    value: 4,
    themeId: 'sunset-coral',
    iconName: 'barbell',
    createdAt: Date.now() - 86400000,
    notes: 'Fast instant counter during workouts',
    stepSize: 1,
  },
  {
    id: 'sample-coffee',
    title: 'Espresso Shots',
    type: 'two-step',
    allowNegative: false,
    disableDecrease: true,
    storageKey: 'tsc_counter_val_sample-coffee',
    value: 2,
    themeId: 'solar-amber',
    iconName: 'cafe',
    createdAt: Date.now() - 3600000 * 5,
    notes: 'Increment only - never un-drink a coffee!',
    stepSize: 1,
  },
];

// Fallback-safe storage methods
async function safeGetItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function safeSetItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // ignore
      }
    }
  }
}

async function safeRemoveItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
  }
}

export async function loadAllCounters(): Promise<CounterItem[]> {
  try {
    const rawMeta = await safeGetItem(COUNTERS_META_KEY);
    if (!rawMeta) {
      return [];
    }

    const metaList: CounterItem[] = JSON.parse(rawMeta);
    if (!Array.isArray(metaList)) {
      return [];
    }

    // Load individual stored values using their specific storageKeys
    const populated = await Promise.all(
      metaList.map(async (item) => {
        try {
          const storedVal = await safeGetItem(item.storageKey);
          const parsedVal = storedVal !== null ? parseInt(storedVal, 10) : item.value ?? 0;
          return {
            ...item,
            value: isNaN(parsedVal) ? 0 : parsedVal,
            stepSize: item.stepSize ?? 1,
          };
        } catch {
          return {
            ...item,
            stepSize: item.stepSize ?? 1,
          };
        }
      })
    );

    return populated;
  } catch (error) {
    console.error('Failed to load counters from storage:', error);
    return [];
  }
}

export async function saveCounterMetaList(counters: CounterItem[]): Promise<void> {
  try {
    const sanitized = counters.map((c) => ({
      id: c.id,
      title: c.title,
      type: c.type,
      allowNegative: c.allowNegative,
      disableDecrease: c.disableDecrease,
      storageKey: c.storageKey,
      value: c.value,
      themeId: c.themeId,
      iconName: c.iconName,
      createdAt: c.createdAt,
      lastUpdated: c.lastUpdated,
      notes: c.notes,
      stepSize: c.stepSize ?? 1,
    }));
    await safeSetItem(COUNTERS_META_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.error('Failed to save counter metadata list:', error);
  }
}

export async function saveCounterValue(storageKey: string, value: number): Promise<void> {
  try {
    await safeSetItem(storageKey, String(value));
  } catch (error) {
    console.error(`Failed to save value for storageKey ${storageKey}:`, error);
  }
}

export async function deleteCounterAndValue(id: string, storageKey: string): Promise<void> {
  try {
    await safeRemoveItem(storageKey);
    const current = await loadAllCounters();
    const updated = current.filter((c) => c.id !== id);
    await saveCounterMetaList(updated);
  } catch (error) {
    console.error(`Failed to delete counter ${id}:`, error);
  }
}

export async function resetCounterValue(storageKey: string): Promise<void> {
  try {
    await safeSetItem(storageKey, '0');
  } catch (error) {
    console.error(`Failed to reset storageKey ${storageKey}:`, error);
  }
}

export async function resetAllCounterValues(): Promise<CounterItem[]> {
  try {
    const list = await loadAllCounters();
    const updated = list.map((c) => ({
      ...c,
      value: 0,
      lastUpdated: Date.now(),
    }));
    await saveCounterMetaList(updated);
    for (const item of updated) {
      await safeSetItem(item.storageKey, '0');
    }
    return updated;
  } catch (error) {
    console.error('Failed to reset all counters:', error);
    return [];
  }
}

export async function populateSampleCounters(): Promise<CounterItem[]> {
  try {
    await saveCounterMetaList(SAMPLE_COUNTERS);
    for (const item of SAMPLE_COUNTERS) {
      await safeSetItem(item.storageKey, String(item.value));
    }
    return SAMPLE_COUNTERS;
  } catch (error) {
    console.error('Failed to populate sample counters:', error);
    return [];
  }
}

export async function clearAllCounters(): Promise<void> {
  try {
    const list = await loadAllCounters();
    for (const c of list) {
      await safeRemoveItem(c.storageKey);
    }
    await safeRemoveItem(COUNTERS_META_KEY);
  } catch (error) {
    console.error('Failed to clear all counters:', error);
  }
}

export async function loadSavedTheme(): Promise<ThemeMode> {
  try {
    const stored = await safeGetItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return 'dark'; // Default Dark Mode as required
  } catch {
    return 'dark';
  }
}

export async function saveThemePreference(theme: ThemeMode): Promise<void> {
  try {
    await safeSetItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}
