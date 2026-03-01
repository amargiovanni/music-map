import type { APIRoute } from 'astro';
import { countPins } from '../../lib/db';
import { jsonRaw } from '../../lib/api-response';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const db = context.locals.runtime.env.DB;
    const count = await countPins(db);
    return jsonRaw({ data: { count } });
  } catch {
    return jsonRaw({ data: { count: 0 } });
  }
};
