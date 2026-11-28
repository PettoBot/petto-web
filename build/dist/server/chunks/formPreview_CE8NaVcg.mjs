import { c as callPettoWebForm } from './pettoBotApi_B4wpoZhN.mjs';
import { P as PUBLIC_ID, k as formIdPath, l as linkEmbed, p as pageLook } from './forms_B4RRKoSS.mjs';
import { g as getDashLang } from './dash_CORIPvM-.mjs';

const TEXT = {
  en: { description: (server) => `Fill in this form of ${server} with your Discord account.` },
  es: { description: (server) => `Llena este formulario de ${server} con tu cuenta de Discord.` },
  "pt-BR": { description: (server) => `Preencha este formulário de ${server} com sua conta do Discord.` }
};
const oneLine = (text, max) => {
  const line = String(text ?? "").replace(/\s+/g, " ").trim();
  return line.length <= max ? line : `${line.slice(0, max - 1).trimEnd()}…`;
};
const hex = (n) => typeof n === "number" ? `#${n.toString(16).padStart(6, "0")}` : null;
const KEEP_MS = 6e4;
const kept = /* @__PURE__ */ new Map();
function shapeLook(data) {
  const form = data?.form;
  if (!form) return null;
  const icon = typeof data?.server?.icon === "string" && data.server.icon.startsWith("https://") ? data.server.icon : null;
  return {
    id: String(form.id ?? ""),
    title: String(form.title ?? "").slice(0, 100),
    description: form.description ? String(form.description).slice(0, 1e3) : null,
    color: typeof form.color === "number" && form.color >= 0 && form.color <= 16777215 ? form.color : null,
    page: pageLook(form.page),
    embed: linkEmbed(form.embed),
    server: { id: String(data?.server?.id ?? ""), name: String(data?.server?.name ?? "").slice(0, 100), icon }
  };
}
async function loadFormLook(context, id, lang, budgetMs = 2500) {
  if (!PUBLIC_ID.test(id)) return { status: 404, look: null };
  const key = `${id}:${lang}`;
  const now = Date.now();
  let entry = kept.get(key);
  if (!entry || now - entry.at > KEEP_MS) {
    const value = callPettoWebForm(context, id, "", "look", {}, lang).then((r) => ({ status: r.ok ? 200 : r.status, look: r.ok ? shapeLook(r.data) : null }));
    entry = { at: now, value };
    kept.set(key, entry);
    value.then((r) => {
      if (r.status >= 500) kept.delete(key);
    }).catch(() => kept.delete(key));
    if (kept.size > 500) {
      for (const [k, v] of kept) if (now - v.at > KEEP_MS) kept.delete(k);
    }
  }
  const late = new Promise((resolve) => setTimeout(() => resolve({ status: 504, look: null }), budgetMs));
  return Promise.race([entry.value, late]).catch(() => ({ status: 502, look: null }));
}
function formPreview(look, lang) {
  const server = look.server.name || "Discord";
  const title = oneLine(look.title, 60) || "Form";
  const embed = look.embed;
  const image = embed.image ?? look.page.banner ?? look.server.icon;
  return {
    title: embed.title ? oneLine(embed.title, 90) : look.server.name ? `${title} · ${look.server.name}` : title,
    description: embed.description ? oneLine(embed.description, 240) : oneLine(look.description, 200) || TEXT[lang].description(server),
    image,
    // A picture the server picked (or the banner) shows big, unless they asked for it small; the icon of the server always small.
    large: Boolean(image) && !embed.thumbnail && Boolean(embed.image ?? look.page.banner),
    color: hex(embed.color) ?? hex(look.color) ?? "#f0a88f",
    siteName: look.server.name || "Petto"
  };
}
function formLinkRedirect(context, lang) {
  const id = String(context.params?.id ?? "");
  if (!PUBLIC_ID.test(id)) return new Response(null, { status: 404 });
  const chosen = lang ?? (() => {
    const l = getDashLang(context);
    return l === "es" ? "es" : l === "pt-BR" ? "pt-BR" : "en";
  })();
  return new Response(null, { status: lang ? 301 : 302, headers: { Location: formIdPath(id, chosen), "Cache-Control": lang ? "public, max-age=3600" : "private, no-store" } });
}

export { formPreview as a, formLinkRedirect as f, loadFormLook as l };
