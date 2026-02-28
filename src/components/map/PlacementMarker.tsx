import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { GeoPosition } from '../../types';

interface PlacementMarkerProps {
  position: GeoPosition;
}

export function PlacementMarker({ position }: PlacementMarkerProps) {
  return (
    <Marker
      latitude={position.latitude}
      longitude={position.longitude}
      anchor="center"
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring underneath */}
        <div
          className="absolute w-12 h-12 rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(240,118,11,0.25) 0%, transparent 70%)',
          }}
        />

        {/* Drop shadow ring */}
        <div
          className="absolute w-8 h-8 rounded-full"
          style={{
            boxShadow: '0 4px 12px rgba(240, 118, 11, 0.4)',
            background: 'rgba(240, 118, 11, 0.12)',
          }}
        />

        {/* Music note icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10 drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 8px rgba(240, 118, 11, 0.5))' }}
        >
          <path
            d="M9 18V5l12-2v13"
            stroke="#f0760b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="6" cy="18" r="3" fill="#f0760b" />
          <circle cx="18" cy="16" r="3" fill="#f0760b" />
        </svg>
      </div>
    </Marker>
  );
}
