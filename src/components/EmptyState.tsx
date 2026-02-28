import React from 'react';
import type { Language } from '../types';
import { t } from '../i18n/translations';
import { GlassPanel } from './ui/GlassPanel';

export interface EmptyStateProps {
  lang: Language;
}

export function EmptyState({ lang }: EmptyStateProps) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
      <GlassPanel className="pointer-events-auto px-6 py-5 max-w-[280px] text-center animate-fade-in">
        {/* Large music note */}
        <div className="flex justify-center mb-3">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="currentColor"
            className="text-brand-300 dark:text-brand-700 opacity-60"
          >
            <path d="M36 4v27.84A7.5 7.5 0 1132.5 24V12.68L20 15.52v20.32A7.5 7.5 0 1116.5 28V10a2 2 0 011.52-1.94l16-4A2 2 0 0136 6V4z" />
          </svg>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t(lang, 'empty.noPins')}
        </p>
      </GlassPanel>
    </div>
  );
}
