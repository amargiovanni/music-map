import type { APIRoute } from 'astro';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const GET: APIRoute = async ({ locals }) => {
  const userId = locals.userId;

  if (!userId) {
    return new Response(JSON.stringify({ authenticated: false }), { headers: JSON_HEADERS });
  }

  return new Response(
    JSON.stringify({ authenticated: true, userId }),
    { headers: JSON_HEADERS },
  );
};
