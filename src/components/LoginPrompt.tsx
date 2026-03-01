import React from 'react';
import type { Language } from '../types';
import { t } from '../i18n/translations';

interface LoginPromptProps {
  lang: Language;
  onClose: () => void;
  onLogin: (provider: 'google') => void;
  isDev?: boolean;
}

export function LoginPrompt({ lang, onClose, onLogin, isDev }: LoginPromptProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed z-[61] inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[380px] animate-fade-in">
        <div className="glass-strong rounded-2xl p-8 text-center">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-5">
            <svg className="w-9 h-9 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 3v9.28a3.25 3.25 0 11-1.5-2.74V5.56L8 6.84v7.44a3.25 3.25 0 11-1.5-2.74V4.5a1 1 0 01.76-.97l7-1.75A1 1 0 0115 2.75V3z" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {t(lang, 'landing.loginRequired')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t(lang, 'landing.loginPrompt')}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onLogin('google')}
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t(lang, 'landing.signInGoogle')}
            </button>

            {isDev && (
              <a
                href="/api/auth/dev/login"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-dashed border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-mono text-xs hover:bg-emerald-500/10 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Dev Login
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
