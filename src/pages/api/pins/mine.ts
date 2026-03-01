import type { APIRoute } from 'astro';
import { getPinsByUserId } from '../../../lib/db';
import { jsonOk, jsonError } from '../../../lib/api-response';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const userId = locals.userId;

  if (!userId) {
    return jsonError('Not authenticated', 401);
  }

  try {
    const pins = await getPinsByUserId(locals.runtime.env.DB, userId);
    return jsonOk(pins);
  } catch {
    return jsonError('Internal server error', 500);
  }
};
