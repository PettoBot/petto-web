import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { k as formIdPath, P as PUBLIC_ID } from '../../chunks/forms_B4RRKoSS.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url, redirect, cookies, locals }) => {
  const clientId = getEnv({ locals }, "DISCORD_CLIENT_ID");
  const form = url.searchParams.get("form") ?? "";
  const lang = url.searchParams.get("lang") ?? "en";
  const legacy = /^\/f\/([0-9A-Za-z]{12})$/.exec(url.searchParams.get("next") ?? "")?.[1] ?? "";
  const id = PUBLIC_ID.test(form) ? form : legacy;
  const safe = id ? formIdPath(id, lang) : "/";
  if (!clientId) return redirect(safe);
  cookies.set("petto_after_login", safe, { httpOnly: true, secure: url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 600 });
  const redirectUri = `${url.origin}/dash/callback`;
  const state = id ? `&state=${encodeURIComponent(`form.${id}.${lang === "es" ? "es" : lang === "pt-BR" || lang === "pt" ? "pt" : "en"}`)}` : "";
  return redirect(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify${state}`);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
