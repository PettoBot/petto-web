const FORM = "(?:@&quot;((?:(?!&quot;)[^\\n]){1,120}?)&quot;|@([\\p{L}\\p{N}_-]+)|&lt;@&amp;(\\d+)&gt;|&lt;@!?(\\d+)&gt;|&lt;#(\\d+)&gt;|\\{\\s*([a-zA-Z0-9_.:|-]+)\\s*\\})";
const SILENT = new RegExp(`(^|[^\\p{L}\\p{N}])(\\\\)?!${FORM}`, "gu");
const CODE = /(<code[^>]*>[\s\S]*?<\/code>)/;
function silentMentions(html, render) {
  if (!html.includes("!")) return html;
  return html.split(CODE).map((part, index) => {
    if (index % 2 === 1) return part;
    return part.replace(SILENT, (whole, lead, escaped, quoted, name, roleId, userId, channelId, token) => {
      if (escaped) return lead + whole.slice(lead.length + 1);
      if (quoted !== void 0) return lead + render.pill(`@${quoted}`);
      if (name !== void 0) return lead + render.pill(`@${name}`);
      if (roleId !== void 0) return lead + render.pill(`@${render.id("role", roleId)}`);
      if (userId !== void 0) return lead + render.pill(`@${render.id("user", userId)}`);
      if (channelId !== void 0) return lead + render.pill(`#${render.id("channel", channelId)}`);
      const pill = token !== void 0 && render.variable ? render.variable(token) : null;
      return pill === null ? whole : lead + pill;
    });
  }).join("");
}

export { silentMentions as s };
