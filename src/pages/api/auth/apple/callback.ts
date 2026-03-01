import type { APIRoute } from 'astro';
import {
  decodeJwtPayload,
  hashAuthSubject,
  findOrCreateUser,
  createSession,
  makeSessionCookie,
  generateAppleClientSecret,
  verifyOAuthState,
} from '../../../../lib/auth';

export const prerender = false;

// Apple sends a POST with form-urlencoded body
export const POST: APIRoute = async ({ request, locals, url }) => {
  const env = locals.runtime.env;
  const formData = await request.formData();
  const code = formData.get('code') as string | null;
  const state = formData.get('state') as string | null;
  const idToken = formData.get('id_token') as string | null;

  // Verify CSRF state
  if (!(await verifyOAuthState(env.KV, state))) {
    return new Response('Invalid state', { status: 400 });
  }

  let sub: string | undefined;

  // Try to get sub from the id_token included in the form post
  if (idToken) {
    const payload = decodeJwtPayload(idToken) as { sub?: string };
    sub = payload.sub;
  }

  // If no id_token in form, exchange the code
  if (!sub && code) {
    const clientSecret = await generateAppleClientSecret(
      env.APPLE_TEAM_ID,
      env.APPLE_CLIENT_ID,
      env.APPLE_KEY_ID,
      env.APPLE_PRIVATE_KEY,
    );

    const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${url.origin}/api/auth/apple/callback`,
      }),
    });

    if (tokenRes.ok) {
      const tokens = (await tokenRes.json()) as { id_token?: string };
      if (tokens.id_token) {
        const payload = decodeJwtPayload(tokens.id_token) as { sub?: string };
        sub = payload.sub;
      }
    }
  }

  if (!sub) {
    return new Response('Authentication failed: could not extract identity', { status: 400 });
  }

  // Hash subject with pepper → find or create user
  const authHash = await hashAuthSubject('apple', sub, env.AUTH_PEPPER);
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
