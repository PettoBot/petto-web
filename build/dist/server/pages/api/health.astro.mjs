import { b as buildInfo } from '../../chunks/buildInfo_Bw1TupFW.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = () => new Response(JSON.stringify({ ok: true, v: buildInfo.version }), { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
