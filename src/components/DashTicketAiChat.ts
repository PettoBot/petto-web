// The two chats of the AI assistant page (DashTicketAi.astro): the test chat (the owner writes as a ticket user) and the setup helper
// (it asks a few questions and proposes a draft of the fields). Loaded only when one of them is opened. Everything the server or the
// model says is shown with textContent, never as HTML.

type Role = 'user' | 'assistant';
type Turn = { role: Role; content: string };
type Words = Record<string, string>;
type Draft = { instructions: string; knowledge: string; handoff: string };

function pageData(): { endpoint: string; words: Words } {
  try { return JSON.parse(document.getElementById('tai-data')?.textContent || '{}'); } catch { return { endpoint: '', words: {} }; }
}
const fill = (text: string, vars: Record<string, string | number>) => Object.keys(vars).reduce((s, k) => s.split(`{${k}}`).join(String(vars[k])), text);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function fieldsOf(form: HTMLFormElement | null) {
  const value = (name: string) => ((form?.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.value ?? '');
  return { instructions: value('instructions'), knowledge: value('knowledge'), handoff: value('handoff'), tone: value('tone'), language_mode: value('language_mode'), max_replies: Number(value('max_replies')) || 3 };
}

export function mountTicketAiChat(root: HTMLElement): void {
  if (root.dataset.taiMounted) return;
  root.dataset.taiMounted = '1';
  const kind = root.dataset.taiKind === 'helper' ? 'helper' : 'test';
  const { endpoint, words } = pageData();
  const log = root.querySelector<HTMLElement>('.tai-log')!;
  const input = root.querySelector<HTMLTextAreaElement>('.tai-compose textarea')!;
  const send = root.querySelector<HTMLButtonElement>('.tai-send')!;
  const repliesOut = root.querySelector<HTMLElement>('[data-tai-replies]');
  const form = document.getElementById('tai-form') as HTMLFormElement | null;
  const intro = log.querySelector<HTMLElement>('[data-tai-intro]');
  const emptyNote = log.querySelector<HTMLElement>('.tai-log-empty');
  // The helper's greeting is part of the conversation, so the model goes on from it.
  const firstTurns: Turn[] = intro ? [{ role: 'assistant', content: intro.querySelector('p')?.textContent || '' }] : [];
  let history: Turn[] = [...firstTurns];
  let busy = false;
  let ended = false;

  const scrollDown = () => { log.scrollTop = log.scrollHeight; };
  const setBusy = (on: boolean) => {
    busy = on;
    send.disabled = on || ended;
    input.disabled = ended;
    root.querySelectorAll<HTMLButtonElement>('[data-tai-draftnow]').forEach((b) => { b.disabled = on || ended; });
  };
  function bubble(role: Role, text: string): HTMLElement {
    emptyNote?.remove();
    const mine = role === 'user';
    const box = el('div', `tai-msg ${mine ? 'tai-me' : 'tai-them'}`);
    box.append(el('span', 'tai-who', mine ? words.you : kind === 'helper' ? words.helper : words.assistant), el('p', '', text));
    log.append(box);
    scrollDown();
    return box;
  }
  function note(className: string, text: string, strong?: string): HTMLElement {
    const box = el('div', className);
    if (className === 'tai-handoff') {
      const icon = document.querySelector('[data-tai-handoff-icon] svg');
      if (icon) box.append(icon.cloneNode(true));
      const body = el('span');
      if (strong) body.append(el('b', '', strong));
      body.append(document.createTextNode(text));
      box.append(body);
    } else {
      box.textContent = text;
    }
    log.append(box);
    scrollDown();
    return box;
  }
  function showReplies(a: number, b: number) {
    if (repliesOut) repliesOut.textContent = fill(words.replies, { a, b });
  }
  function reset() {
    history = [...firstTurns];
    ended = false;
    log.querySelectorAll('.tai-msg:not([data-tai-intro]), .tai-handoff, .tai-sys, .tai-problem, .tai-draft').forEach((n) => n.remove());
    root.querySelectorAll('.tai-draft').forEach((n) => n.remove());
    if (emptyNote && !log.contains(emptyNote)) log.append(emptyNote);
    showReplies(0, fieldsOf(form).max_replies);
    setBusy(false);
    input.value = '';
    input.focus();
  }

  function applyDraft(draft: Draft, card: HTMLElement) {
    if (!form) return;
    for (const name of ['instructions', 'knowledge', 'handoff'] as const) {
      const field = form.elements.namedItem(name) as HTMLTextAreaElement | null;
      if (!field || field.disabled) continue;
      field.value = draft[name].slice(0, field.maxLength > 0 ? field.maxLength : undefined);
      // The same event typing makes: the counters update and the save bar shows (nothing is saved until Save is pressed).
      field.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const done = el('p', 'tai-hint', words.applied);
    card.querySelector('.tai-draft-actions')?.replaceWith(done);
    const target = form.elements.namedItem('instructions') as HTMLElement | null;
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }
  function showDraft(draft: Draft) {
    root.querySelectorAll('.tai-draft').forEach((n) => n.remove());
    const card = el('div', 'tai-draft');
    card.append(el('p', 'tai-draft-title', words.draftTitle));
    for (const name of ['instructions', 'knowledge', 'handoff'] as const) {
      const part = el('div', 'tai-draft-part');
      part.append(el('span', '', words[name]), el('pre', '', draft[name] || words.empty));
      card.append(part);
    }
    const actions = el('div', 'tai-draft-actions');
    const apply = el('button', 'btn btn-accent btn-sm', words.apply);
    apply.type = 'button';
    apply.setAttribute('data-keep', '');
    apply.addEventListener('click', () => applyDraft(draft, card));
    const dismiss = el('button', 'btn btn-ghost btn-sm', words.dismiss);
    dismiss.type = 'button';
    dismiss.setAttribute('data-keep', '');
    dismiss.addEventListener('click', () => (window as any).dglMotion ? (window as any).dglMotion.leave(card, () => card.remove()) : card.remove());
    actions.append(apply, dismiss);
    card.append(actions);
    root.insertBefore(card, root.querySelector('.tai-meta'));
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function submit(textOverride?: string) {
    const text = (textOverride ?? input.value).trim();
    if (!text || busy || ended) return;
    setBusy(true);
    const mine = bubble('user', text);
    if (!textOverride) input.value = '';
    const typing = el('div', 'tai-msg tai-them');
    const dots = el('p', 'tai-dots');
    dots.setAttribute('aria-label', words.thinking);
    dots.append(el('i'), el('i'), el('i'));
    typing.append(dots);
    log.append(typing);
    scrollDown();

    const source = (document.querySelector<HTMLInputElement>('input[name="tai_source"]:checked')?.value) === 'saved' ? 'saved' : 'draft';
    const fields = fieldsOf(form);
    const body = kind === 'test'
      ? { action: 'test', source, draft: source === 'draft' ? fields : undefined, history, message: text }
      : { action: 'helper', current: { instructions: fields.instructions, knowledge: fields.knowledge, handoff: fields.handoff }, history, message: text };
    let data: any = null;
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(30000) });
      data = await res.json().catch(() => null);
    } catch { data = null; }
    typing.remove();

    if (!data || !data.ok) {
      // The message comes back to the box so it can be sent again.
      mine.remove();
      if (!textOverride) input.value = text;
      note('tai-problem', (data && data.message) || words.network);
      setBusy(false);
      return;
    }
    history.push({ role: 'user', content: text });
    if (data.reply) {
      bubble('assistant', data.reply);
      history.push({ role: 'assistant', content: data.reply });
    }
    if (kind === 'test') {
      showReplies(Number(data.aiReplies) || 0, Number(data.maxReplies) || fields.max_replies);
      if (data.handoff) {
        const reason = data.handoff.reason;
        const lead = reason === 'keyword' ? fill(words.handoffKeyword, { k: data.handoff.keyword || '' })
          : reason === 'limit' ? fill(words.handoffLimit, { n: data.maxReplies })
          : reason === 'secret' ? words.handoffSecret
          : words.handoffModel;
        note('tai-handoff', ` ${words.handoffEnd}`, lead);
        ended = true;
      } else if (Number(data.aiReplies) >= Number(data.maxReplies)) {
        note('tai-sys', words.lastReply);
      }
    } else {
      if (data.draft) showDraft(data.draft);
      if (data.draftError) note('tai-problem', data.draftError);
    }
    setBusy(false);
    if (!ended) input.focus({ preventScroll: true });
  }

  send.addEventListener('click', () => submit());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); }
  });
  root.querySelector('[data-tai-reset]')?.addEventListener('click', reset);
  root.querySelector('[data-tai-draftnow]')?.addEventListener('click', () => submit(words.draftNow));
  if (kind === 'test') showReplies(0, fieldsOf(form).max_replies);
  setBusy(false);
}
