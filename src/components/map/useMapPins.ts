import { useState, useRef, useCallback, useEffect } from 'react';
import type { Pin, MapBounds } from '../../types';
import { fetchPinsByBounds } from '../../lib/api';
import { DEBOUNCE_MS } from '../../lib/constants';

export interface UseMapPinsReturn {
  pins: Pin[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  loadPinsForBounds: (bounds: MapBounds) => void;
}

export function useMapPins(): UseMapPinsReturn {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Track the latest request to ignore stale responses
  const requestIdRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPinsForBounds = useCallback((bounds: MapBounds) => {
    // Clear any pending debounced request
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const currentRequestId = ++requestIdRef.current;

      setLoading(true);
      setError(null);

      const result = await fetchPinsByBounds(bounds);

      // Ignore if a newer request has been fired
      if (currentRequestId !== requestIdRef.current) return;

      if (result.ok && result.data) {
        setPins(result.data);
        setTotalCount(result.data.length);
      } else {
        setError(result.error ?? 'Failed to load pins');
      }

      setLoading(false);
    }, DEBOUNCE_MS);
  }, []);

  // Clean up pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return { pins, loading, error, totalCount, loadPinsForBounds };
}
