import { b as changelogRssResponse } from '../../chunks/changelogFeed_DUjcvSF3.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = (context) => changelogRssResponse("en", "GET", context);
const HEAD = (context) => changelogRssResponse("en", "HEAD", context);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	HEAD,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
