import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$Base, e as $$DashConfirm } from '../../chunks/Base_Di2YHjFe.mjs';
import { f as feedbackBase, $ as $$FeedbackStyles, s as score, K as KIND_ICON, a as KIND_LABEL, S as STATUS_LABEL, T as TAG_LABEL, b as avatarOf, c as ago } from '../../chunks/feedbackUi_BoNee_B9.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getPost, m as listComments, v as votesOf, i as isStaff, n as emojiUrl, E as EMOJI, S as STATUSES, L as LIMITS } from '../../chunks/feedback_CYIQ_tXr.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const base = feedbackBase(lang);
  const id = Number(Astro2.params.id);
  const post = await getPost(Astro2, id);
  if (!post) return Astro2.redirect(base);
  const session = await getDashboardSession(Astro2);
  const [comments, mine, staff] = await Promise.all([
    listComments(Astro2, id),
    session ? votesOf(Astro2, session.userId, [id]) : Promise.resolve(/* @__PURE__ */ new Map()),
    session ? isStaff(Astro2, session.userId) : Promise.resolve(false)
  ]);
  const vote = mine.get(id) ?? 0;
  const q = Astro2.url.searchParams;
  const flash = q.get("new") ? ["ok", dt("Your post is on the board. Thank you!")] : q.get("updated") ? ["ok", dt("Saved.")] : q.get("commented") ? ["ok", dt("Comment added.")] : q.get("commentDeleted") ? ["ok", dt("Comment deleted.")] : q.get("error") === "rate" ? ["warn", dt("Slow down a little, you wrote too many comments.")] : q.get("error") ? ["warn", dt("That did not work. Try again.")] : null;
  const canDelete = staff || session && session.userId === post.user_id;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${post.title} \xB7 Petto`, "lang": lang, "description": post.body.slice(0, 150) }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "FeedbackStyles", $$FeedbackStyles, {})} ${renderComponent($$result2, "DashConfirm", $$DashConfirm, {})} ${maybeRenderHead()}<main class="fb-wrap" data-no-loader> <p><a class="fb-link"${addAttribute(base, "href")}>← ${dt("All posts")}</a></p> ${flash && renderTemplate`<div${addAttribute(["fb-flash", flash[0]], "class:list")}>${renderComponent($$result2, "Icon", $$Icon, { "name": flash[0] === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15" })}${flash[1]}</div>`} <article class="fb-post"> <div class="fb-vote" data-vote-box${addAttribute(post.id, "data-post")}${addAttribute(session ? "" : "yes", "data-login")}> <button type="button" data-value="1"${addAttribute({ on: vote === 1 }, "class:list")}${addAttribute(dt("Like"), "aria-label")}${addAttribute(dt("Like"), "title")}><img${addAttribute(emojiUrl(EMOJI.like), "src")} alt="" width="22" height="22"></button> <span class="fb-score" data-score>${score(post)}</span> <button type="button" data-value="-1"${addAttribute({ on: vote === -1 }, "class:list")}${addAttribute(dt("Dislike"), "aria-label")}${addAttribute(dt("Dislike"), "title")}><img${addAttribute(emojiUrl(EMOJI.dislike), "src")} alt="" width="22" height="22"></button> </div> <div class="fb-main"> <div class="fb-meta" style="margin-bottom: 8px;"> <span${addAttribute(["fb-badge", `k-${post.kind}`], "class:list")}>${renderComponent($$result2, "Icon", $$Icon, { "name": KIND_ICON[post.kind], "width": "12", "height": "12" })}${dt(KIND_LABEL[post.kind])}</span> <span${addAttribute(["fb-badge", `s-${post.status}`], "class:list")}>${dt(STATUS_LABEL[post.status])}</span> ${post.tags?.map((value) => renderTemplate`<span class="fb-tag">${dt(TAG_LABEL[value] ?? value)}</span>`)} </div> <h1>${post.title}</h1> <div class="fb-meta"> <span class="fb-by"><img${addAttribute(avatarOf(post.user_id, post.avatar), "src")} alt="" width="18" height="18">${post.username || dt("Someone")}</span> <span>${ago(post.created_at, lang)}</span> </div> <div class="fb-body">${post.body}</div> ${post.status_note && renderTemplate`<div class="fb-note"><b>${dt("From the team")}:</b> ${post.status_note}</div>`} ${canDelete && renderTemplate`<form class="fb-delete" method="POST"${addAttribute(`/api/feedback/${post.id}/status`, "action")}${addAttribute(dt("Delete this post? This cannot be undone."), "data-confirm")}> <input type="hidden" name="action" value="delete"> <button class="btn btn-ghost btn-sm fb-danger" type="submit">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14" })} ${dt("Delete this post")}</button> </form>`} </div> </article> ${staff && renderTemplate`<form class="fb-staff" method="POST"${addAttribute(`/api/feedback/${post.id}/status`, "action")}> <h2>${dt("Team")}</h2> <div class="fb-field"><label for="fb-status">${dt("State")}</label> <select id="fb-status" name="status">${STATUSES.map((value) => renderTemplate`<option${addAttribute(value, "value")}${addAttribute(value === post.status, "selected")}>${dt(STATUS_LABEL[value])}</option>`)}</select></div> <div class="fb-field"><label for="fb-note">${dt("Note for the author (optional)")}</label> <textarea id="fb-note" name="note"${addAttribute(LIMITS.note, "maxlength")} style="min-height: 70px;">${post.status_note}</textarea> <span class="fb-hint">${dt("It is shown on the post and added as a comment.")}</span></div> <div class="fb-actions"><button class="btn btn-accent btn-sm" type="submit">${dt("Save state")}</button></div> </form>`} <section class="fb-comments" id="comments"> <h2>${dt("Comments")} · ${comments.length}</h2> ${comments.map((comment) => renderTemplate`<div class="fb-comment"> <img${addAttribute(avatarOf(comment.user_id, comment.avatar), "src")} alt="" width="32" height="32" loading="lazy"> <div class="fb-comment-main"><b>${comment.username || dt("Someone")}</b>${comment.staff && renderTemplate`<span class="fb-staff-mark">${dt("TEAM")}</span>`} <span class="fb-hint">· ${ago(comment.created_at, lang)}</span> <p>${comment.body}</p></div> ${staff && renderTemplate`<form class="fb-comment-del" method="POST"${addAttribute(`/api/feedback/${post.id}/comment-delete`, "action")}${addAttribute(dt("Delete this comment? This cannot be undone."), "data-confirm")}> <input type="hidden" name="comment_id"${addAttribute(comment.id, "value")}> <button class="btn btn-ghost btn-sm fb-danger" type="submit"${addAttribute(dt("Delete this comment"), "aria-label")}${addAttribute(dt("Delete this comment"), "title")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14" })}</button> </form>`} </div>`)} ${session ? renderTemplate`<form class="fb-comment-form" method="POST"${addAttribute(`/api/feedback/${post.id}/comment`, "action")}> <div class="fb-field"><label for="fb-comment">${dt("Add a comment")}</label> <textarea id="fb-comment" name="body"${addAttribute(LIMITS.comment, "maxlength")} required style="min-height: 90px;"></textarea></div> <div class="fb-trap" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div> <div class="fb-actions"><button class="btn btn-accent btn-sm" type="submit">${dt("Comment")}</button></div> </form>` : renderTemplate`<p class="fb-hint" style="margin-top: 14px;"><a class="fb-link"${addAttribute(`/feedback/login?next=/feedback/${post.id}`, "href")}>${dt("Log in with Discord")}</a> ${dt("to vote and comment.")}</p>`} </section> </main> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/pages/feedback/[id].astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/feedback/[id].astro";
const $$url = "/feedback/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
