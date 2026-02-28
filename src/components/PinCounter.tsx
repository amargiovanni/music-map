import React, { useEffect, useRef, useState } from 'react';
import type { Language } from '../types';
import { t } from '../i18n/translations';
import { GlassPanel } from './ui/GlassPanel';

export interface PinCounterProps {
  count: number;
  lang: Language;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value === prevValue.current) return;

    const start = prevValue.current;
    const end = value;
    const diff = end - start;
    const duration = Math.min(Math.abs(diff) * 50, 800);
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export function PinCounter({ count, lang }: PinCounterProps) {
  const text = t(lang, 'counter.songs', { count: '{n}' });
  const parts = text.split('{n}');

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
      <GlassPanel className="pointer-events-auto px-3 py-2 flex items-center gap-2 animate-fade-in">
        {/* Music note icon */}
        <span className="text-brand-500 flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M11 1v7.28A2.5 2.5 0 119.5 6V3.06L6 3.84v5.44A2.5 2.5 0 114.5 7V2a.75.75 0 01.57-.73l5.25-1.31A.75.75 0 0111 .68V1z" />
          </svg>
        </span>

        <span className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {parts[0]}
          <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            <AnimatedNumber value={count} />
          </span>
          {parts[1]}
        </span>
      </GlassPanel>
    </div>
  );
}
