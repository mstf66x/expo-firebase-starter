import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme } from 'nativewind';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storage-keys';

export type ThemeMode = 'system' | 'light' | 'dark';

/** Push the chosen theme into NativeWind so `dark:` classes resolve correctly. */
const applyTheme = (mode: ThemeMode): void => colorScheme.set(mode);

interface SettingsState {
  themeMode: ThemeMode;
  hasCompletedOnboarding: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      hasCompletedOnboarding: false,
      setThemeMode: (mode) => {
        applyTheme(mode);
        set({ themeMode: mode });
      },
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.themeMode);
      },
    },
  ),
);

export const useThemeMode = (): ThemeMode => useSettingsStore((state) => state.themeMode);
export const useHasCompletedOnboarding = (): boolean =>
  useSettingsStore((state) => state.hasCompletedOnboarding);
