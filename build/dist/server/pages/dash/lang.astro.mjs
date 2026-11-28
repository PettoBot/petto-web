import { L as LANG_COOKIE } from '../../chunks/dash_CORIPvM-.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const allowed = ["en", "es", "pt-BR"];
const GET = async ({ url, cookies, redirect }) => {
  const to = url.searchParams.get("to") ?? "";
  if (allowed.includes(to)) {
    cookies.set(LANG_COOKIE, to, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", secure: url.protocol === "https:" });
  }
  const next = url.searchParams.get("next") ?? "/dash";
  const clean = next.replace(/^\/(?:es|pt-br)(?=\/dash(?:[/?#]|$))/i, "");
  const safe = clean.startsWith("/dash") && !clean.startsWith("//") ? clean : "/dash";
  const prefix = to === "es" ? "/es" : to === "pt-BR" ? "/pt-br" : "";
  return redirect(`${prefix}${safe}`, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
