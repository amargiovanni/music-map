import React, { useState, useCallback } from 'react';
import type { Language } from '../types';
import { t } from '../i18n/translations';

interface LandingOverlayProps {
  lang: Language;
  onDismiss: () => void;
  isDev?: boolean;
}

export function LandingOverlay({ lang, onDismiss, isDev }: LandingOverlayProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(onDismiss, 500);
  }, [onDismiss]);

  const handleLogin = useCallback(() => {
    window.location.href = '/api/auth/google/login';
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] w-full overflow-y-auto overflow-x-hidden transition-opacity duration-500 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        {/* Dark glass overlay on map */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-2xl mx-auto animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 3v9.28a3.25 3.25 0 11-1.5-2.74V5.56L8 6.84v7.44a3.25 3.25 0 11-1.5-2.74V4.5a1 1 0 01.76-.97l7-1.75A1 1 0 0115 2.75V3z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Music Map</span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            {t(lang, 'landing.tagline')}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto mb-12 leading-relaxed">
            {t(lang, 'landing.subtitle')}
          </p>

          {/* Auth button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t(lang, 'landing.signInGoogle')}
            </button>
          </div>

          {/* Dev login — only in development */}
          {isDev && (
            <a
              href="/api/auth/dev/login"
              className="flex items-center justify-center gap-2 px-5 py-2.5 mx-auto mb-4 rounded-full border-2 border-dashed border-emerald-500/50 text-emerald-400 font-mono text-xs hover:bg-emerald-500/10 transition-colors duration-200 w-fit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Dev Login
            </a>
          )}

          {/* Explore anonymously */}
          <button
            onClick={handleDismiss}
            className="text-sm text-slate-400 hover:text-brand-400 transition-colors duration-200 underline underline-offset-4"
          >
            {t(lang, 'landing.exploreAnonymously')}
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 inset-x-0 z-10 animate-bounce flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-500">{t(lang, 'landing.scrollHint')}</span>
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Value Props ─────────────────────────────────────────── */}
      <section className="relative w-full px-4 sm:px-6 py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/75 to-slate-950/70 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {/* Privacy */}
            <div className="glass-strong rounded-2xl p-5 sm:p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                {t(lang, 'landing.privacy.title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(lang, 'landing.privacy.desc')}
              </p>
            </div>

            {/* Open Source */}
            <div className="glass-strong rounded-2xl p-5 sm:p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                {t(lang, 'landing.opensource.title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(lang, 'landing.opensource.desc')}
              </p>
            </div>

            {/* Personal Map */}
            <div className="glass-strong rounded-2xl p-5 sm:p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                {t(lang, 'landing.personal.title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(lang, 'landing.personal.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="relative w-full px-4 sm:px-6 py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950/85 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-16">
            {t(lang, 'landing.howItWorks')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-5 ring-2 ring-brand-500/30">
                <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t(lang, 'landing.step1.title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t(lang, 'landing.step1.desc')}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-5 ring-2 ring-brand-500/30">
                <svg className="w-8 h-8 text-brand-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 3v9.28a3.25 3.25 0 11-1.5-2.74V5.56L8 6.84v7.44a3.25 3.25 0 11-1.5-2.74V4.5a1 1 0 01.76-.97l7-1.75A1 1 0 0115 2.75V3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t(lang, 'landing.step2.title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t(lang, 'landing.step2.desc')}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-5 ring-2 ring-brand-500/30">
                <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t(lang, 'landing.step3.title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t(lang, 'landing.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────── */}
      <section className="relative w-full px-4 sm:px-6 py-16 sm:py-24 pb-24 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 to-slate-950/90 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            {t(lang, 'landing.cta')}
          </h2>

          <div className="flex justify-center mb-4">
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t(lang, 'landing.signInGoogle')}
            </button>
          </div>

          {isDev && (
            <a
              href="/api/auth/dev/login"
              className="flex items-center justify-center gap-2 px-5 py-2.5 mx-auto mb-4 rounded-full border-2 border-dashed border-emerald-500/50 text-emerald-400 font-mono text-xs hover:bg-emerald-500/10 transition-colors duration-200 w-fit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Dev Login
            </a>
          )}

          <button
            onClick={handleDismiss}
            className="text-sm text-slate-400 hover:text-brand-400 transition-colors duration-200 underline underline-offset-4"
          >
            {t(lang, 'landing.exploreAnonymously')}
          </button>

          {/* Footer links */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <a
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {t(lang, 'auth.privacy')}
            </a>
            <span className="text-slate-600">·</span>
            <a
              href="https://github.com/amargiovanni/music-map"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
