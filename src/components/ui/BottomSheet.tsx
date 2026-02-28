import React, { useEffect, useRef, useCallback, useState } from 'react';

export interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function BottomSheet({ children, isOpen, onClose, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setDragOffset(0);
    }
  }, [isOpen]);

  // Handle drag start (mobile swipe-to-close)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  }, []);

  // Handle drag move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const diff = e.touches[0].clientY - dragStartY.current;
    if (diff > 0) {
      setDragOffset(diff);
    }
  }, []);

  // Handle drag end
  const handleTouchEnd = useCallback(() => {
    if (dragOffset > 100) {
      setIsClosing(true);
      setTimeout(onClose, 300);
    } else {
      setDragOffset(0);
    }
    dragStartY.current = null;
  }, [dragOffset, onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 md:hidden animate-fade-in"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Desktop click-outside area */}
      <div
        className="fixed inset-0 z-40 hidden md:block"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Sheet container */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          // Base
          'fixed z-50 glass-strong overflow-hidden',
          // Mobile: bottom sheet
          'inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl',
          isClosing ? 'animate-slide-down' : 'animate-slide-up',
          // Desktop: side panel
          'md:inset-x-auto md:bottom-auto md:top-4 md:left-4 md:w-[380px] md:max-h-[calc(100vh-2rem)] md:rounded-2xl',
          'md:animate-fade-in',
        ].join(' ')}
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: dragOffset > 0 ? 'none' : undefined,
        }}
      >
        {/* Drag handle (mobile) */}
        <div
          className="md:hidden flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 pt-3 pb-2 md:pt-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full
                         text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-all duration-200"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-5 pb-5 overflow-y-auto max-h-[calc(85vh-4rem)] md:max-h-[calc(100vh-6rem)]">
          {children}
        </div>
      </div>
    </>
  );
}
