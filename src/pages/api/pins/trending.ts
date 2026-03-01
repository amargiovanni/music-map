import type { APIRoute } from 'astro';
import { getTrendingPins, countPins } from '../../../lib/db';
import { jsonOk, jsonError } from '../../../lib/api-response';

export const prerender = false;

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

    return jsonOk({ pins, total, hasMore: total > limit });
  } catch {
    return jsonError('Internal server error', 500);
  }
};
