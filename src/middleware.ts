import { defineMiddleware } from 'astro:middleware';
import { parseSessionToken, getSessionUserId } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals } = context;

  const cookieHeader = request.headers.get('Cookie');
  const token = parseSessionToken(cookieHeader);

  if (token) {
    try {
      const userId = await getSessionUserId(locals.runtime.env.KV, token);
      if (userId) {
        locals.userId = userId;
      }
    } catch {
      // Session resolution failure is non-fatal
    }
  }

  return next();
});
