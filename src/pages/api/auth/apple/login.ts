import type { APIRoute } from 'astro';
import { createOAuthState } from '../../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const env = locals.runtime.env;
  const state = await createOAuthState(env.KV);

  const params = new URLSearchParams({
    client_id: env.APPLE_CLIENT_ID,
    redirect_uri: `${url.origin}/api/auth/apple/callback`,
    response_type: 'code id_token',
    scope: '',
    response_mode: 'form_post',
    state,
  });

  return Response.redirect(`https://appleid.apple.com/auth/authorize?${params}`, 302);
};
