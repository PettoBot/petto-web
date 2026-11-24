export const prerender = false;
import type { APIRoute } from 'astro';
import { answerWithKey } from '../../../utils/publicApi';

/** Read-only API: GET /api/v1/movements with `Authorization: Bearer <key>`. */
export const GET: APIRoute = (context) => answerWithKey(context, 'movements');
