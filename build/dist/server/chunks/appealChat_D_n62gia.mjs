const escapes = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => escapes[c]);
function chatHtml(messages, options) {
  const { prefix, who, when, empty } = options;
  if (!messages.length) return `<p class="${prefix === "ap" ? "ap-muted" : "da-hint"}" data-chat-empty>${escapeHtml(empty)}</p>`;
  return messages.map((m) => `<div class="${prefix}-msg ${escapeHtml(m.author_type)}" data-id="${m.id ?? ""}"><small>${escapeHtml(who(m))} · ${escapeHtml(when(m.created_at))}</small><span>${escapeHtml(m.content)}</span></div>`).join("");
}

export { chatHtml as c };
