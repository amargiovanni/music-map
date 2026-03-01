import type { APIRoute } from 'astro';
import { getPinsByUserId } from '../../../lib/db';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const GET: APIRoute = async ({ locals }) => {
  const userId = locals.userId;

  if (!userId) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Not authenticated' }),
      { status: 401, headers: JSON_HEADERS },
    );
  }

  try {
    const pins = await getPinsByUserId(locals.runtime.env.DB, userId);
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
