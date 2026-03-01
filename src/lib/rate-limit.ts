import { RATE_LIMIT_PINS_PER_HOUR } from './constants';

type KVNamespace = import('@cloudflare/workers-types').KVNamespace;

interface RateLimitEntry {
  count: number;
  timestamp: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

// ── Check rate limit for an IP ─────────────────────────────────────
export async function checkRateLimit(
  kv: KVNamespace,
  ip: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rl:${ip}`;

  try {
    const existing = await kv.get(key, 'json');
    const now = Date.now();

    if (existing) {
      const entry = existing as RateLimitEntry;

      // If more than 1 hour has passed, reset the counter
      if (now - entry.timestamp > WINDOW_MS) {
        const newEntry: RateLimitEntry = { count: 1, timestamp: now };
        await kv.put(key, JSON.stringify(newEntry), {
          expirationTtl: 3600,
        });
        return { allowed: true, remaining: RATE_LIMIT_PINS_PER_HOUR - 1 };
      }

      // Within the window — check the count
      if (entry.count >= RATE_LIMIT_PINS_PER_HOUR) {
        return { allowed: false, remaining: 0 };
      }

      // Increment the counter
      const updated: RateLimitEntry = {
        count: entry.count + 1,
        timestamp: entry.timestamp,
      };
      await kv.put(key, JSON.stringify(updated), {
        expirationTtl: 3600,
      });
      return {
        allowed: true,
        remaining: RATE_LIMIT_PINS_PER_HOUR - updated.count,
      };
    }

    // No existing entry — first request in window
    const newEntry: RateLimitEntry = { count: 1, timestamp: now };
    await kv.put(key, JSON.stringify(newEntry), {
      expirationTtl: 3600,
    });
    return { allowed: true, remaining: RATE_LIMIT_PINS_PER_HOUR - 1 };
  } catch {
    // On KV failure, deny the request (fail closed)
    return { allowed: false, remaining: 0 };
  }
}
