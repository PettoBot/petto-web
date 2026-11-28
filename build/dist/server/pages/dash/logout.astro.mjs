export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies, redirect }) => {
  cookies.delete("petto_session", { path: "/" });
  return redirect("/dash");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
