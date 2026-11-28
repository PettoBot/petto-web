import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, d as renderComponent, r as renderTemplate } from '../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_Di2YHjFe.mjs';
import { a as KIND_LABEL, S as STATUS_LABEL, T as TAG_LABEL, s as score, K as KIND_ICON, b as avatarOf, c as ago, f as feedbackBase, $ as $$FeedbackStyles } from '../chunks/feedbackUi_BoNee_B9.mjs';
import { $ as $$Icon } from '../chunks/Icon_CDiFdbJV.mjs';
import { m as makeT, g as getDashLang } from '../chunks/dash_CORIPvM-.mjs';
import { n as emojiUrl, o as SORTS, K as KINDS, S as STATUSES, T as TAGS, E as EMOJI, p as listPosts, v as votesOf } from '../chunks/feedback_CYIQ_tXr.mjs';
import { g as getDashboardSession } from '../chunks/dashAuth_uqFK7-ED.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$FeedbackBoard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FeedbackBoard;
  const { lang, loggedIn, result, mine, filters, deleted = false } = Astro2.props;
  const dt = makeT(lang);
  const base = feedbackBase(lang);
  const { kind, status, tag, sort, q: search, page } = filters;
  const href = (changes) => {
    const next = new URLSearchParams();
    const current = { kind, status, tag, sort: sort === "top" ? "" : sort, q: search };
    for (const [key, value] of Object.entries({ ...current, ...Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, String(v)])) })) {
      if (value && !(key === "page" && value === "1")) next.set(key, value);
    }
    const text = next.toString();
    return `${base}${text ? `?${text}` : ""}`;
  };
  const active = [
    ...kind ? [{ key: "kind", label: dt(KIND_LABEL[kind] ?? kind) }] : [],
    ...status ? [{ key: "status", label: dt(STATUS_LABEL[status] ?? status) }] : [],
    ...tag ? [{ key: "tag", label: dt(TAG_LABEL[tag] ?? tag) }] : []
  ];
  const newHref = loggedIn ? `${base}/new` : `/feedback/login?next=/feedback/new`;
  const flash = deleted ? dt("The post was deleted.") : "";
  return renderTemplate`${maybeRenderHead()}<main class="fb-wrap" data-no-loader${addAttribute(base, "data-base")}> <div class="fb-head"> <div> <div class="fb-eyebrow"><img${addAttribute(emojiUrl(EMOJI.suggest), "src")} alt="" width="20" height="20">${dt("Feedback")}</div> <h1>${dt("Tell us what Petto needs")}</h1> <p class="fb-lede">${dt("Ideas, feedback and bugs. Write yours, vote on the ones you want, and see what the team plans.")}</p> </div> <a class="btn btn-accent fb-new"${addAttribute(newHref, "href")}>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14" })}${dt("New post")}</a> </div> ${flash && renderTemplate`<div class="fb-flash ok">${renderComponent($$result, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15" })}${flash}</div>`} ${!result && renderTemplate`<div class="fb-flash warn">${renderComponent($$result, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15" })}${dt("The board is not available right now. Try again in a moment.")}</div>`} <div id="fb-live"> <form class="fb-bar" method="GET"${addAttribute(base, "action")}> <label class="fb-find"> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "15", "height": "15" })} <input type="search" name="q"${addAttribute(search, "value")}${addAttribute(dt("Search posts"), "placeholder")} maxlength="60"${addAttribute(dt("Search posts"), "aria-label")}> </label> ${kind && renderTemplate`<input type="hidden" name="kind"${addAttribute(kind, "value")}>`} ${tag && renderTemplate`<input type="hidden" name="tag"${addAttribute(tag, "value")}>`} ${status && renderTemplate`<input type="hidden" name="status"${addAttribute(status, "value")}>`} <select name="sort"${addAttribute(dt("Sort"), "aria-label")} data-auto-submit> ${SORTS.map((value) => renderTemplate`<option${addAttribute(value, "value")}${addAttribute(value === sort, "selected")}>${value === "top" ? dt("Top") : value === "new" ? dt("Newest") : dt("Most discussed")}</option>`)} </select> </form> <details class="fb-filters" data-filters> <summary class="fb-filters-btn"> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:sliders-horizontal-fill", "width": "14", "height": "14" })}${dt("Filters")} ${active.length > 0 && renderTemplate`<span class="fb-count">${active.length}</span>`} ${renderComponent($$result, "Icon", $$Icon, { "class": "fb-caret", "name": "ph:caret-down-bold", "width": "12", "height": "12" })} </summary> <div class="fb-filters-body"> <div class="fb-group"><span class="fb-group-name">${dt("Type")}</span> <div class="fb-chips"> <a${addAttribute(["fb-chip", { on: !kind }], "class:list")}${addAttribute(href({ kind: "", page: 1 }), "href")}>${dt("All")}</a> ${KINDS.map((value) => renderTemplate`<a${addAttribute(["fb-chip", { on: kind === value }], "class:list")}${addAttribute(href({ kind: value, page: 1 }), "href")}>${renderComponent($$result, "Icon", $$Icon, { "name": KIND_ICON[value], "width": "13", "height": "13" })}${dt(KIND_LABEL[value])}</a>`)} </div> </div> <div class="fb-group"><span class="fb-group-name">${dt("State")}</span> <div class="fb-chips"> <a${addAttribute(["fb-chip", { on: !status }], "class:list")}${addAttribute(href({ status: "", page: 1 }), "href")}>${dt("Any state")}</a> ${STATUSES.map((value) => renderTemplate`<a${addAttribute(["fb-chip", { on: status === value }], "class:list")}${addAttribute(href({ status: value, page: 1 }), "href")}>${dt(STATUS_LABEL[value])}</a>`)} </div> </div> <div class="fb-group"><span class="fb-group-name">${dt("Topic")}</span> <div class="fb-chips"> <a${addAttribute(["fb-chip", { on: !tag }], "class:list")}${addAttribute(href({ tag: "", page: 1 }), "href")}>${dt("Any topic")}</a> ${TAGS.map((value) => renderTemplate`<a${addAttribute(["fb-chip", { on: tag === value }], "class:list")}${addAttribute(href({ tag: value, page: 1 }), "href")}>${dt(TAG_LABEL[value])}</a>`)} </div> </div> </div> </details> ${active.length > 0 && renderTemplate`<div class="fb-active"${addAttribute(dt("Filters"), "aria-label")}> ${active.map((entry) => renderTemplate`<a class="fb-pill fb-chip"${addAttribute(href({ [entry.key]: "", page: 1 }), "href")}${addAttribute(dt("Remove"), "title")}>${entry.label}${renderComponent($$result, "Icon", $$Icon, { "name": "ph:x-bold", "width": "10", "height": "10" })}</a>`)} ${active.length > 1 && renderTemplate`<a class="fb-clear fb-chip"${addAttribute(href({ kind: "", status: "", tag: "", page: 1 }), "href")}>${dt("Clear all")}</a>`} </div>`} ${result && result.posts.length === 0 && renderTemplate`<div class="fb-empty">${dt("No posts here yet. Be the first one!")}</div>`} <div class="fb-list"> ${result?.posts.map((post) => {
    const vote = mine.get(post.id) ?? 0;
    const tags = post.tags ?? [];
    return renderTemplate`<article class="fb-card"${addAttribute(post.id, "data-post")}> <div class="fb-vote" data-vote-box${addAttribute(post.id, "data-post")}${addAttribute(loggedIn ? "" : "yes", "data-login")}> <button type="button" data-value="1"${addAttribute({ on: vote === 1 }, "class:list")}${addAttribute(dt("Like"), "aria-label")}${addAttribute(dt("Like"), "title")}><img${addAttribute(emojiUrl(EMOJI.like), "src")} alt="" width="22" height="22"></button> <span class="fb-score" data-score>${score(post)}</span> <button type="button" data-value="-1"${addAttribute({ on: vote === -1 }, "class:list")}${addAttribute(dt("Dislike"), "aria-label")}${addAttribute(dt("Dislike"), "title")}><img${addAttribute(emojiUrl(EMOJI.dislike), "src")} alt="" width="22" height="22"></button> </div> <div class="fb-main"> <div class="fb-badges"> <span${addAttribute(["fb-badge", `k-${post.kind}`], "class:list")}>${renderComponent($$result, "Icon", $$Icon, { "name": KIND_ICON[post.kind], "width": "12", "height": "12" })}${dt(KIND_LABEL[post.kind])}</span> ${post.status !== "open" && renderTemplate`<span${addAttribute(["fb-badge", `s-${post.status}`], "class:list")}>${dt(STATUS_LABEL[post.status])}</span>`} ${tags.slice(0, 2).map((value) => renderTemplate`<span class="fb-tag">${dt(TAG_LABEL[value] ?? value)}</span>`)} ${tags.length > 2 && renderTemplate`<span class="fb-tag">+${tags.length - 2}</span>`} </div> <a class="fb-title"${addAttribute(`${base}/${post.id}`, "href")}>${post.title}</a> ${post.body && renderTemplate`<p class="fb-excerpt">${post.body}</p>`} <div class="fb-meta"> <span class="fb-by"><img${addAttribute(avatarOf(post.user_id, post.avatar), "src")} alt="" width="18" height="18" loading="lazy">${post.username || dt("Someone")}</span> <span>${ago(post.created_at, lang)}</span> <a class="fb-link"${addAttribute(`${base}/${post.id}#comments`, "href")}>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:chat-circle-fill", "width": "12", "height": "12" })} ${post.comments_count}</a> </div> </div> </article>`;
  })} </div> ${result && result.pages > 1 && renderTemplate`<nav class="fb-pager"${addAttribute(dt("Pages"), "aria-label")}> ${page > 1 && renderTemplate`<a class="fb-chip"${addAttribute(href({ page: page - 1 }), "href")}>← ${dt("Previous")}</a>`} <span>${dt("Page {a} of {b}", { a: Math.min(page, result.pages), b: result.pages })}</span> ${page < result.pages && renderTemplate`<a class="fb-chip"${addAttribute(href({ page: page + 1 }), "href")}>${dt("Next")} →</a>`} </nav>`} </div> </main> `;
}, "/home/runner/work/petto-web/petto-web/src/components/feedback/FeedbackBoard.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const session = await getDashboardSession(Astro2);
  const q = Astro2.url.searchParams;
  const filters = { kind: q.get("kind") ?? "", status: q.get("status") ?? "", tag: q.get("tag") ?? "", sort: q.get("sort") ?? "top", q: q.get("q") ?? "", page: Number(q.get("page") ?? 1) || 1 };
  const result = await listPosts(Astro2, filters);
  const mine = session && result ? await votesOf(Astro2, session.userId, result.posts.map((post) => post.id)) : /* @__PURE__ */ new Map();
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${dt("Feedback")} \xB7 Petto`, "lang": lang, "description": dt("Ideas, feedback and bugs for Petto. Write yours and vote on the ones you want.") }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "FeedbackStyles", $$FeedbackStyles, {})} ${renderComponent($$result2, "FeedbackBoard", $$FeedbackBoard, { "lang": lang, "loggedIn": Boolean(session), "result": result, "mine": mine, "filters": filters, "deleted": Boolean(q.get("deleted")) })} ` })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/feedback/index.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/feedback/index.astro";
const $$url = "/feedback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
