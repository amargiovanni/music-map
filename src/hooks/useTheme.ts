import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types';
import { LS_THEME_KEY } from '../lib/constants';

/**
 * Manages the application theme (light/dark).
 *
 * Initialisation order:
 *  1. localStorage value (if present)
 *  2. System preference via matchMedia
 *  3. Falls back to 'light'
 *
 * Keeps the `dark` class on <html> in sync and persists every change
 * to localStorage so the inline script in Layout.astro can apply the
 * correct class before first paint (no flash).
 */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(() => {
    // SSR guard — during server rendering we default to 'light'.
    // The real value is resolved immediately on the client via the
    // inline script in Layout.astro, so the user never sees a flash.
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem(LS_THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Keep the <html> class and localStorage in sync whenever theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(LS_THEME_KEY, theme);
  }, [theme]);

  // Listen for OS-level preference changes as a fallback.
  // Only update if the user hasn't explicitly chosen a theme during this
  // session (we detect this by checking whether the value in state still
  // matches the stored value — if the user toggled manually, the stored
  // value will already differ from the media query).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      // Only follow system preference if nothing is stored yet
      if (!localStorage.getItem(LS_THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
