import type { APIRoute } from 'astro';
import { parseSessionToken, deleteSession, makeClearSessionCookie } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const cookieHeader = request.headers.get('Cookie');
  const token = parseSessionToken(cookieHeader);

  if (token) {
    await deleteSession(locals.runtime.env.KV, token);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': makeClearSessionCookie(),
    },
  });
};
