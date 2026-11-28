import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { N as callPettoResync } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { G as forgetGuildSnapshot, n as noteGuildWrite } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { deferGuildChange } from '../../../../chunks/serverTiming_CTuT9h6x.mjs';
import { bumpGuildVersion } from '../../../../chunks/guildVersion_C-xSL97y.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const POST = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, message: "Sign in again." }, 401);
  const result = await callPettoResync(astro, id, String(auth.session.userId));
  if (result.ok) forgetGuildSnapshot(id);
  else noteGuildWrite(id);
  if (!deferGuildChange(id)) await bumpGuildVersion(id).catch(() => "");
  return json({ ok: true, saved: result.ok }, 200);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
