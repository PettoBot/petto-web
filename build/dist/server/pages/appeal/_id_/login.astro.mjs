import { b as loginUrl } from '../../../chunks/appealSite_SuoN-UBP.mjs';
import { r as resolveGuildId } from '../../../chunks/appeals_OSuSBkCm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const id = String(context.params.id ?? "").toLowerCase();
  if (!await resolveGuildId(context, id)) return new Response("Not found", { status: 404 });
  const back = String(context.url.searchParams.get("back") ?? "");
  const target = /^\/appeal\/[a-z0-9-]{3,32}(?:\/(?:form\/\d{1,12}|status\/[0-9a-f-]{36}))?$/.test(back) ? back : `/appeal/${id}`;
  const url = loginUrl(context);
  if (!url) return context.redirect(`/appeal/${id}`);
  context.cookies.set("petto_after_login", target, { path: "/", maxAge: 600, sameSite: "lax", httpOnly: true, secure: context.url.protocol === "https:" });
  return context.redirect(url);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
