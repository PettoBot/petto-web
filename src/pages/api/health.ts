import type { APIRoute } from 'astro';
import { buildInfo } from '../../utils/buildInfo';

export const prerender = false;

/** The lightest route of the app, for the status checks: it answers from memory and touches nothing else (not the database, not Discord). */
export const GET: APIRoute = () => new Response(JSON.stringify({ ok: true, v: buildInfo.version }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
