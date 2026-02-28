import React from 'react';
import type { Language } from '../types';
import { t } from '../i18n/translations';

export interface FABProps {
  lang: Language;
  onClick: () => void;
  isActive: boolean;
}

export function FAB({ lang, onClick, isActive }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={[
        // Base
        'fixed z-50 flex items-center justify-center',
        'text-white font-bold shadow-glow',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2',
        // Mobile: circle
        'bottom-6 right-6 w-14 h-14 rounded-full',
        // Desktop: pill with label
        'md:bottom-8 md:right-8 md:w-auto md:h-auto md:px-5 md:py-3.5 md:rounded-full md:gap-2',
        // Background
        isActive
          ? 'bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500'
          : 'bg-brand-500 hover:bg-brand-600 animate-pulse-glow',
        // Hover scale
        'hover:scale-105 active:scale-95',
      ].join(' ')}
      aria-label={isActive ? 'Close' : t(lang, 'fab.pinSong')}
    >
      {/* Icon with rotation transition */}
      <span
        className={[
          'transition-transform duration-300 inline-flex items-center justify-center',
          isActive ? 'rotate-45' : 'rotate-0',
        ].join(' ')}
      >
        {isActive ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 5l12 12M17 5L5 17" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
            <path d="M16 2v10.28a3.5 3.5 0 11-1.5-2.87V4.56L9 5.84v8.44a3.5 3.5 0 11-1.5-2.87V3.5a1 1 0 01.76-.97l7-1.75A1 1 0 0116 1.75V2z" />
          </svg>
        )}
      </span>

      {/* Desktop label */}
      <span className="hidden md:inline text-sm">
        {isActive ? '' : t(lang, 'fab.pinSong')}
      </span>
    </button>
  );
}
