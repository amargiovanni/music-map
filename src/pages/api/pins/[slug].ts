import type { APIRoute } from 'astro';
import { getPinBySlug } from '../../../lib/db';
import { jsonOk, jsonError } from '../../../lib/api-response';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const { slug } = params;

    if (!slug) {
      return jsonError('Slug parameter is required');
    }

    const pin = await getPinBySlug(db, slug);

    if (!pin) {
      return jsonError('Pin not found', 404);
    }

    return jsonOk(pin);
  } catch {
    return jsonError('Internal server error', 500);
  }
};
