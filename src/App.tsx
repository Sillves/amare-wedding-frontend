import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { router } from './lib/router';
import { useThemeStore } from './lib/themeStore';
import { applyTheme, getThemeByName } from './lib/themes';
import './lib/i18n'; // Initialize i18n

function App() {
  const { themeName } = useThemeStore();

  useEffect(() => {
    const theme = getThemeByName(themeName);
    if (theme) {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(theme, isDark);
    }
  }, [themeName]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
