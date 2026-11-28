import { f as forwardToBot } from '../../chunks/botWebhookProxy_DQ5Yshb-.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = (context) => forwardToBot(context, "/webhooks/omniplex");
const GET = () => new Response("This address only receives votes (POST).", { status: 405, headers: { allow: "POST" } });

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
