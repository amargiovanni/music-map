import { withKvCache } from './kv-cache';
import { CACHE_TTL_GEO, USER_AGENT } from './constants';

type KVNamespace = import('@cloudflare/workers-types').KVNamespace;

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  country?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
}

interface GeoResult {
  city: string | null;
  country: string | null;
}

// ── Reverse geocode coordinates to city/country ────────────────────
export async function reverseGeocode(
  lat: number,
  lng: number,
  kv: KVNamespace,
): Promise<GeoResult> {
  // Round to 3 decimal places for cache key (~111 m precision)
  const cacheKey = `geo:${lat.toFixed(3)}:${lng.toFixed(3)}`;

  const result = await withKvCache<GeoResult>(kv, cacheKey, CACHE_TTL_GEO, async () => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as NominatimResponse;
    const address = data.address;

    return {
      city: address?.city ?? address?.town ?? address?.village ?? null,
      country: address?.country ?? null,
    };
  });

  return result ?? { city: null, country: null };
}
