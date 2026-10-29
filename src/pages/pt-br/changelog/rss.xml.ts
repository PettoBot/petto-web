// The RSS feed of the changelog in pt-BR (see src/utils/changelogFeed.ts). Rendered on request, not prerendered, so it is
// served as application/rss+xml with its own cache rules on Discloud and on Cloudflare alike.
import type { APIRoute } from 'astro';
import { changelogRssResponse } from '../../../utils/changelogFeed';

export const prerender = false;
export const GET: APIRoute = () => changelogRssResponse('pt-BR');
export const HEAD: APIRoute = () => changelogRssResponse('pt-BR', 'HEAD');
