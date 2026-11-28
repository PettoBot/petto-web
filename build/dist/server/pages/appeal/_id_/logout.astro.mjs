export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const id = String(context.params.id ?? "");
  context.cookies.delete("petto_session", { path: "/" });
  return context.redirect(/^[a-z0-9-]{3,32}$/.test(id.toLowerCase()) ? `/appeal/${id.toLowerCase()}` : "/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
