import type { APIRoute } from 'astro';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const GET: APIRoute = async (context) => {
  try {
    const db = context.locals.runtime.env.DB;
    const result = await db
      .prepare('SELECT COUNT(*) as count FROM pins')
      .first<{ count: number }>();

    return new Response(
      JSON.stringify({ data: { count: result?.count ?? 0 } }),
      { headers: JSON_HEADERS },
    );
  } catch {
    return new Response(
      JSON.stringify({ data: { count: 0 } }),
      { headers: JSON_HEADERS },
    );
  }
};
