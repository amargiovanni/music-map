import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Pin, Language, Theme } from '../types';
import { t } from '../i18n/translations';
import { DEBOUNCE_MS } from '../lib/constants';
import { GlassPanel } from './ui/GlassPanel';
import { SearchPanel } from './SearchPanel';

export interface TopBarProps {
  lang: Language;
  theme: Theme;
  onSearch: (query: string) => void;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onNearMe: () => void;
  onRandomPin: () => void;
  searchResults: Pin[];
  onSelectSearchResult: (pin: Pin) => void;
}

export function TopBar({
  lang,
  theme,
  onSearch,
  onToggleTheme,
  onToggleLang,
  onNearMe,
  onRandomPin,
  searchResults,
  onSelectSearchResult,
}: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setIsSearching(true);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value.trim()) {
        setIsSearching(false);
        setShowResults(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        onSearch(value);
        setIsSearching(false);
        setShowResults(true);
      }, DEBOUNCE_MS);
    },
    [onSearch]
  );

  // Show results when they arrive
  useEffect(() => {
    if (searchResults.length > 0 && searchQuery.trim()) {
      setShowResults(true);
    }
  }, [searchResults, searchQuery]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Focus input when opened on mobile
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const closeSearch = () => {
    setShowResults(false);
    if (!searchQuery.trim()) {
      setSearchOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <GlassPanel
        strong
        className="mx-3 mt-3 pointer-events-auto"
      >
        <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5">
          {/* Logo */}
          {(!searchOpen || window.innerWidth >= 768) && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-brand-500 text-lg" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 3v9.28a3.25 3.25 0 11-1.5-2.74V5.56L8 6.84v7.44a3.25 3.25 0 11-1.5-2.74V4.5a1 1 0 01.76-.97l7-1.75A1 1 0 0115 2.75V3z" />
                </svg>
              </span>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white hidden sm:inline">
                Music Map
              </span>
            </div>
          )}

          {/* Search — desktop (always visible) */}
          <div className="hidden md:flex flex-1 justify-center relative">
            <div className="relative w-full max-w-sm">
              <input
                ref={inputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t(lang, 'search.placeholder')}
                className="w-full glass rounded-full px-4 py-2 pl-10 text-sm
                           text-slate-900 dark:text-white
                           placeholder:text-slate-400 dark:placeholder:text-slate-500
                           focus:outline-none focus:ring-2 focus:ring-brand-500/50
                           transition-all duration-200"
              />
              {/* Search icon */}
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="6" cy="6" r="4.5" />
                  <path d="M9.5 9.5L13 13" />
                </svg>
              </span>

              {/* Results dropdown */}
              {showResults && (
                <SearchPanel
                  results={searchResults}
                  lang={lang}
                  onSelect={onSelectSearchResult}
                  onClose={closeSearch}
                  isLoading={isSearching}
                  query={searchQuery}
                />
              )}
            </div>
          </div>

          {/* Search — mobile (expandable) */}
          <div className="flex-1 flex md:hidden relative">
            {searchOpen ? (
              <div className="flex-1 relative animate-fade-in">
                <input
                  ref={inputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t(lang, 'search.placeholder')}
                  className="w-full glass rounded-full px-4 py-2 pl-9 text-sm
                             text-slate-900 dark:text-white
                             placeholder:text-slate-400 dark:placeholder:text-slate-500
                             focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  onBlur={() => {
                    if (!searchQuery.trim()) {
                      setTimeout(() => setSearchOpen(false), 200);
                    }
                  }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="6" cy="6" r="4.5" />
                    <path d="M9.5 9.5L13 13" />
                  </svg>
                </span>

                {showResults && (
                  <SearchPanel
                    results={searchResults}
                    lang={lang}
                    onSelect={onSelectSearchResult}
                    onClose={closeSearch}
                    isLoading={isSearching}
                    query={searchQuery}
                  />
                )}
              </div>
            ) : (
              <div className="flex-1" />
            )}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Mobile search toggle */}
            {!searchOpen && (
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full
                           text-slate-600 dark:text-slate-300
                           hover:bg-slate-100 dark:hover:bg-slate-800
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                aria-label={t(lang, 'search.placeholder')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" />
                </svg>
              </button>
            )}

            {/* Near me */}
            <button
              onClick={onNearMe}
              className="w-9 h-9 flex items-center justify-center rounded-full
                         text-slate-600 dark:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         hover:text-brand-500
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              aria-label={t(lang, 'search.nearMe')}
              title={t(lang, 'search.nearMe')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="3" />
                <path d="M8 1v3M8 12v3M1 8h3M12 8h3" />
              </svg>
            </button>

            {/* Random pin */}
            <button
              onClick={onRandomPin}
              className="w-9 h-9 flex items-center justify-center rounded-full
                         text-slate-600 dark:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         hover:text-brand-500
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              aria-label={t(lang, 'discovery.random')}
              title={t(lang, 'discovery.random')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <circle cx="5.5" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
                <circle cx="10.5" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
                <circle cx="8" cy="8" r="0.75" fill="currentColor" stroke="none" />
                <circle cx="5.5" cy="10.5" r="0.75" fill="currentColor" stroke="none" />
                <circle cx="10.5" cy="10.5" r="0.75" fill="currentColor" stroke="none" />
              </svg>
            </button>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full
                         text-slate-600 dark:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                /* Sun icon */
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="8" cy="8" r="3.5" />
                  <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
                </svg>
              ) : (
                /* Moon icon */
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M13.5 8.5a5.5 5.5 0 01-6-6 5.5 5.5 0 106 6z" />
                </svg>
              )}
            </button>

            {/* Language toggle */}
            <button
              onClick={onToggleLang}
              className="h-9 px-2.5 flex items-center justify-center rounded-full
                         text-xs font-bold
                         text-slate-600 dark:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              aria-label={t(lang, 'misc.language')}
            >
              {lang === 'it' ? 'EN' : 'IT'}
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
