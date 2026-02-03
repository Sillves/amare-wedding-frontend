import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontSize = 'normal' | 'large' | 'x-large';

interface FontSizeState {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const fontSizeClasses: Record<FontSize, string> = {
  'normal': '',
  'large': 'text-scale-lg',
  'x-large': 'text-scale-xl',
};

function applyFontSize(size: FontSize) {
  const root = document.documentElement;
  // Remove all font size classes
  root.classList.remove('text-scale-lg', 'text-scale-xl');
  // Add the new class if not normal
  if (fontSizeClasses[size]) {
    root.classList.add(fontSizeClasses[size]);
  }
}

export const useFontSizeStore = create<FontSizeState>()(
  persist(
    (set) => ({
      fontSize: 'normal',
      setFontSize: (size: FontSize) => {
        applyFontSize(size);
        set({ fontSize: size });
      },
    }),
    {
      name: 'font-size-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyFontSize(state.fontSize);
        }
      },
    }
  )
);
