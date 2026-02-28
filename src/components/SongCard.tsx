import React, { useState } from 'react';
import type { Pin, Language } from '../types';
import { t } from '../i18n/translations';
import { BottomSheet } from './ui/BottomSheet';
import { ShareButtons } from './ShareButtons';

export interface SongCardProps {
  pin: Pin;
  lang: Language;
  onClose: () => void;
  onShare: () => void;
}

function timeAgo(dateStr: string, lang: Language): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return t(lang, 'misc.justNow');
  if (diffMin < 60) return t(lang, 'misc.minutesAgo', { n: diffMin });
  if (diffHr < 24) return t(lang, 'misc.hoursAgo', { n: diffHr });
  return t(lang, 'misc.daysAgo', { n: diffDay });
}

export function SongCard({ pin, lang, onClose, onShare }: SongCardProps) {
  const [showShare, setShowShare] = useState(false);
  const isSpotify = pin.song_source === 'spotify';
  const isAppleMusic = pin.song_source === 'apple_music';

  const locationParts = [pin.city, pin.country].filter(Boolean).join(', ');
  const pinnedByText = t(lang, 'songCard.pinnedBy', { name: pin.display_name });

  return (
    <>
      <BottomSheet isOpen onClose={onClose} title={pin.song_title}>
        <div className="flex flex-col gap-4">
          {/* Album art */}
          <div className="flex justify-center">
            <img
              src={pin.thumbnail_url}
              alt={`${pin.song_title} - ${pin.artist_name}`}
              className="w-full max-w-[200px] aspect-square rounded-xl object-cover shadow-lg"
              loading="lazy"
            />
          </div>

          {/* Song info */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {pin.song_title}
            </h3>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-0.5">
              {pin.artist_name}
            </p>
          </div>

          {/* Memory text */}
          {pin.memory_text && (
            <div className="border-l-2 border-brand-500 pl-4 py-1">
              <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                &ldquo;{pin.memory_text}&rdquo;
              </p>
            </div>
          )}

          {/* Listen button */}
          <a
            href={pin.song_url}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'flex items-center justify-center gap-2 w-full py-3.5 rounded-full',
              'text-white font-semibold text-sm',
              'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              isSpotify
                ? 'bg-[#1DB954] hover:bg-[#1ed760] focus:ring-[#1DB954]/50'
                : isAppleMusic
                  ? 'bg-[#FA243C] hover:bg-[#e02135] focus:ring-[#FA243C]/50'
                  : 'bg-[#FF0000] hover:bg-[#cc0000] focus:ring-[#FF0000]/50',
            ].join(' ')}
          >
            {isSpotify ? (
              /* Spotify icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            ) : isAppleMusic ? (
              /* Apple Music icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0 0 19.7.213C19.1.09 18.49.04 17.88.01c-.164-.007-.33-.01-.497-.01H6.607c-.16 0-.33.003-.494.01a12.696 12.696 0 0 0-1.83.204A5.023 5.023 0 0 0 2.42.89C1.3 1.622.556 2.622.24 3.934a9.065 9.065 0 0 0-.24 2.19c-.007.163-.01.328-.01.494V17.38c0 .166.003.33.01.494a9.23 9.23 0 0 0 .24 2.19c.317 1.31 1.062 2.31 2.18 3.043.438.29.913.494 1.42.63.607.124 1.217.174 1.83.204.164.007.33.01.494.01h10.78c.164 0 .33-.003.494-.01a12.68 12.68 0 0 0 1.83-.204c.507-.136.98-.34 1.42-.63 1.118-.733 1.862-1.732 2.18-3.043.15-.69.22-1.39.24-2.19.007-.163.01-.328.01-.494V6.62c0-.166-.003-.33-.01-.494zM17.16 17.07c0 .367-.03.727-.09 1.083a2.603 2.603 0 0 1-.677 1.313c-.384.39-.84.608-1.364.658-.39.037-.783.013-1.17-.074-.387-.087-.75-.24-1.083-.46a2.248 2.248 0 0 1-.69-.69c-.17-.276-.28-.577-.33-.903a3.04 3.04 0 0 1 .04-1.05c.09-.38.26-.717.5-1.01.27-.33.6-.58.99-.75.33-.144.677-.244 1.04-.3.363-.057.73-.09 1.097-.103V9.88c0-.077-.017-.15-.05-.22a.37.37 0 0 0-.18-.163.418.418 0 0 0-.22-.04c-.06.007-.12.02-.177.04l-5.62 1.36a.626.626 0 0 0-.297.174c-.067.074-.107.167-.12.28v7.71c0 .39-.03.773-.09 1.147a2.564 2.564 0 0 1-.677 1.25c-.384.39-.84.608-1.364.658-.39.037-.783.013-1.17-.074-.387-.087-.75-.24-1.083-.46a2.257 2.257 0 0 1-.69-.69 2.13 2.13 0 0 1-.33-.903 3.04 3.04 0 0 1 .04-1.05c.09-.38.26-.717.5-1.01.27-.33.6-.58.99-.75.33-.144.677-.244 1.04-.3.363-.057.73-.087 1.097-.1V8.1c0-.27.047-.527.14-.77.093-.243.23-.453.41-.63a2.1 2.1 0 0 1 .63-.443 3.62 3.62 0 0 1 .77-.25l5.04-1.2c.2-.05.407-.073.62-.07.213.004.413.05.6.14.187.09.34.217.46.38.12.163.193.36.22.59.01.067.013.137.01.21v10.96z" />
              </svg>
            ) : (
              /* YouTube icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            )}
            <span>
              {isSpotify
                ? t(lang, 'songCard.listenOnSpotify')
                : isAppleMusic
                  ? t(lang, 'songCard.listenOnAppleMusic')
                  : t(lang, 'songCard.watchOnYouTube')}
            </span>
          </a>

          {/* Embed player */}
          {pin.embed_url && (
            <div className="rounded-xl overflow-hidden">
              <iframe
                src={pin.embed_url}
                width="100%"
                height={isSpotify ? 80 : isAppleMusic ? 175 : 200}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
                title={`${pin.song_title} player`}
              />
            </div>
          )}

          {/* Footer info */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
            <span>{pinnedByText}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{timeAgo(pin.created_at, lang)}</span>
            {locationParts && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{locationParts}</span>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 pt-1 pb-2">
            <button
              onClick={() => setShowShare(true)}
              className="text-sm text-brand-500 hover:text-brand-600 font-medium
                         transition-colors duration-200 focus:outline-none focus:ring-2
                         focus:ring-brand-500/50 rounded px-2 py-1"
            >
              {t(lang, 'songCard.share')}
            </button>
            <button
              className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                         font-medium transition-colors duration-200 focus:outline-none
                         focus:ring-2 focus:ring-slate-400/50 rounded px-2 py-1"
            >
              {t(lang, 'songCard.report')}
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Share panel */}
      {showShare && (
        <ShareButtons
          pin={pin}
          lang={lang}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}
