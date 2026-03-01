import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const env = locals.runtime.env;
  const state = crypto.randomUUID();

  await env.KV.put(`oauth_state:${state}`, '1', { expirationTtl: 300 });

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
