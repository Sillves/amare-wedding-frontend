import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { themes, applyTheme, getThemeByName, type Theme } from './themes';

interface ThemeState {
  themeName: string;
  setTheme: (themeName: string) => void;
  getCurrentTheme: () => Theme;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeName: 'rose-gold',
      setTheme: (themeName: string) => {
        const theme = getThemeByName(themeName);
        if (theme) {
          const isDark = document.documentElement.classList.contains('dark');
          applyTheme(theme, isDark);
          set({ themeName });
        }
      },
      getCurrentTheme: () => {
        const { themeName } = get();
        return getThemeByName(themeName) || themes[0];
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const theme = getThemeByName(state.themeName);
          if (theme) {
            const isDark = document.documentElement.classList.contains('dark');
            applyTheme(theme, isDark);
          }
        }
      },
    }
  )
);
