import type { APIRoute } from 'astro';
import { buildInfo } from '../utils/buildInfo';

// Written when the site is built, so it says exactly which build is being served.
export const GET: APIRoute = () => new Response(JSON.stringify(buildInfo, null, 2), {
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
