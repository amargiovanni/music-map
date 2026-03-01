import type { APIRoute } from 'astro';
import { searchPins } from '../../../lib/db';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query || !query.trim()) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Query parameter "q" is required' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const pins = await searchPins(db, query.trim());

    return new Response(
      JSON.stringify({ ok: true, data: pins }),
      { status: 200, headers: JSON_HEADERS },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
};
