import type { APIRoute } from 'astro';
import { getTrendingPins, countPins } from '../../../lib/db';

export const prerender = false;

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

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
      { status: 200, headers: CORS_HEADERS },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: CORS_HEADERS },
    );
  }
};
