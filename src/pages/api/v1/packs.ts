export const prerender = false;
import type { APIRoute } from 'astro';
import { answerInfo } from '../../../utils/publicApi';

/** Read-only API: GET /api/v1/packs, the packs of ceramos and the daily ceramos of each plan. Needs no key. */
export const GET: APIRoute = (context) => answerInfo(context);
