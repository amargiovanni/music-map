import React from 'react';

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  as?: 'div' | 'section' | 'aside';
}

export function GlassPanel({
  children,
  className = '',
  strong = false,
  as: Component = 'div',
}: GlassPanelProps) {
  return (
    <Component
      className={`${strong ? 'glass-strong' : 'glass'} rounded-2xl ${className}`}
    >
      {children}
    </Component>
  );
}
