import type { APIRoute } from 'astro';
import { getPinsByUserId } from '../../../lib/db';

export const prerender = false;

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const GET: APIRoute = async ({ locals }) => {
  const userId = locals.userId;

  if (!userId) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Not authenticated' }),
      { status: 401, headers: CORS_HEADERS },
    );
  }

  try {
    const pins = await getPinsByUserId(locals.runtime.env.DB, userId);
    return new Response(
      JSON.stringify({ ok: true, data: pins }),
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
