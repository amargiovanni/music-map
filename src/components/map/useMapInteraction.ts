import { useState, useCallback } from 'react';

export interface FlyToTarget {
  lat: number;
  lng: number;
  zoom?: number;
}

export interface UseMapInteractionReturn {
  flyToTarget: FlyToTarget | null;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  clearFlyTarget: () => void;
}

export function useMapInteraction(): UseMapInteractionReturn {
  const [flyToTarget, setFlyToTarget] = useState<FlyToTarget | null>(null);

  const flyTo = useCallback((lat: number, lng: number, zoom?: number) => {
    setFlyToTarget({ lat, lng, zoom });
  }, []);

  const clearFlyTarget = useCallback(() => {
    setFlyToTarget(null);
  }, []);

  return { flyToTarget, flyTo, clearFlyTarget };
}
