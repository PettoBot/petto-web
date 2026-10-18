// The page of one form (/form/<public id>, /es/form/…, /pt-br/form/…) is drawn on the server with the look of that form, and its
// head carries the tags of the link preview: an app that reads link previews (Discord, Telegram, WhatsApp, Slack…) gets the title, the
// description, the image and the color the server picked for the link (or, when it picked nothing, the title and the description of
// the form, its banner or the icon of the server, and its color), the same as the appeal site does with its own tags.
import { callPettoWebForm } from './pettoBotApi';
import { PUBLIC_ID, formIdPath, linkEmbed, pageLook, type LinkEmbed, type PageLook } from './forms';
import { getDashLang } from '../i18n/dash';

export type FormLang = 'en' | 'es' | 'pt-BR';

/** How one form looks before anyone logs in: what the bot sends from `look`, checked again. */
export interface FormLook {
  id: string; title: string; description: string | null; color: number | null; page: PageLook; embed: LinkEmbed;
  server: { id: string; name: string; icon: string | null };
}

const TEXT: Record<FormLang, { description: (server: string) => string }> = {
  en: { description: (server) => `Fill in this form of ${server} with your Discord account.` },
  es: { description: (server) => `Llena este formulario de ${server} con tu cuenta de Discord.` },
  'pt-BR': { description: (server) => `Preencha este formulário de ${server} com sua conta do Discord.` },
};

const oneLine = (text: unknown, max: number) => {
  const line = String(text ?? '').replace(/\s+/g, ' ').trim();
  return line.length <= max ? line : `${line.slice(0, max - 1).trimEnd()}…`;
};
const hex = (n: number | null | undefined) => (typeof n === 'number' ? `#${n.toString(16).padStart(6, '0')}` : null);

// The look of a form is kept a minute per form and language: a link pasted in a busy chat is opened by many apps and people at once,
// and the bot is asked once. A form that does not exist is kept a minute too.
const KEEP_MS = 60_000;
const kept = new Map<string, { at: number; value: Promise<{ status: number; look: FormLook | null }> }>();

function shapeLook(data: any): FormLook | null {
  const form = data?.form;
  if (!form) return null;
  const icon = typeof data?.server?.icon === 'string' && data.server.icon.startsWith('https://') ? data.server.icon : null;
  return {
    id: String(form.id ?? ''), title: String(form.title ?? '').slice(0, 100), description: form.description ? String(form.description).slice(0, 1000) : null,
    color: typeof form.color === 'number' && form.color >= 0 && form.color <= 0xffffff ? form.color : null,
    page: pageLook(form.page), embed: linkEmbed(form.embed),
    server: { id: String(data?.server?.id ?? ''), name: String(data?.server?.name ?? '').slice(0, 100), icon },
  };
}

/**
 * The look of a form, or null with the status of the bot (404: no such form, or it is kept in Discord; 502/503: the bot did not
 * answer). It waits at most `budgetMs`, so a slow bot never holds the page: the page then loads the look itself.
 */
export async function loadFormLook(context: any, id: string, lang: FormLang, budgetMs = 2500): Promise<{ status: number; look: FormLook | null }> {
  if (!PUBLIC_ID.test(id)) return { status: 404, look: null };
  const key = `${id}:${lang}`;
  const now = Date.now();
  let entry = kept.get(key);
  if (!entry || now - entry.at > KEEP_MS) {
    const value = callPettoWebForm(context, id, '', 'look', {}, lang).then((r) => ({ status: r.ok ? 200 : r.status, look: r.ok ? shapeLook(r.data) : null }));
    entry = { at: now, value };
    kept.set(key, entry);
    // A failed answer of the bot (not a 404) is not kept: the next visitor asks again.
    value.then((r) => { if (r.status >= 500) kept.delete(key); }).catch(() => kept.delete(key));
    if (kept.size > 500) for (const [k, v] of kept) if (now - v.at > KEEP_MS) kept.delete(k);
  }
  const late = new Promise<{ status: number; look: null }>((resolve) => setTimeout(() => resolve({ status: 504, look: null }), budgetMs));
  return Promise.race([entry.value, late]).catch(() => ({ status: 502, look: null }));
}

/** The tags of the link preview of a form: the server's own choices first, then what the form already has. */
export function formPreview(look: FormLook, lang: FormLang) {
  const server = look.server.name || 'Discord';
  const title = oneLine(look.title, 60) || 'Form';
  const embed = look.embed;
  const image = embed.image ?? look.page.banner ?? look.server.icon;
  return {
    title: embed.title ? oneLine(embed.title, 90) : look.server.name ? `${title} · ${look.server.name}` : title,
    description: embed.description ? oneLine(embed.description, 240) : oneLine(look.description, 200) || TEXT[lang].description(server),
    image,
    // A picture the server picked (or the banner) shows big, unless they asked for it small; the icon of the server always small.
    large: Boolean(image) && !embed.thumbnail && Boolean(embed.image ?? look.page.banner),
    color: hex(embed.color) ?? hex(look.color) ?? '#f0a88f',
    siteName: look.server.name || 'Petto',
  };
}

/**
 * The older link of a form to share (/f/<id>, /es/f/<id>, /pt-br/f/<id>): it goes on to the page of the form, which carries the preview
 * itself now. /f/<id> without a language uses the visitor's (saved choice or browser); an app that reads previews follows it.
 */
export function formLinkRedirect(context: any, lang?: FormLang): Response {
  const id = String(context.params?.id ?? '');
  if (!PUBLIC_ID.test(id)) return new Response(null, { status: 404 });
  const chosen = lang ?? (() => { const l = getDashLang(context); return l === 'es' ? 'es' : l === 'pt-BR' ? 'pt-BR' : 'en'; })();
  return new Response(null, { status: lang ? 301 : 302, headers: { Location: formIdPath(id, chosen), 'Cache-Control': lang ? 'public, max-age=3600' : 'private, no-store' } });
}
