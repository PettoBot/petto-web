// The link of a form to share in a chat: /f/<public id> (and /es/f/…, /pt-br/f/…). The page of a form (/form#<public id>) is one static
// page for every form, and the id in the hash never reaches the server, so it cannot tell Discord which form it is. This address
// can: an app that reads link previews (Discord, Telegram, WhatsApp, Slack…) gets the title and the description of the form, its
// color, and its banner or the icon of the server, the same as the appeal site does with its own tags. A browser goes on to the page.
import { callPettoWebForm } from './pettoBotApi';
import { PUBLIC_ID, formPagePath, pageLook } from './forms';

type Lang = 'en' | 'es' | 'pt-BR';
// The apps that read link previews say who they are; a person's browser does not say any of these words.
const PREVIEW_AGENTS = /bot\b|bot\/|crawler|spider|preview|facebookexternalhit|embedly|whatsapp|telegram|slack|discord|skype|vkshare|pinterest|linkedin|iframely|mastodon|meta-externalagent/i;

const TEXT: Record<Lang, { description: (server: string) => string }> = {
  en: { description: (server) => `Fill in this form of ${server} with your Discord account.` },
  es: { description: (server) => `Llena este formulario de ${server} con tu cuenta de Discord.` },
  'pt-BR': { description: (server) => `Preencha este formulário de ${server} com sua conta do Discord.` },
};

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const oneLine = (text: unknown, max: number) => {
  const line = String(text ?? '').replace(/\s+/g, ' ').trim();
  return line.length <= max ? line : `${line.slice(0, max - 1).trimEnd()}…`;
};

/** Whether the request comes from an app that reads link previews rather than from a person's browser. */
export const isPreviewAgent = (userAgent: string | null) => PREVIEW_AGENTS.test(String(userAgent ?? ''));

/** The tags of the preview of a form, or null when the bot does not know it (or it cannot be filled on the web). */
export async function formPreview(context: any, id: string, lang: Lang) {
  const look = await callPettoWebForm(context, id, '', 'look', {}, lang);
  const form = look.ok ? look.data?.form : null;
  if (!form) return null;
  const server = String(look.data?.server?.name ?? '').slice(0, 100);
  const icon = typeof look.data?.server?.icon === 'string' && look.data.server.icon.startsWith('https://') ? look.data.server.icon : null;
  const page = pageLook(form.page);
  const title = oneLine(form.title, 45) || 'Form';
  return {
    title: server ? `${title} · ${server}` : title,
    description: oneLine(form.description, 200) || TEXT[lang].description(server || 'Discord'),
    image: page.banner ?? icon,
    large: Boolean(page.banner),
    icon,
    color: typeof form.color === 'number' ? `#${form.color.toString(16).padStart(6, '0')}` : '#f0a88f',
    siteName: server || 'Petto',
  };
}

/**
 * The answer of /f/<id> in a language: a browser is sent to the page of the form (/form#<id>); an app that reads link previews gets a
 * small page with the tags of this form (and the same way on, for one that follows it).
 */
export async function formLinkResponse(context: any, lang: Lang): Promise<Response> {
  const id = String(context.params?.id ?? '');
  if (!PUBLIC_ID.test(id)) return new Response(null, { status: 404 });
  const target = `${formPagePath(lang)}#${id}`;
  const away = new Response(null, { status: 302, headers: { Location: target, 'Cache-Control': 'no-store' } });
  if (!isPreviewAgent(context.request.headers.get('user-agent'))) return away;
  const preview = await formPreview(context, id, lang).catch(() => null);
  if (!preview) return away;
  const url = new URL(context.url.pathname, context.site ?? 'https://petto.sbs').toString();
  const tags = [
    `<title>${escape(preview.title)}</title>`,
    `<meta name="description" content="${escape(preview.description)}">`,
    `<meta name="theme-color" content="${escape(preview.color)}">`,
    preview.icon ? `<link rel="icon" href="${escape(preview.icon)}">` : '',
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${escape(preview.title)}">`,
    `<meta property="og:description" content="${escape(preview.description)}">`,
    `<meta property="og:url" content="${escape(url)}">`,
    `<meta property="og:site_name" content="${escape(preview.siteName)}">`,
    preview.image ? `<meta property="og:image" content="${escape(preview.image)}">` : '',
    `<meta name="twitter:card" content="${preview.large ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:title" content="${escape(preview.title)}">`,
    `<meta name="twitter:description" content="${escape(preview.description)}">`,
    preview.image ? `<meta name="twitter:image" content="${escape(preview.image)}">` : '',
    '<meta name="robots" content="noindex">',
    `<meta http-equiv="refresh" content="0;url=${escape(target)}">`,
  ].filter(Boolean).join('\n');
  const html = `<!doctype html>\n<html lang="${lang}">\n<head>\n<meta charset="utf-8">\n${tags}\n</head>\n<body><a href="${escape(target)}">${escape(preview.title)}</a></body>\n</html>\n`;
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, max-age=300', Vary: 'User-Agent' } });
}
