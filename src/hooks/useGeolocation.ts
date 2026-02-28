import { useState, useCallback } from 'react';
import type { GeoPosition } from '../types';

/**
 * Thin wrapper around the Geolocation API.
 *
 * Does NOT request permission on mount — call `requestPosition` explicitly
 * (e.g. when the user taps "Use my location" or "Near me").
 */
export function useGeolocation(): {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
  requestPosition: () => void;
} {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 60_000,
      },
    );
  }, []);

  return { position, error, loading, requestPosition };
}
