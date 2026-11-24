export const prerender = false;
import type { APIRoute } from 'astro';
import { answerWithKey } from '../../../utils/publicApi';

/** Read-only API: GET /api/v1/me with `Authorization: Bearer <key>`. */
export const GET: APIRoute = (context) => answerWithKey(context, 'me');
