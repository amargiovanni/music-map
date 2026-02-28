import React from 'react';

export interface VinylSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
} as const;

const innerSizeMap = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

const grooveSizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
} as const;

export function VinylSpinner({ size = 'md', label }: VinylSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeMap[size]} relative rounded-full animate-spin-slow`}
      >
        {/* Outer disc */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 dark:from-slate-700 dark:to-slate-900" />

        {/* Grooves ring */}
        <div
          className={`absolute inset-0 m-auto ${grooveSizeMap[size]} rounded-full border border-slate-600/40 dark:border-slate-500/30`}
        />

        {/* Middle groove */}
        <div
          className="absolute inset-0 m-auto rounded-full border border-slate-600/20 dark:border-slate-500/20"
          style={{ width: '70%', height: '70%' }}
        />

        {/* Label area (center) */}
        <div
          className={`absolute inset-0 m-auto ${innerSizeMap[size]} rounded-full bg-gradient-to-br from-brand-400 to-brand-600`}
        />

        {/* Spindle hole */}
        <div className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-slate-900 dark:bg-slate-200" />

        {/* Shine highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
          }}
        />
      </div>

      {label && (
        <span className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
