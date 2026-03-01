import type { APIRoute } from 'astro';
import { getRandomPin } from '../../../lib/db';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const pin = await getRandomPin(db);

    if (!pin) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No pins found' }),
        { status: 404, headers: JSON_HEADERS },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, data: pin }),
      { status: 200, headers: JSON_HEADERS },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
};
