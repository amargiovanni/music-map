import React from 'react';
import type { Pin, Language } from '../types';
import { t } from '../i18n/translations';
import { GlassPanel } from './ui/GlassPanel';
import { VinylSpinner } from './ui/VinylSpinner';

export interface SearchPanelProps {
  results: Pin[];
  lang: Language;
  onSelect: (pin: Pin) => void;
  onClose: () => void;
  isLoading: boolean;
  query: string;
}

export function SearchPanel({
  results,
  lang,
  onSelect,
  onClose,
  isLoading,
  query,
}: SearchPanelProps) {
  if (!query.trim()) return null;

  return (
    <>
      {/* Backdrop to close panel */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <GlassPanel
        strong
        className="absolute top-full left-0 right-0 mt-2 z-50 p-2 max-h-[320px] overflow-y-auto animate-fade-in"
      >
        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-6">
            <VinylSpinner size="sm" />
          </div>
        )}

        {/* No results */}
        {!isLoading && results.length === 0 && (
          <div className="flex items-center justify-center py-6 text-sm text-slate-400 dark:text-slate-500">
            {t(lang, 'empty.noResults')}
          </div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <ul className="flex flex-col" role="listbox">
            {results.slice(0, 5).map((pin) => (
              <li key={pin.id}>
                <button
                  onClick={() => {
                    onSelect(pin);
                    onClose();
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left
                             hover:bg-white/50 dark:hover:bg-slate-800/50
                             transition-colors duration-150
                             focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  role="option"
                  aria-selected={false}
                >
                  <img
                    src={pin.thumbnail_url}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {pin.song_title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {pin.artist_name}
                      {pin.city && (
                        <span className="text-slate-400 dark:text-slate-500">
                          {' '}
                          &middot; {pin.city}
                        </span>
                      )}
                    </p>
                  </div>
                  {/* Arrow icon */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-slate-300 dark:text-slate-600 flex-shrink-0"
                  >
                    <path d="M5 3l4 4-4 4" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </GlassPanel>
    </>
  );
}
