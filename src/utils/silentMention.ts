// Silent mentions: a `!` right before a mention (`!@everyone`, `!@here`, `!@Role`, `!@"Role name"`, `!<@&id>`, `!<@id>`, `!<#id>`,
// `!{user.mention}`) shows the normal mention pill and notifies nobody. The `!` has to come at the start of the text or after
// anything that is not a letter or a digit (a space, a new line, punctuation); `hello!@here` is not silent. `\!@everyone` shows the
// text `!@everyone`. The previews of the site draw the silent mention as a normal pill, without the `!`.
//
// It works on text that is already HTML-escaped (so the quotes are `&quot;` and the angle brackets `&lt;` `&gt;`), the way both preview
// renderers read it, and it must run before they read the plain forms of a mention.

export interface SilentRender {
  /** The pill: `label` is the text it shows, with its `@` or `#`, already escaped. */
  pill(label: string): string;
  /** The name of a member, role or channel by its id (without the `@` or `#`). */
  id(kind: 'user' | 'role' | 'channel', id: string): string;
  /** `{user.mention}` and the like: the pill of that variable, or null when the variable is not a mention (the text stays as written). */
  variable?(token: string): string | null;
}

const FORM = '(?:@&quot;((?:(?!&quot;)[^\\n]){1,120}?)&quot;|@([\\p{L}\\p{N}_-]+)|&lt;@&amp;(\\d+)&gt;|&lt;@!?(\\d+)&gt;|&lt;#(\\d+)&gt;|\\{\\s*([a-zA-Z0-9_.:|-]+)\\s*\\})';
const SILENT = new RegExp(`(^|[^\\p{L}\\p{N}])(\\\\)?!${FORM}`, 'gu');
// The code of a preview (`like this`) is shown as it was written, so it is left alone.
const CODE = /(<code[^>]*>[\s\S]*?<\/code>)/;

/** Replaces the silent mentions of an escaped text by their pill and drops the `\` of an escaped `\!`. */
export function silentMentions(html: string, render: SilentRender): string {
  if (!html.includes('!')) return html;
  return html.split(CODE).map((part, index) => {
    if (index % 2 === 1) return part;
    return part.replace(SILENT, (whole: string, lead: string, escaped: string | undefined, quoted?: string, name?: string, roleId?: string, userId?: string, channelId?: string, token?: string) => {
      // `\!@everyone` is the text `!@everyone`; the mention after it, if it is a real one, works as a normal mention.
      if (escaped) return lead + whole.slice(lead.length + 1);
      if (quoted !== undefined) return lead + render.pill(`@${quoted}`);
      if (name !== undefined) return lead + render.pill(`@${name}`);
      if (roleId !== undefined) return lead + render.pill(`@${render.id('role', roleId)}`);
      if (userId !== undefined) return lead + render.pill(`@${render.id('user', userId)}`);
      if (channelId !== undefined) return lead + render.pill(`#${render.id('channel', channelId)}`);
      const pill = token !== undefined && render.variable ? render.variable(token) : null;
      return pill === null ? whole : lead + pill;
    });
  }).join('');
}
