type KVNamespace = import('@cloudflare/workers-types').KVNamespace;

/**
 * Read-through KV cache: returns cached value if present,
 * otherwise calls fetchFn and stores the result.
 */
export async function withKvCache<T>(
  kv: KVNamespace,
  key: string,
  ttl: number,
  fetchFn: () => Promise<T | null>,
): Promise<T | null> {
  // Try cache first
  try {
    const cached = await kv.get(key, 'json');
    if (cached) return cached as T;
  } catch {
    // Cache miss or error — continue to fetch
  }

  const result = await fetchFn();
  if (result == null) return null;

  // Store in cache (non-critical)
  try {
    await kv.put(key, JSON.stringify(result), { expirationTtl: ttl });
  } catch {
    // Caching failure shouldn't break the flow
  }

  return result;
}
