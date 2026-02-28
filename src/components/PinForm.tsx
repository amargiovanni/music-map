import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Language, SongInfo } from '../types';
import { t } from '../i18n/translations';
import { fetchSongInfo } from '../lib/api';
import { SPOTIFY_URL_REGEX, YOUTUBE_URL_REGEX, APPLE_MUSIC_URL_REGEX, MAX_MEMORY_LENGTH } from '../lib/constants';
import { BottomSheet } from './ui/BottomSheet';
import { VinylSpinner } from './ui/VinylSpinner';

export interface PinFormProps {
  lang: Language;
  position: { latitude: number; longitude: number } | null;
  onSubmit: (data: { song_url: string; memory_text?: string; display_name?: string }) => void;
  onCancel: () => void;
  onRequestLocation: () => void;
  onRequestMapPick: () => void;
  isSubmitting: boolean;
}

function isValidSongUrl(url: string): boolean {
  return SPOTIFY_URL_REGEX.test(url) || YOUTUBE_URL_REGEX.test(url) || APPLE_MUSIC_URL_REGEX.test(url);
}

export function PinForm({
  lang,
  position,
  onSubmit,
  onCancel,
  onRequestLocation,
  onRequestMapPick,
  isSubmitting,
}: PinFormProps) {
  const [songUrl, setSongUrl] = useState('');
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const [songLoading, setSongLoading] = useState(false);
  const [songError, setSongError] = useState<string | null>(null);
  const [memoryText, setMemoryText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-fetch song info when URL changes
  const handleUrlChange = useCallback(
    (value: string) => {
      setSongUrl(value);
      setSongInfo(null);
      setSongError(null);

      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      if (!value.trim()) return;

      if (!isValidSongUrl(value)) {
        // Don't show error while typing, only if it looks like a full URL
        if (value.includes('http') || value.includes('spotify') || value.includes('youtu') || value.includes('music.apple')) {
          setSongError(t(lang, 'error.invalidUrl'));
        }
        return;
      }

      fetchTimeoutRef.current = setTimeout(async () => {
        setSongLoading(true);
        setSongError(null);
        const res = await fetchSongInfo(value);
        setSongLoading(false);
        if (res.ok && res.data) {
          setSongInfo(res.data);
        } else {
          setSongError(res.error || t(lang, 'error.generic'));
        }
      }, 300);
    },
    [lang]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !songInfo) return;
    onSubmit({
      song_url: songUrl,
      memory_text: memoryText.trim() || undefined,
      display_name: displayName.trim() || undefined,
    });
  };

  const canSubmit = position && songInfo && !isSubmitting;
  const charCount = memoryText.length;
  const charColor =
    charCount > 260
      ? 'text-accent-500'
      : charCount > 220
        ? 'text-brand-500'
        : 'text-slate-400 dark:text-slate-500';

  return (
    <BottomSheet isOpen onClose={onCancel} title={t(lang, 'pinForm.title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Step 1: Location */}
        <div className="flex flex-col gap-2">
          {position ? (
            <div className="flex items-center justify-between glass rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-brand-500 text-base" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C5.2 0 3 2.2 3 5c0 4.2 5 10.4 5 10.4S13 9.2 13 5c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z" />
                  </svg>
                </span>
                <span className="font-medium">
                  {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
                </span>
              </div>
              <button
                type="button"
                onClick={onRequestMapPick}
                className="text-xs text-brand-500 hover:text-brand-600 font-medium
                           transition-colors duration-200"
              >
                {t(lang, 'pinForm.chooseOnMap')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onRequestLocation}
                className="flex flex-col items-center gap-2 glass rounded-xl px-4 py-4
                           hover:bg-white/40 dark:hover:bg-slate-800/40
                           transition-all duration-200 active:scale-[0.97]
                           focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <span className="text-2xl" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                  </svg>
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t(lang, 'pinForm.useMyLocation')}
                </span>
              </button>

              <button
                type="button"
                onClick={onRequestMapPick}
                className="flex flex-col items-center gap-2 glass rounded-xl px-4 py-4
                           hover:bg-white/40 dark:hover:bg-slate-800/40
                           transition-all duration-200 active:scale-[0.97]
                           focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <span className="text-2xl" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t(lang, 'pinForm.chooseOnMap')}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Song URL */}
        {position && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t(lang, 'pinForm.songUrl')}
            </label>

            <div className="relative">
              <input
                type="url"
                value={songUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                onPaste={(e) => {
                  // Immediately process pasted content
                  const pasted = e.clipboardData.getData('text');
                  if (pasted) {
                    setTimeout(() => handleUrlChange(pasted), 0);
                  }
                }}
                placeholder={t(lang, 'pinForm.songUrlPlaceholder')}
                className="w-full glass rounded-xl px-4 py-3 pr-10 text-sm
                           text-slate-900 dark:text-white
                           placeholder:text-slate-400 dark:placeholder:text-slate-500
                           focus:outline-none focus:ring-2 focus:ring-brand-500/50
                           transition-all duration-200"
                autoComplete="off"
              />
              {/* Paste icon */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="5" y="2" width="8" height="11" rx="1" />
                  <path d="M3 5v8a1 1 0 001 1h6" />
                </svg>
              </span>
            </div>

            {/* Loading state */}
            {songLoading && (
              <div className="flex justify-center py-3 animate-fade-in">
                <VinylSpinner size="md" label={t(lang, 'pinForm.loading')} />
              </div>
            )}

            {/* Error state */}
            {songError && !songLoading && (
              <p className="text-sm text-accent-500 bg-accent-50 dark:bg-accent-950/30 rounded-xl px-4 py-2.5 animate-fade-in">
                {songError}
              </p>
            )}

            {/* Song preview */}
            {songInfo && !songLoading && (
              <div className="flex items-center gap-3 glass rounded-xl px-3 py-2.5 animate-fade-in">
                <img
                  src={songInfo.thumbnail_url}
                  alt={songInfo.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {songInfo.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {songInfo.artist}
                  </p>
                </div>
                <span className="flex-shrink-0">
                  {songInfo.source === 'spotify' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  ) : songInfo.source === 'apple_music' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FA243C">
                      <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0 0 19.7.213C19.1.09 18.49.04 17.88.01c-.164-.007-.33-.01-.497-.01H6.607c-.16 0-.33.003-.494.01a12.696 12.696 0 0 0-1.83.204A5.023 5.023 0 0 0 2.42.89C1.3 1.622.556 2.622.24 3.934a9.065 9.065 0 0 0-.24 2.19c-.007.163-.01.328-.01.494V17.38c0 .166.003.33.01.494a9.23 9.23 0 0 0 .24 2.19c.317 1.31 1.062 2.31 2.18 3.043.438.29.913.494 1.42.63.607.124 1.217.174 1.83.204.164.007.33.01.494.01h10.78c.164 0 .33-.003.494-.01a12.68 12.68 0 0 0 1.83-.204c.507-.136.98-.34 1.42-.63 1.118-.733 1.862-1.732 2.18-3.043.15-.69.22-1.39.24-2.19.007-.163.01-.328.01-.494V6.62c0-.166-.003-.33-.01-.494zM17.16 17.07c0 .367-.03.727-.09 1.083a2.603 2.603 0 0 1-.677 1.313c-.384.39-.84.608-1.364.658-.39.037-.783.013-1.17-.074-.387-.087-.75-.24-1.083-.46a2.248 2.248 0 0 1-.69-.69c-.17-.276-.28-.577-.33-.903a3.04 3.04 0 0 1 .04-1.05c.09-.38.26-.717.5-1.01.27-.33.6-.58.99-.75.33-.144.677-.244 1.04-.3.363-.057.73-.09 1.097-.103V9.88c0-.077-.017-.15-.05-.22a.37.37 0 0 0-.18-.163.418.418 0 0 0-.22-.04c-.06.007-.12.02-.177.04l-5.62 1.36a.626.626 0 0 0-.297.174c-.067.074-.107.167-.12.28v7.71c0 .39-.03.773-.09 1.147a2.564 2.564 0 0 1-.677 1.25c-.384.39-.84.608-1.364.658-.39.037-.783.013-1.17-.074-.387-.087-.75-.24-1.083-.46a2.257 2.257 0 0 1-.69-.69 2.13 2.13 0 0 1-.33-.903 3.04 3.04 0 0 1 .04-1.05c.09-.38.26-.717.5-1.01.27-.33.6-.58.99-.75.33-.144.677-.244 1.04-.3.363-.057.73-.087 1.097-.1V8.1c0-.27.047-.527.14-.77.093-.243.23-.453.41-.63a2.1 2.1 0 0 1 .63-.443 3.62 3.62 0 0 1 .77-.25l5.04-1.2c.2-.05.407-.073.62-.07.213.004.413.05.6.14.187.09.34.217.46.38.12.163.193.36.22.59.01.067.013.137.01.21v10.96z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Memory + Name */}
        {songInfo && position && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Memory textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t(lang, 'pinForm.memory')}
              </label>
              <textarea
                value={memoryText}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_MEMORY_LENGTH) {
                    setMemoryText(e.target.value);
                  }
                }}
                placeholder={t(lang, 'pinForm.memoryPlaceholder')}
                rows={3}
                className="w-full glass rounded-xl px-4 py-3 text-sm resize-none
                           text-slate-900 dark:text-white
                           placeholder:text-slate-400 dark:placeholder:text-slate-500
                           focus:outline-none focus:ring-2 focus:ring-brand-500/50
                           transition-all duration-200"
              />
              <span className={`text-xs text-right ${charColor} transition-colors duration-200`}>
                {t(lang, 'pinForm.charCount', { count: charCount })}
              </span>
            </div>

            {/* Display name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t(lang, 'pinForm.displayName')}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t(lang, 'pinForm.displayNamePlaceholder')}
                maxLength={50}
                className="w-full glass rounded-xl px-4 py-3 text-sm
                           text-slate-900 dark:text-white
                           placeholder:text-slate-400 dark:placeholder:text-slate-500
                           focus:outline-none focus:ring-2 focus:ring-brand-500/50
                           transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              'w-full py-3.5 rounded-full text-white font-bold text-sm',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2',
              canSubmit
                ? 'bg-brand-500 hover:bg-brand-600 active:scale-[0.98] shadow-glow'
                : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60',
            ].join(' ')}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <VinylSpinner size="sm" />
              </span>
            ) : (
              t(lang, 'pinForm.confirm')
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="py-2 text-sm text-slate-500 dark:text-slate-400
                       hover:text-slate-700 dark:hover:text-slate-300
                       transition-colors duration-200"
          >
            {t(lang, 'pinForm.cancel')}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
