import type { APIRoute } from 'astro';
import { getPinBySlug } from '../../../lib/db';

export const prerender = false;

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const { slug } = params;

    if (!slug) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Slug parameter is required' }),
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const pin = await getPinBySlug(db, slug);

    if (!pin) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Pin not found' }),
        { status: 404, headers: CORS_HEADERS },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, data: pin }),
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
