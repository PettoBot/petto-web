// The conversation of an appeal, drawn the same way on the public page, on the dashboard and in the answers that keep them live.
export interface ChatMessage { id?: number; author_type: string; content: string; created_at: string }

const escapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (value: string) => String(value ?? '').replace(/[&<>"']/g, (c) => escapes[c]);

/** `prefix` is the family of CSS classes: ap (public page) or da (dashboard). */
export function chatHtml(messages: ChatMessage[], options: { prefix: 'ap' | 'da'; who: (m: any) => string; when: (iso: string) => string; empty: string }): string {
  const { prefix, who, when, empty } = options;
  if (!messages.length) return `<p class="${prefix === 'ap' ? 'ap-muted' : 'da-hint'}" data-chat-empty>${escapeHtml(empty)}</p>`;
  return messages
    .map((m) => `<div class="${prefix}-msg ${escapeHtml(m.author_type)}" data-id="${m.id ?? ''}"><small>${escapeHtml(who(m))} · ${escapeHtml(when(m.created_at))}</small><span>${escapeHtml(m.content)}</span></div>`)
    .join('');
}
