// Checks that a page that was not found is never kept: the middleware answers every 404 with `Cache-Control: no-store`, for the pages of the site and for the dashboard,
// so a person who asked for a page while a new version was still being published does not keep the 404 for hours (Cloudflare gives the answers four hours otherwise).
// Run: node scripts/check-not-found-cache.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/middleware.ts', import.meta.url), 'utf8');
assert.match(source, /const notKept404 = \(response: Response\): Response => \(response\.status === 404 \? withHeaders\(response, \{ 'Cache-Control': 'no-store' \}\) : response\);/, 'a 404 gets no-store');
assert.match(source, /export const onRequest = defineMiddleware\(async \(context, next\) => notKept404\(await route\(context, next\)\)\);/, 'every answer goes through it');
// What was the whole middleware is still there as `route`, and it is the only thing `onRequest` runs.
assert.match(source, /async function route\(context: APIContext, next: MiddlewareNext\): Promise<Response> \{/, 'the middleware itself is `route`');
assert.equal((source.match(/export const onRequest/g) ?? []).length, 1, 'there is one entry point');
console.log('not found cache: ok');
