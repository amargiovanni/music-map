import { useState, useCallback } from 'react';
import { fetchRandomPin } from '../../lib/api';

export interface FlyToTarget {
  lat: number;
  lng: number;
  zoom?: number;
}

export interface UseMapInteractionReturn {
  flyToTarget: FlyToTarget | null;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  flyToRandom: () => Promise<void>;
  clearFlyTarget: () => void;
}

export function useMapInteraction(): UseMapInteractionReturn {
  const [flyToTarget, setFlyToTarget] = useState<FlyToTarget | null>(null);

  const flyTo = useCallback((lat: number, lng: number, zoom?: number) => {
    setFlyToTarget({ lat, lng, zoom });
  }, []);

  const flyToRandom = useCallback(async () => {
    const result = await fetchRandomPin();
    if (result.ok && result.data) {
      const pin = result.data;
      setFlyToTarget({
        lat: pin.latitude,
        lng: pin.longitude,
        zoom: 13,
      });
    }
  }, []);

  const clearFlyTarget = useCallback(() => {
    setFlyToTarget(null);
  }, []);

  return { flyToTarget, flyTo, flyToRandom, clearFlyTarget };
}
