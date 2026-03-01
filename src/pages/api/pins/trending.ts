import type { APIRoute } from 'astro';
import { getTrendingPins, countPins } from '../../../lib/db';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const url = new URL(request.url);

    let limit = 20;
    const limitParam = url.searchParams.get('limit');
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
        limit = parsed;
      }
    }

    const [pins, total] = await Promise.all([
      getTrendingPins(db, limit),
      countPins(db),
    ]);

    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          pins,
          total,
          hasMore: total > limit,
        },
      }),
      { status: 200, headers: JSON_HEADERS },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
};
