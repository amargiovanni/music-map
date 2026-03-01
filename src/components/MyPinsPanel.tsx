import React, { useEffect, useState } from 'react';
import type { Language, Pin } from '../types';
import { t } from '../i18n/translations';
import { fetchMyPins } from '../lib/api';

interface MyPinsPanelProps {
  lang: Language;
  onClose: () => void;
  onSelectPin: (pin: Pin) => void;
}

export function MyPinsPanel({ lang, onClose, onSelectPin }: MyPinsPanelProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await fetchMyPins();
      if (result.ok && result.data) {
        setPins(result.data);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:top-4 md:left-4 md:right-auto md:bottom-auto md:w-[380px] animate-slide-up md:animate-fade-in">
      <div className="glass-strong rounded-t-2xl md:rounded-2xl max-h-[70vh] md:max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t(lang, 'auth.myPins')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-2">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && pins.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-500 dark:text-slate-400">
              {t(lang, 'empty.noPins')}
            </div>
          )}

          {pins.map((pin) => (
            <button
              key={pin.slug}
              onClick={() => {
                onSelectPin(pin);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-left"
            >
              {pin.thumbnail_url ? (
                <img
                  src={pin.thumbnail_url}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {pin.song_title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {pin.artist_name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {[pin.city, pin.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
