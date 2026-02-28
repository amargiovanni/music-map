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

// ── Reverse geocode coordinates to city/country ────────────────────
export async function reverseGeocode(
  lat: number,
  lng: number,
  kv: KVNamespace,
): Promise<{ city: string | null; country: string | null }> {
  // Round to 3 decimal places for cache key (~111 m precision)
  const cacheKey = `geo:${lat.toFixed(3)}:${lng.toFixed(3)}`;

  // Check KV cache first
  try {
    const cached = await kv.get(cacheKey, 'json');
    if (cached) return cached as { city: string | null; country: string | null };
  } catch {
    // Cache miss or error — continue to fetch
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MusicMap/1.0',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return { city: null, country: null };
    }

    const data = (await response.json()) as NominatimResponse;
    const address = data.address;

    const result = {
      city: address?.city ?? address?.town ?? address?.village ?? null,
      country: address?.country ?? null,
    };

    // Cache in KV with 30-day TTL (2592000 seconds)
    try {
      await kv.put(cacheKey, JSON.stringify(result), {
        expirationTtl: 2592000,
      });
    } catch {
      // Non-critical: caching failure shouldn't break the flow
    }

    return result;
  } catch {
    return { city: null, country: null };
  }
}
