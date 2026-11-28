import { t as tokenValues, f as findSample, s as sampleContext } from './variableSamples_Dw-K9yym.mjs';
import { s as silentMentions } from './silentMention_BDANQeyB.mjs';

const defaultContext = {
  userName: "Liam",
  serverName: "Petto Support",
  botName: "Petto",
  botIcon: "/assets/mascot-icon.webp",
  userAvatar: "/assets/mascot-icon.webp",
  serverIcon: "/assets/mascot-icon.webp"
};
const escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function inline(html, ctx) {
  const links = [];
  const keep = (url, label) => `\0${links.push({ url, label }) - 1}\0`;
  html = html.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => keep(url, label));
  html = html.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_m, lead, url) => `${lead}${keep(url, null)}`);
  const restore = (text) => text.replace(/\u0000(\d+)\u0000/g, (_m, index) => {
    const { url, label } = links[Number(index)];
    return `<a class="dp-link" href="${url}" target="_blank" rel="noopener noreferrer">${label === null ? url : inline(label, ctx)}</a>`;
  });
  const samples = { ...tokenValues({ userId: sampleContext.userId, userName: ctx.userName, serverName: ctx.serverName, memberCount: sampleContext.memberCount }), ...ctx.samples ?? {} };
  let out = html;
  out = out.replace(/`([^`\n]+)`/g, (_m, code) => `<code class="dp-code">${code}</code>`);
  out = silentMentions(out, {
    pill: (label) => `<span class="dp-mention">${label}</span>`,
    id: (kind) => kind === "channel" ? "channel" : kind === "role" ? "role" : "user",
    variable: (token) => {
      const sample = findSample(samples, token);
      return sample?.mention ? `<span class="dp-mention">${sample.text}</span>` : null;
    }
  });
  out = out.replace(/\{\s*([a-zA-Z0-9_.:|-]+)\s*\}/g, (m, token) => {
    if (token.toLowerCase() === "newline") return "<br>";
    const card = /^imgcard:\s*([a-z0-9][a-z0-9 _-]*)/i.exec(token);
    if (card) return `<span class="dp-mention">🖼 ${card[1].trim()}</span>`;
    const sample = findSample(samples, token);
    if (!sample) return `<span class="dp-var">${m}</span>`;
    return sample.mention ? `<span class="dp-mention">${sample.text}</span>` : sample.text;
  });
  out = out.replace(/&lt;a?:(\w+):(\d+)&gt;/g, (m, name, id) => `<img class="dp-emoji" src="https://cdn.discordapp.com/emojis/${id}.${m.startsWith("&lt;a:") ? "gif" : "png"}?size=32" alt=":${name}:">`);
  out = out.replace(/&lt;@!?(\d+)&gt;/g, '<span class="dp-mention">@user</span>');
  out = out.replace(/&lt;@&amp;(\d+)&gt;/g, '<span class="dp-mention">@role</span>');
  out = out.replace(/&lt;#(\d+)&gt;/g, '<span class="dp-mention">#channel</span>');
  out = out.replace(/&lt;\/([\w-]+(?: [\w-]+){0,2}):(\d+)&gt;/g, (_m, name) => `<span class="dp-mention">/${name}</span>`);
  out = out.replace(/&lt;t:(\d+)(?::[a-zA-Z])?&gt;/g, '<span class="dp-mention">Today at 12:00 PM</span>');
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__(.+?)__/g, "<u>$1</u>");
  out = out.replace(/~~(.+?)~~/g, "<s>$1</s>");
  out = out.replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
  out = out.replace(/(^|[\s(])_(?!\s)([^_\n]+?)_(?=$|[\s).,!?:;])/g, "$1<em>$2</em>");
  out = out.replace(/\|\|(.+?)\|\|/g, '<span class="dp-spoiler">$1</span>');
  return restore(out);
}
function renderMarkdown(text, ctx = defaultContext) {
  if (!text) return "";
  const parts = [];
  const codeBlock = /```([\s\S]*?)```/g;
  let last = 0;
  let match;
  const formatLine = (escaped) => {
    const bullet = escaped.replace(/^(\s*)[-*]\s+(?=\S)/, "$1• ");
    const heading = bullet.match(/^(#{1,3})\s+(.*)$/);
    if (heading) return `<span class="dp-h${heading[1].length}">${inline(heading[2], ctx)}</span>`;
    const small = bullet.match(/^-#\s+(.*)$/);
    if (small) return `<span class="dp-sub">${inline(small[1], ctx)}</span>`;
    return inline(bullet, ctx);
  };
  const lines = (chunk) => chunk.split("\n").map((line) => {
    const escaped = escapeHtml(line);
    const quote = escaped.match(/^&gt;\s?(.*)$/);
    if (quote) return `<span class="dp-quote">${formatLine(quote[1])}</span>`;
    return formatLine(escaped);
  }).join("<br>");
  while (match = codeBlock.exec(text)) {
    if (match.index > last) parts.push(lines(text.slice(last, match.index)));
    parts.push(`<pre class="dp-codeblock">${escapeHtml(match[1].replace(/^\w*\n/, ""))}</pre>`);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(lines(text.slice(last)));
  return parts.join("");
}

export { renderMarkdown as r };
