import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import privacyContent from '../i18n/privacy';

export function PrivacyContent() {
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const content = privacyContent[lang];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 transition-colors duration-400">
      {/* Nav bar */}
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-brand-500 hover:opacity-80 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 3v9.28a3.25 3.25 0 11-1.5-2.74V5.56L8 6.84v7.44a3.25 3.25 0 11-1.5-2.74V4.5a1 1 0 01.76-.97l7-1.75A1 1 0 0115 2.75V3z" />
            </svg>
            <span className="font-display font-bold text-slate-900 dark:text-white">Music Map</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="8" cy="8" r="3.5" />
                  <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M13.5 8.5a5.5 5.5 0 01-6-6 5.5 5.5 0 106 6z" />
                </svg>
              )}
            </button>
            <button
              onClick={toggleLang}
              className="h-8 px-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {lang === 'it' ? 'EN' : 'IT'}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {content.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">
          {content.lastUpdated}
        </p>

        <div className="space-y-10">
          {content.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                {section.title}
              </h2>
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <a
            href="/"
            className="text-sm text-brand-500 hover:text-brand-600 transition-colors"
          >
            &larr; {lang === 'it' ? 'Torna a Music Map' : 'Back to Music Map'}
          </a>
        </div>
      </main>
    </div>
  );
}
