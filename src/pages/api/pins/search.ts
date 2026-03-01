import type { APIRoute } from 'astro';
import { searchPins } from '../../../lib/db';
import { jsonOk, jsonError } from '../../../lib/api-response';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query || !query.trim()) {
      return jsonError('Query parameter "q" is required');
    }

    const pins = await searchPins(db, query.trim());

    return jsonOk(pins);
  } catch {
    return jsonError('Internal server error', 500);
  }
};
