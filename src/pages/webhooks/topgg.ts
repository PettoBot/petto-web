import type { APIRoute } from 'astro';
import { forwardToBot } from '../../utils/botWebhookProxy';

export const prerender = false;

// The votes of the bot on top.gg: the bot checks the signature and stores the vote (see utils/botWebhookProxy.ts).
export const POST: APIRoute = (context) => forwardToBot(context, '/webhooks/topgg');

export const GET: APIRoute = () => new Response('This address only receives votes (POST).', { status: 405, headers: { allow: 'POST' } });
