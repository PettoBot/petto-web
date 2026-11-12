// The RSS feed of the changelog in es (see src/utils/changelogFeed.ts). Rendered on request, not prerendered, so it is
// served as application/rss+xml with its own cache rules on Discloud and on Cloudflare alike.
import type { APIRoute } from 'astro';
import { changelogRssResponse } from '../../../utils/changelogFeed';

export const prerender = false;
export const GET: APIRoute = (context) => changelogRssResponse('es', 'GET', context);
export const HEAD: APIRoute = (context) => changelogRssResponse('es', 'HEAD', context);
