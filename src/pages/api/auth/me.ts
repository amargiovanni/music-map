import type { APIRoute } from 'astro';
import { jsonRaw } from '../../../lib/api-response';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const userId = locals.userId;

  if (!userId) {
    return jsonRaw({ authenticated: false });
  }

  return jsonRaw({ authenticated: true, userId });
};
