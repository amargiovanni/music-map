import React, { useState, useCallback, useEffect } from 'react';
import type { Pin, Language } from '../types';
import { t } from '../i18n/translations';
import { GlassPanel } from './ui/GlassPanel';

export interface ShareButtonsProps {
  pin: Pin;
  lang: Language;
  onClose: () => void;
}

export function ShareButtons({ pin, lang, onClose }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const pinUrl = `${window.location.origin}/pin/${pin.slug}`;
  const shareText = `🎵 ${pin.song_title} by ${pin.artist_name}${pin.city ? ` — pinned at ${pin.city}` : ''} on Music Map`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pinUrl);
      setCopied(true);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = pinUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  }, [pinUrl]);

  // Reset copied state
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(pinUrl);

  const shareLinks = [
    {
      name: t(lang, 'share.copyLink'),
      action: handleCopy,
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="6" width="10" height="10" rx="2" />
          <path d="M2 12V3a1 1 0 011-1h9" />
        </svg>
      ),
      feedback: copied ? t(lang, 'share.copied') : null,
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/30 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Share modal */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
        <GlassPanel strong className="pointer-events-auto p-5 w-full max-w-xs animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t(lang, 'share.title')}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full
                         text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-all duration-200"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </button>
          </div>

          {/* Share buttons grid */}
          <div className="grid grid-cols-2 gap-2">
            {shareLinks.map((link) => {
              const content = (
                <>
                  <span className="text-slate-600 dark:text-slate-300">
                    {link.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {link.feedback || link.name}
                  </span>
                </>
              );

              if ('action' in link && link.action) {
                return (
                  <button
                    key={link.name}
                    onClick={link.action}
                    className={[
                      'flex items-center gap-2 px-3 py-3 rounded-xl',
                      'transition-all duration-200',
                      'hover:bg-white/50 dark:hover:bg-slate-800/50',
                      'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                      link.feedback ? 'bg-brand-50 dark:bg-brand-950/20' : '',
                    ].join(' ')}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <a
                  key={link.name}
                  href={'href' in link ? link.href : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-3 rounded-xl
                             transition-all duration-200
                             hover:bg-white/50 dark:hover:bg-slate-800/50
                             focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    </>
  );
}
