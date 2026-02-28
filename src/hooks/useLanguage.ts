import { useState, useCallback } from 'react';
import type { Language } from '../types';
import { LS_LANG_KEY } from '../lib/constants';

/**
 * Manages the UI language (Italian / English).
 *
 * Initialisation order:
 *  1. localStorage value
 *  2. navigator.language — if it starts with "it" we default to Italian
 *  3. Falls back to 'en'
 *
 * Persists every change to localStorage.
 */
export function useLanguage(): { lang: Language; toggleLang: () => void } {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';

    const stored = localStorage.getItem(LS_LANG_KEY);
    if (stored === 'it' || stored === 'en') return stored;

    return navigator.language.startsWith('it') ? 'it' : 'en';
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Language = prev === 'it' ? 'en' : 'it';
      localStorage.setItem(LS_LANG_KEY, next);
      return next;
    });
  }, []);

  return { lang, toggleLang };
}
