import type { APIRoute } from 'astro';
import { createSession, makeSessionCookie } from '../../../../lib/auth';

export const prerender = false;

const DEV_USER_ID = 'dev-user-001';

export const GET: APIRoute = async ({ locals }) => {
  // Double guard: build-time check + runtime check
  if (!import.meta.env.DEV) {
    return new Response(null, { status: 404 });
  }

  const { DB, KV } = locals.runtime.env;

  // Ensure the dev user exists (matches the seed.sql user)
  await DB.prepare(
    `INSERT OR IGNORE INTO users (id, auth_hash) VALUES (?1, ?2)`,
  ).bind(DEV_USER_ID, 'dev-local-only').run();

  const token = await createSession(KV, DEV_USER_ID);

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': makeSessionCookie(token),
    },
  });
};
