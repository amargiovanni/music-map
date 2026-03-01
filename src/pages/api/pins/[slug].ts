import type { APIRoute } from 'astro';
import { getPinBySlug } from '../../../lib/db';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const { slug } = params;

    if (!slug) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Slug parameter is required' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const pin = await getPinBySlug(db, slug);

    if (!pin) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Pin not found' }),
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
