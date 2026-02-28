import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { GeoPosition } from '../../types';

interface NoteAnimationProps {
  position: GeoPosition;
  onComplete: () => void;
}

const NOTES = ['\u266A', '\u266B', '\u266C', '\u266A', '\u266B'];
const ANIMATION_DURATION = 1800; // ms — slightly longer than the CSS animation

export function NoteAnimation({ position, onComplete }: NoteAnimationProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onComplete]);

  return (
    <Marker
      latitude={position.latitude}
      longitude={position.longitude}
      anchor="center"
    >
      <div className="relative pointer-events-none" style={{ width: 40, height: 40 }}>
        {NOTES.map((note, i) => (
          <span
            key={i}
            className="absolute text-lg font-bold animate-float-up"
            style={{
              color: '#f0760b',
              left: `${8 + (i - 2) * 8}px`,
              top: '10px',
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1.5s',
              textShadow: '0 0 8px rgba(240, 118, 11, 0.5)',
            }}
          >
            {note}
          </span>
        ))}
      </div>
    </Marker>
  );
}
