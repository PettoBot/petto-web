import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$AppealLayout } from '../../../../chunks/AppealLayout_D9gU673z.mjs';
import { a as appealText, l as loadSite } from '../../../../chunks/appealSite_SuoN-UBP.mjs';
import { l as linkPreview, a as loadForm, c as callBot } from '../../../../chunks/appeals_OSuSBkCm.mjs';
/* empty css                                          */
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$AppealFormPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AppealFormPage;
  const { lang, guild, config, form, values = {}, errors = {}, topError = null, fileNames = {} } = Astro2.props;
  const formUrl = `/appeal/${guild.path ?? guild.id}/form/${form.id}`;
  const ACCEPT_ATTR = { images: "image/png,image/jpeg,image/webp,image/gif", pdf: "application/pdf,.pdf", images_pdf: "image/png,image/jpeg,image/webp,image/gif,application/pdf,.pdf", documents: "image/png,image/jpeg,image/webp,image/gif,application/pdf,.pdf,text/plain,.txt" };
  const ACCEPT_TEXT = { images: "acceptImages", pdf: "acceptPdf", images_pdf: "acceptImagesPdf", documents: "acceptDocuments" };
  const asList = (id) => Array.isArray(values[id]) ? values[id] : values[id] ? [String(values[id])] : [];
  const t = appealText(lang);
  const base = linkPreview(config, guild, lang, { path: guild.path ?? guild.id, origin: Astro2.url.origin });
  const preview = { ...base, title: `${form.name} \xB7 ${base.title}` };
  const val = (id) => values[id] ?? "";
  const has = (id, option) => Array.isArray(values[id]) ? values[id].includes(option) : values[id] === option;
  const total = form.sections.length;
  return renderTemplate`${renderComponent($$result, "AppealLayout", $$AppealLayout, { "lang": lang, "config": config, "guild": guild, "preview": preview }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div> <a class="ap-btn ghost"${addAttribute(`/appeal/${guild.path ?? guild.id}`, "href")}>← ${t("back")}</a> <h1>${form.icon && renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": `ph:${form.icon}-fill`, "width": "22", "height": "22", "class": "ap-ico" })}`}${form.name}</h1> ${form.description && renderTemplate`<p style="white-space:pre-wrap;margin-top:8px">${form.description}</p>`} </div> ${topError && renderTemplate`<div class="ap-card bad"><p><b>${topError}</b></p></div>`}<form method="POST" class="ap-list" style="gap:18px"> ${form.sections.map((section, i) => renderTemplate`<section class="ap-sec"> <div>${total > 1 && renderTemplate`<span class="ap-step">${i + 1} / ${total}</span>`}<h2>${section.title}</h2>${section.description && renderTemplate`<p class="ap-muted" style="margin-top:4px">${section.description}</p>`}</div> ${section.questions.map((q) => renderTemplate`<div${addAttribute(["ap-field", { err: errors[q.id] }], "class:list")}> ${q.type === "short" || q.type === "number" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <label class="ap-q"${addAttribute(`q_${q.id}`, "for")}>${q.label}${q.required ? renderTemplate`<span class="ap-req"${addAttribute(t("required"), "title")}>*</span>` : renderTemplate`<span class="ap-help"> · ${t("optional")}</span>`}</label> ${q.help && renderTemplate`<span class="ap-help">${q.help}</span>`}<input class="ap-input"${addAttribute(`q_${q.id}`, "id")}${addAttribute(`q_${q.id}`, "name")} type="text"${addAttribute(q.type === "number" ? "decimal" : void 0, "inputmode")}${addAttribute(q.type === "number" ? 20 : 300, "maxlength")}${addAttribute(String(val(q.id)), "value")}> ` })}` : q.type === "paragraph" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <label class="ap-q"${addAttribute(`q_${q.id}`, "for")}>${q.label}${q.required ? renderTemplate`<span class="ap-req"${addAttribute(t("required"), "title")}>*</span>` : renderTemplate`<span class="ap-help"> · ${t("optional")}</span>`}</label> ${q.help && renderTemplate`<span class="ap-help">${q.help}</span>`}<textarea class="ap-area"${addAttribute(`q_${q.id}`, "id")}${addAttribute(`q_${q.id}`, "name")} maxlength="1500">${String(val(q.id))}</textarea> ` })}` : q.type === "dropdown" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <label class="ap-q"${addAttribute(`q_${q.id}`, "for")}>${q.label}${q.required ? renderTemplate`<span class="ap-req"${addAttribute(t("required"), "title")}>*</span>` : renderTemplate`<span class="ap-help"> · ${t("optional")}</span>`}</label> ${q.help && renderTemplate`<span class="ap-help">${q.help}</span>`}<select class="ap-input"${addAttribute(`q_${q.id}`, "id")}${addAttribute(`q_${q.id}`, "name")}> <option value="">${t("choose")}</option> ${q.options.map((option) => renderTemplate`<option${addAttribute(option, "value")}${addAttribute(val(q.id) === option, "selected")}>${option}</option>`)} </select> ` })}` : q.type === "date" || q.type === "link" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <label class="ap-q"${addAttribute(`q_${q.id}`, "for")}>${q.label}${q.required ? renderTemplate`<span class="ap-req"${addAttribute(t("required"), "title")}>*</span>` : renderTemplate`<span class="ap-help"> · ${t("optional")}</span>`}</label> ${q.help && renderTemplate`<span class="ap-help">${q.help}</span>`}<input class="ap-input"${addAttribute(`q_${q.id}`, "id")}${addAttribute(`q_${q.id}`, "name")}${addAttribute(q.type === "date" ? "date" : "url", "type")}${addAttribute(q.type === "date" ? "1900-01-01" : void 0, "min")}${addAttribute(q.type === "date" ? "2100-12-31" : void 0, "max")}${addAttribute(q.type === "link" ? 300 : void 0, "maxlength")}${addAttribute(q.type === "link" ? "https://\u2026" : void 0, "placeholder")}${addAttribute(q.type === "link" ? "url" : void 0, "inputmode")}${addAttribute(String(val(q.id)), "value")}> ` })}` : q.type === "scale" ? renderTemplate`<fieldset style="border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:6px"> <legend class="ap-q" style="padding:0">${q.label}${q.required ? renderTemplate`<span class="ap-req"${addAttribute(t("required"), "title")}>*</span>` : renderTemplate`<span class="ap-help"> · ${t("optional")}</span>`}</legend> ${q.help && renderTemplate`<span class="ap-help">${q.help}</span>`} <div class="ap-scale"> ${Array.from({ length: q.max ?? 5 }, (_, i2) => String(i2 + 1)).map((n) => renderTemplate`<label class="ap-step-opt"><input type="radio"${addAttribute(`q_${q.id}`, "name")}${addAttribute(n, "value")}${addAttribute(val(q.id) === n, "checked")}><span>${n}</span></label>`)} </div> <div class="ap-scale-caption"><span>1 · ${t("scaleLow")}</span><span>${q.max ?? 5} · ${t("scaleHigh")}</span></div> </fieldset>` : q.type === "confirm" ? renderTemplate`<fieldset style="border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:6px"> <legend class="ap-q" style="padding:0">${q.label}${q.required ? renderTemplate`<span class="ap-req"${addAttribute(t("required"), "title")}>*</span>` : renderTemplate`<span class="ap-help"> · ${t("optional")}</span>`}</legend> ${q.help && renderTemplate`<span class="ap-help">${q.help}</span>`} <div class="ap-opts"><label class="ap-opt"><input type="checkbox"${addAttribute(`q_${q.id}`, "name")} value="on"${addAttribute(val(q.id) === "on", "checked")}><span>${t("confirmYes")}</span></label></div> </fieldset>` : q.type === "file" ? renderTemplate`<div data-files${addAttribute(q.id, "data-q")}${addAttribute(q.max_files ?? 3, "data-max")}${addAttribute(`${formUrl}/upload`, "data-upload")}${addAttribute(`/appeal/${guild.path ?? guild.id}/file`, "data-view")}${addAttribute(t("err_file_big"), "data-err-big")}${addAttribute(t("err_file_type"), "data-err-type")}${addAttribute(t("err_file_unreadable"), "data-err-unreadable")}${addAttribute(t("err_file_many"), "data-err-many")}${addAttribute(t("err_file_fail"), "data-err-fail")}${addAttribute(t("uploading"), "data-uploading")}${addAttribute(t("removeFile"), "data-remove")}> <span class="ap-q">${q.label}${q.required ? renderTemplate`<span class="ap-req"${addAttribute(t("required"), "title")}>*</span>` : renderTemplate`<span class="ap-help"> · ${t("optional")}</span>`}</span> ${q.help && renderTemplate`<span class="ap-help">${q.help}</span>`} <span class="ap-help">${t(ACCEPT_TEXT[q.accept ?? "images"])} · ${t("filesHint", { max: q.max_files ?? 3 })}</span> <ul class="ap-filelist" data-list> ${asList(q.id).map((fileId) => renderTemplate`<li class="ap-filechip"><span>${fileNames[fileId] ?? "\u2026"}</span><button type="button" data-remove-file${addAttribute(fileId, "data-id")}${addAttribute(t("removeFile"), "aria-label")}>×</button><input type="hidden"${addAttribute(`q_${q.id}`, "name")}${addAttribute(fileId, "value")}><input type="hidden"${addAttribute(`fn_${fileId}`, "name")}${addAttribute(fileNames[fileId] ?? "", "value")}></li>`)} </ul> <label class="ap-btn sec ap-addfile">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paperclip-bold", "width": "14", "height": "14" })} ${t("addFile")}<input type="file" hidden data-input${addAttribute((q.max_files ?? 3) > 1, "multiple")}${addAttribute(ACCEPT_ATTR[q.accept ?? "images"], "accept")}></label> <span class="ap-err" data-file-error hidden></span> </div>` : renderTemplate`<fieldset style="border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:6px"> <legend class="ap-q" style="padding:0">${q.label}${q.required ? renderTemplate`<span class="ap-req"${addAttribute(t("required"), "title")}>*</span>` : renderTemplate`<span class="ap-help"> · ${t("optional")}</span>`}</legend> ${q.help ? renderTemplate`<span class="ap-help">${q.help}</span>` : renderTemplate`<span class="ap-help">${q.type === "multi" ? t("chooseMany") : t("choose")}</span>`} <div class="ap-opts"> ${(q.type === "yesno" ? ["Yes", "No"] : q.options).map((option) => renderTemplate`<label class="ap-opt"><input${addAttribute(q.type === "multi" ? "checkbox" : "radio", "type")}${addAttribute(`q_${q.id}`, "name")}${addAttribute(option, "value")}${addAttribute(has(q.id, option), "checked")}><span>${q.type === "yesno" ? t(option === "Yes" ? "yes" : "no") : option}</span></label>`)} </div> </fieldset>`} ${errors[q.id] && renderTemplate`<span class="ap-err">${t(`err_${errors[q.id]}`)}</span>`} </div>`)} </section>`)} <div><button class="ap-btn" type="submit">${t("send")}</button></div> </form> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/AppealFormPage.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$fid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$fid;
  const site = await loadSite(Astro2);
  if ("redirect" in site) return Astro2.redirect(site.redirect, 301);
  if ("status" in site) return new Response(site.status === 404 ? "Not found" : "Unavailable", { status: site.status });
  const { id, path, lang, config, guild, session } = site;
  const t = appealText(lang);
  const formId = Number(Astro2.params.fid);
  if (!config.enabled) return Astro2.redirect(`/appeal/${path}`);
  if (!session) return Astro2.redirect(`/appeal/${path}/login?back=${encodeURIComponent(`/appeal/${path}/form/${formId}`)}`);
  const form = Number.isInteger(formId) ? await loadForm(Astro2, id, formId) : null;
  if (!form || form.status !== "live") return new Response("Not found", { status: 404 });
  let values = {};
  let fileNames = {};
  let errors = {};
  let message = null;
  if (Astro2.request.method === "POST") {
    const data = await Astro2.request.formData();
    const answers = {};
    for (const section of form.sections) {
      for (const q of section.questions) {
        const all = data.getAll(`q_${q.id}`).map(String);
        answers[q.id] = q.type === "multi" || q.type === "file" ? all : all[0] ?? "";
        if (q.type === "file") for (const fileId of all) fileNames[fileId] = String(data.get(`fn_${fileId}`) ?? "").slice(0, 80);
      }
    }
    values = answers;
    const result = await callBot(Astro2, id, "submit", { method: "POST", userId: session.userId, body: { form_id: form.id, answers } });
    if (result.ok && result.payload?.id) return Astro2.redirect(`/appeal/${path}/status/${result.payload.id}?sent=1`);
    const code = String(result.payload?.error ?? "failed");
    if (code === "invalid") {
      errors = result.payload.fields ?? {};
      message = t("formError");
    } else message = t(`err_${code}`);
  }
  Astro2.response.headers.set("Cache-Control", "private, no-store");
  return renderTemplate`${renderComponent($$result, "AppealFormPage", $$AppealFormPage, { "lang": lang, "guild": guild, "config": config, "form": form, "values": values, "errors": errors, "topError": message, "fileNames": fileNames })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/appeal/[id]/form/[fid].astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/appeal/[id]/form/[fid].astro";
const $$url = "/appeal/[id]/form/[fid]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$fid,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
