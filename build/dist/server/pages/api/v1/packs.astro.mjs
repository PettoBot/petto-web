import { b as answerInfo } from '../../../chunks/publicApi_C9JBbTGL.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = (context) => answerInfo(context);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
