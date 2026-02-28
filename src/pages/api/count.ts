import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const db = context.locals.runtime.env.DB;
    const result = await db
      .prepare('SELECT COUNT(*) as count FROM pins')
      .first<{ count: number }>();

    return new Response(
      JSON.stringify({ data: { count: result?.count ?? 0 } }),
      { headers },
    );
  } catch {
    return new Response(
      JSON.stringify({ data: { count: 0 } }),
      { headers },
    );
  }
};
