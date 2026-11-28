import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, u as unescapeHTML } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$AppealLayout } from '../../../../chunks/AppealLayout_D9gU673z.mjs';
import { a as appealText, l as loadSite } from '../../../../chunks/appealSite_SuoN-UBP.mjs';
import { c as chatHtml } from '../../../../chunks/appealChat_D_n62gia.mjs';
import { l as linkPreview, e as timeAgo, j as answerView, i as loadSubmission, c as callBot, h as loadMessages } from '../../../../chunks/appeals_OSuSBkCm.mjs';
/* empty css                                          */
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$AppealStatus = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AppealStatus;
  const { lang, guild, config, submission, messages, justSent = false, error = null } = Astro2.props;
  const t = appealText(lang);
  const preview = linkPreview(config, guild, lang, { path: guild.path ?? guild.id, origin: Astro2.url.origin });
  const pending = submission.status === "pending";
  const filePath = (id) => `/appeal/${guild.path ?? guild.id}/file/${id}`;
  const who = (m) => m.author_type === "user" ? t("you") : m.author_type === "staff" ? m.anonymous ? t("staff") : m.author_name || t("staff") : t("petto");
  const chat = chatHtml(messages, { prefix: "ap", who, when: (iso) => timeAgo(iso, lang), empty: t("noMessages") });
  const liveUrl = `/appeal/${guild.path ?? guild.id}/status/${submission.id}/live`;
  return renderTemplate`${renderComponent($$result, "AppealLayout", $$AppealLayout, { "lang": lang, "config": config, "guild": guild, "preview": preview }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div> <a class="ap-btn ghost"${addAttribute(`/appeal/${guild.path ?? guild.id}`, "href")}>← ${t("back")}</a> <div class="ap-row" style="margin-top:6px"><h1>${submission.form_name}</h1><span${addAttribute(["ap-chip", submission.status], "class:list")}>${t(`status_${submission.status}`)}</span></div> <p class="ap-muted">${t("sent", { when: timeAgo(submission.created_at, lang) })}${submission.resolved_at && !pending ? ` \xB7 ${t("resolvedAt", { when: timeAgo(submission.resolved_at, lang) })}` : ""}</p> </div> ${justSent && renderTemplate`<div class="ap-card good"><h3>${t("sentTitle")}</h3><p>${t("sentBody")}</p></div>`}${error && renderTemplate`<div class="ap-card bad"><p><b>${t(`err_${error}`)}</b></p></div>`}${submission.resolution_reason && !pending && renderTemplate`<div${addAttribute(["ap-card", submission.status === "accepted" ? "good" : "bad"], "class:list")}><p>${submission.resolution_reason}</p></div>`}<section class="ap-list"> <div class="ap-row"><h2>${t("conversation")}</h2>${pending && renderTemplate`<span class="ap-live" data-live-pill><i></i>${t("live")}</span>`}</div> <div class="ap-chat" id="apChat"${addAttribute(liveUrl, "data-live-url")}${addAttribute(submission.status, "data-status")}${addAttribute(pending ? "1" : "0", "data-pending")}${addAttribute(t("err_failed"), "data-failed")}${addAttribute(t("err_rate_limited"), "data-rate")} aria-live="polite">${unescapeHTML(chat)}</div> ${pending && config.allow_replies && renderTemplate`<form method="POST" class="ap-list" id="apReply"> <input type="hidden" name="action" value="reply"> <textarea class="ap-area" name="content" maxlength="1500"${addAttribute(t("writeMessage"), "placeholder")} required style="min-height:90px"></textarea> <p class="ap-reply-error" role="alert" hidden></p> <div><button class="ap-btn" type="submit">${t("sendMessage")}</button></div> </form>`} ${pending && !config.allow_replies && renderTemplate`<p class="ap-muted">${t("repliesOff")}</p>`} </section> <section class="ap-card soft"> <h3>${t("yourAnswers")}</h3> <div>${submission.answers.map((a) => {
    const view = answerView(a);
    return renderTemplate`<div class="ap-answer"><b>${a.label}</b> ${view.kind === "text" ? renderTemplate`<span>${view.text}</span>` : renderTemplate`<span class="ap-answer-files">${view.files.map((f) => f.mime.startsWith("image/") ? renderTemplate`<a${addAttribute(filePath(f.id), "href")} target="_blank" rel="noopener" class="ap-answer-pic"${addAttribute(f.name, "title")}><img${addAttribute(filePath(f.id), "src")}${addAttribute(f.name, "alt")} loading="lazy"></a>` : renderTemplate`<a${addAttribute(filePath(f.id), "href")} target="_blank" rel="noopener" class="ap-answer-doc">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:file-text-bold", "width": "14", "height": "14" })}${f.name}</a>`)}</span>`} </div>`;
  })}</div> </section> ${pending && renderTemplate`<form method="POST"${addAttribute(`return confirm(${JSON.stringify(t("withdrawConfirm"))})`, "onsubmit")}> <input type="hidden" name="action" value="withdraw"> <button class="ap-btn sec" type="submit">${t("withdraw")}</button> </form>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/AppealStatus.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$sid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$sid;
  const site = await loadSite(Astro2);
  if ("redirect" in site) return Astro2.redirect(site.redirect, 301);
  if ("status" in site) return new Response(site.status === 404 ? "Not found" : "Unavailable", { status: site.status });
  const { id, path, lang, config, guild, session } = site;
  const sid = String(Astro2.params.sid ?? "");
  if (!session) return Astro2.redirect(`/appeal/${path}/login?back=${encodeURIComponent(`/appeal/${path}/status/${sid}`)}`);
  const submission = await loadSubmission(Astro2, id, sid);
  if (!submission || submission.user_id !== session.userId) return new Response("Not found", { status: 404 });
  let error = null;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const action = String(data.get("action") ?? "");
    const result = action === "withdraw" ? await callBot(Astro2, id, "withdraw", { method: "POST", userId: session.userId, body: { submission_id: sid } }) : action === "reply" ? await callBot(Astro2, id, "reply", { method: "POST", userId: session.userId, body: { submission_id: sid, content: String(data.get("content") ?? "") } }) : null;
    if (result?.ok) return Astro2.redirect(`/appeal/${path}/status/${sid}`);
    if (result) error = ["rate_limited", "bot_unavailable"].includes(String(result.payload?.error)) ? String(result.payload.error) : "failed";
  }
  const fresh = await loadSubmission(Astro2, id, sid) ?? submission;
  const messages = await loadMessages(Astro2, sid) ?? [];
  Astro2.response.headers.set("Cache-Control", "private, no-store");
  return renderTemplate`${renderComponent($$result, "AppealStatus", $$AppealStatus, { "lang": lang, "guild": guild, "config": config, "submission": fresh, "messages": messages, "justSent": Astro2.url.searchParams.get("sent") === "1", "error": error })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/appeal/[id]/status/[sid].astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/appeal/[id]/status/[sid].astro";
const $$url = "/appeal/[id]/status/[sid]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$sid,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
