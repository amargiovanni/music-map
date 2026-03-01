import type { APIRoute } from 'astro';
import { getRandomPin } from '../../../lib/db';
import { jsonOk, jsonError } from '../../../lib/api-response';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const pin = await getRandomPin(db);

    if (!pin) {
      return jsonError('No pins found', 404);
    }

    return jsonOk(pin);
  } catch {
    return jsonError('Internal server error', 500);
  }
};
