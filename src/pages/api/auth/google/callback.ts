import type { APIRoute } from 'astro';
import {
  decodeJwtPayload,
  hashAuthSubject,
  findOrCreateUser,
  createSession,
  makeSessionCookie,
} from '../../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals, url }) => {
  const env = locals.runtime.env;
  const params = new URL(request.url).searchParams;
  const code = params.get('code');
  const state = params.get('state');

  // Verify CSRF state
  if (!state || !(await env.KV.get(`oauth_state:${state}`))) {
    return new Response('Invalid state', { status: 400 });
  }
  await env.KV.delete(`oauth_state:${state}`);

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url.origin}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    return new Response('Token exchange failed', { status: 500 });
  }

  const tokens = (await tokenRes.json()) as { id_token?: string };
  if (!tokens.id_token) {
    return new Response('No id_token received', { status: 500 });
  }

  // Decode JWT to get sub (subject identifier)
  const payload = decodeJwtPayload(tokens.id_token) as { sub?: string };
  if (!payload.sub) {
    return new Response('Invalid id_token: missing sub', { status: 500 });
  }

  // Hash subject with pepper → find or create user
  const authHash = await hashAuthSubject('google', payload.sub, env.AUTH_PEPPER);
  const userId = await findOrCreateUser(env.DB, authHash);

  // Create session and redirect home
  const sessionToken = await createSession(env.KV, userId);

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': makeSessionCookie(sessionToken),
    },
  });
};
