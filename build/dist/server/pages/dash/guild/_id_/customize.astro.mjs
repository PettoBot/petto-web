import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, f as renderSlot, d as renderComponent, r as renderTemplate, u as unescapeHTML, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                              */
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { r as renderMarkdown } from '../../../../chunks/discordPreview_BH9qALM3.mjs';
import { p as intToHex, D as DEFAULT_NAME_STYLE, N as NAME_EFFECTS, q as nameStyleCss, t as NAME_FONT_STACKS, u as NAME_FONTS, s as setBotGuildProfile, b as setBotNameStyle, v as fileToDataUri, x as imageUrlToDataUri, y as parseNameStyleForm, j as getGuildInfo, z as getBotProfile, A as getBotDescription, B as getGuildMemberSelf, C as readNameStyle, E as sameNameStyle, L as LEGACY_FONT_IDS } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { o as hasPremiumForGuild, q as resetGuildPremiumCustomizationIfStale } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { cached } from '../../../../chunks/sharedCache_DFk4ml3Q.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$2 = createAstro("https://petto.sbs");
const $$PremiumGate = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PremiumGate;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const {
    locked,
    title = dt("This feature needs Premium"),
    description = dt("Activate Premium for this server to unlock these controls."),
    href = "/dash/premium"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["premium-gate", { "premium-gate-locked": locked }], "class:list")} data-astro-cid-uvelpda3> <div class="premium-gate-content" data-astro-cid-uvelpda3> ${renderSlot($$result, $$slots["default"])} </div> ${locked && renderTemplate`<div class="premium-gate-overlay" role="note"${addAttribute(dt("Premium required"), "aria-label")} data-astro-cid-uvelpda3> <div class="premium-gate-card" data-astro-cid-uvelpda3> <span class="premium-gate-icon" data-astro-cid-uvelpda3>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "18", "height": "18", "data-astro-cid-uvelpda3": true })}</span> <span class="premium-gate-kicker" data-astro-cid-uvelpda3>${dt("Petto Premium")}</span> <h2 data-astro-cid-uvelpda3>${title}</h2> <p data-astro-cid-uvelpda3>${description}</p> <ul class="premium-gate-terms" data-astro-cid-uvelpda3> <li data-astro-cid-uvelpda3><b data-astro-cid-uvelpda3>${dt("Cancel whenever you want")}</b><span data-astro-cid-uvelpda3>${dt("It stays active until the end of the period you already paid and does not renew.")}</span></li> <li data-astro-cid-uvelpda3><b data-astro-cid-uvelpda3>${dt("Charges by mistake are returned")}</b><span data-astro-cid-uvelpda3>${dt("A duplicated charge, one made by mistake or never activated is refunded: open a ticket with the receipt.")}</span></li> </ul> <a class="btn btn-primary btn-sm"${addAttribute(href, "href")} data-astro-cid-uvelpda3> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:lock-open-fill", "width": "14", "height": "14", "data-astro-cid-uvelpda3": true })} ${dt("See Premium plans")} </a> </div> </div>`} </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/PremiumGate.astro", void 0);

const local = (id, label, src) => ({ id, label, src });
const discordAvatar = (n) => ({ id: `discord-${n}`, label: `Discord ${n + 1}`, src: `https://cdn.discordapp.com/embed/avatars/${n}.png` });
function avatarPresetGroups() {
  const recommended = [
    local("default", "Default", "/assets/presets/avatar-default.png"),
    local("christmas", "Christmas", "/assets/presets/avatar-christmas.png"),
    local("halloween", "Halloween", "/assets/presets/avatar-halloween.png")
  ];
  const hats = [
    local("coral", "Coral hat", "/assets/mascot-icon.png"),
    local("blue", "Blue hat", "/assets/duck-blue.png"),
    local("green", "Green hat", "/assets/duck-green.png"),
    local("red", "Red hat", "/assets/duck-red.png"),
    local("crown", "Crown", "/assets/brand/duck-crown.png"),
    local("bowl", "Bowl", "/assets/brand/duck-bowl.png")
  ];
  const friends = [
    ["bambu", "Bambu"],
    ["bellota", "Bellota"],
    ["chispa", "Chispa"],
    ["copo", "Copo"],
    ["lili", "Lili"],
    ["luna", "Luna"],
    ["miel", "Miel"],
    ["nube", "Nube"],
    ["pipo", "Pipo"]
  ].map(([id, label]) => local(id, label, `/assets/brand/characters/${id}.png`));
  return [
    { id: "recommended", label: "Recommended", items: recommended },
    { id: "petto", label: "Petto", items: hats },
    { id: "friends", label: "Friends of Petto", items: friends },
    { id: "discord", label: "Discord", items: [0, 1, 2, 3, 4, 5].map(discordAvatar) }
  ];
}
function bannerPresetGroups(current) {
  const petto = [
    ...current ? [{ id: "current", label: "Petto now", src: current }] : [],
    local("petto", "Petto", "/assets/banner-default.webp"),
    local("link", "Petto dark", "/assets/petto-link-banner-min.png")
  ];
  const colors = ["coral", "blurple", "green", "yellow", "red", "pink", "grey", "night"].map((id) => local(id, id[0].toUpperCase() + id.slice(1), `/assets/presets/banner-${id}.png`));
  return [
    { id: "petto", label: "Petto", items: petto },
    { id: "colors", label: "Colors", items: colors }
  ];
}

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCustomize = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCustomize;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const {
    user,
    guildId,
    guildName,
    guildIcon,
    nickname,
    avatarUrl,
    effectiveAvatar,
    botUsername,
    bannerUrl,
    effectiveBanner,
    description,
    effectiveDescription,
    globalUsername,
    globalAvatar,
    globalBanner,
    globalDescription,
    saved,
    discordWarning,
    error,
    premiumActive,
    nameStyle = null
  } = Astro2.props;
  const errorMessages = {
    avatar_too_large: dt("That image is too big, Discord's limit is small, try something under 2MB."),
    avatar_fetch_failed: dt("Couldn't fetch that image, make sure it's a direct link or a valid image file."),
    banner_too_large: dt("That banner is too big, try something under 2MB."),
    banner_fetch_failed: dt("Couldn't fetch that banner, make sure it's a direct link or a valid image file."),
    discord_rejected: dt("Couldn't save, try again in a moment."),
    name_style_invalid: dt("Pick a font, an effect and valid colors for the name style."),
    name_style_rejected: dt("Discord did not accept this name style. It may not be available for bots yet, nothing was changed.")
  };
  const previewName = nickname || botUsername;
  const styleForm = nameStyle ?? DEFAULT_NAME_STYLE;
  const styleColors = [intToHex(styleForm.colors[0] ?? DEFAULT_NAME_STYLE.colors[0]), intToHex(styleForm.colors[1] ?? DEFAULT_NAME_STYLE.colors[1])];
  const effectColorCount = Object.fromEntries(NAME_EFFECTS.map((effect) => [effect.id, effect.colors]));
  const nameCss = nameStyleCss(nameStyle);
  const previewDescHtml = renderMarkdown(effectiveDescription);
  const globalDescHtml = renderMarkdown(globalDescription);
  const defaultAvatar = globalAvatar ?? "/assets/mascot-icon.webp";
  const customAvatar = Boolean(avatarUrl) || Boolean(globalAvatar && effectiveAvatar !== globalAvatar);
  const customBanner = Boolean(bannerUrl) || Boolean(effectiveBanner && effectiveBanner !== globalBanner);
  const avatarGroups = avatarPresetGroups();
  const bannerGroups = bannerPresetGroups(globalBanner);
  const pickerWords = {
    avatar: dt("Select server avatar"),
    banner: dt("Select server banner"),
    upload: dt("Upload from device"),
    uploadHint: dt("A picture, under 2MB."),
    or: dt("Or import a link"),
    import: dt("Import"),
    samples: dt("Sample images"),
    close: dt("Close")
  };
  const fontStack = NAME_FONT_STACKS[styleForm.fontId] ?? "inherit";
  const nameFontCss = nameStyle ? `font-family:${fontStack};` : "";
  const effectName = nameStyle ? NAME_EFFECTS.find((effect) => effect.id === nameStyle.effectId)?.label : null;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "customize", "pageTitle": "Customize", "premiumActive": premiumActive, "data-astro-cid-4awwq4wc": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-4awwq4wc": true })} ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-4awwq4wc": true })} ${maybeRenderHead()}<div class="sx-page cz-root" data-astro-cid-4awwq4wc> <h1 data-astro-cid-4awwq4wc>${dt("Customize")}</h1> <div class="cz-flashes" data-astro-cid-4awwq4wc> ${saved && renderTemplate`<div class="sx-flash" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-4awwq4wc": true })}${dt("Saved.")}</div>`} ${discordWarning && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-4awwq4wc": true })}${dt("Discord didn't accept the profile sync, it'll retry next save.")}</div>`} ${error && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-4awwq4wc": true })}${errorMessages[error] ?? dt("Something went wrong, try again.")}</div>`} </div> <div class="cz-tiles" data-astro-cid-4awwq4wc>${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Custom nickname"), value: 0, text: nickname ? dt("Yes") : dt("No"), tone: "messages" },
    { label: dt("Custom avatar"), value: 0, text: customAvatar ? dt("Yes") : dt("No"), tone: "voice" },
    { label: dt("Custom banner"), value: 0, text: customBanner ? dt("Yes") : dt("No"), tone: "joins" },
    { label: dt("Custom description"), value: 0, text: description ? dt("Yes") : dt("No"), tone: "reactions" },
    { label: dt("Name style"), value: 0, text: effectName ? dt(effectName) : dt("None"), tone: "invites" }
  ], "data-astro-cid-4awwq4wc": true })}</div> <div class="cz-layout" data-astro-cid-4awwq4wc> <aside class="cz-preview" data-astro-cid-4awwq4wc> <section class="sx-panel cz-preview-panel" data-astro-cid-4awwq4wc> <div class="sx-panel-head" data-astro-cid-4awwq4wc> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "17", "height": "17", "data-astro-cid-4awwq4wc": true })}</span> <h2 data-astro-cid-4awwq4wc>${dt("Preview, in {a}", { a: guildName })}</h2> </div> <div class="cz-profile" data-astro-cid-4awwq4wc> <div class="cz-profile-banner" id="czBanner"${addAttribute(effectiveBanner ? `background-image:url(${effectiveBanner})` : void 0, "style")} data-astro-cid-4awwq4wc> <div class="cz-profile-banner-fallback" id="czBannerFallback"${addAttribute(effectiveBanner ? "display:none" : void 0, "style")} data-astro-cid-4awwq4wc></div> <button type="button" class="cz-edit-btn cz-edit-banner" data-cz-pick="banner"${addAttribute(dt("Edit banner"), "title")} aria-haspopup="dialog" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "13", "height": "13", "data-astro-cid-4awwq4wc": true })}</button> </div> <div class="cz-profile-body" data-astro-cid-4awwq4wc> <div class="cz-profile-avatar-wrap" data-astro-cid-4awwq4wc> <img${addAttribute(effectiveAvatar, "src")} alt="" class="cz-profile-avatar" id="czAvatar" data-astro-cid-4awwq4wc> <button type="button" class="cz-edit-btn cz-edit-avatar" data-cz-pick="avatar"${addAttribute(dt("Edit avatar"), "title")} aria-haspopup="dialog" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-4awwq4wc": true })}</button> </div> <div class="cz-profile-name" data-astro-cid-4awwq4wc><span id="czName"${addAttribute(nameFontCss + nameCss || void 0, "style")} data-astro-cid-4awwq4wc>${previewName}</span><span class="cz-profile-tag" data-astro-cid-4awwq4wc>${dt("APP")}</span></div> <div class="cz-profile-handle" data-astro-cid-4awwq4wc>${botUsername}</div> <p class="cz-profile-desc" id="czDesc"${addAttribute(effectiveDescription ? void 0 : "display:none", "style")} data-astro-cid-4awwq4wc>${unescapeHTML(previewDescHtml)}</p> </div> </div> <div class="sx-sub cz-global" data-astro-cid-4awwq4wc> <div class="cz-global-label" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-simple-fill", "width": "13", "height": "13", "data-astro-cid-4awwq4wc": true })}${dt("Petto's real Discord identity")}</div> <div class="cz-global-row" data-astro-cid-4awwq4wc> <img${addAttribute(globalAvatar ?? "/assets/mascot-icon.webp", "src")} alt="" data-astro-cid-4awwq4wc> <div data-astro-cid-4awwq4wc> <div class="cz-global-name" data-astro-cid-4awwq4wc>${globalUsername}</div> ${globalDescription && renderTemplate`<p class="cz-global-desc" data-astro-cid-4awwq4wc>${unescapeHTML(globalDescHtml)}</p>`} </div> </div> <p class="sx-hint" data-astro-cid-4awwq4wc>${dt("Shared by every server Petto is in, can't be edited from a single server. What you set on the left only changes how Petto looks here.")}</p> </div> </section> </aside> <div class="cz-main" data-astro-cid-4awwq4wc> <form method="POST" enctype="multipart/form-data" class="cz-form sx-stack" id="czForm" data-revert-clean data-discard-sync${addAttribute(botUsername, "data-default-name")}${addAttribute(defaultAvatar, "data-default-avatar")}${addAttribute(globalBanner ?? "", "data-default-banner")}${addAttribute(globalDescription, "data-default-description")} data-astro-cid-4awwq4wc> <section class="sx-panel cz-panel" data-astro-cid-4awwq4wc> <div class="sx-panel-head" data-astro-cid-4awwq4wc> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:identification-badge-fill", "width": "17", "height": "17", "data-astro-cid-4awwq4wc": true })}</span> <h2 id="cz-nick-h" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(dth('Nickname <span class="cz-free-tag">Free</span>'))}` })}</h2> <button type="button" class="cz-reset" data-reset="nickname" data-reset-field="nickname" data-astro-cid-4awwq4wc>${dt("Reset")}</button> </div> <div class="dfx-field" data-astro-cid-4awwq4wc> <input id="nickname" type="text" name="nickname"${addAttribute(nickname, "value")} maxlength="32"${addAttribute(botUsername, "placeholder")} data-count aria-labelledby="cz-nick-h" data-astro-cid-4awwq4wc> <span class="dfx-hint" data-astro-cid-4awwq4wc>${dt('Max 32 characters. Leave empty to use "{a}". This stays available without Premium.', { a: botUsername })}</span> </div> </section> <div class="cz-premium-fields" data-astro-cid-4awwq4wc> ${renderComponent($$result2, "PremiumGate", $$PremiumGate, { "locked": !premiumActive, "title": dt("Customize your server profile"), "description": dt("Server specific avatar, banner and bio are available with Premium. Nicknames are free and stay available to help identify Petto in your server."), "href": `/dash/premium?guild_id=${guildId}`, "data-astro-cid-4awwq4wc": true }, { "default": async ($$result3) => renderTemplate` <div class="sx-stack" data-astro-cid-4awwq4wc> <section class="sx-panel cz-panel" data-astro-cid-4awwq4wc> <div class="sx-panel-head" data-astro-cid-4awwq4wc> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-4awwq4wc>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:image-fill", "width": "17", "height": "17", "data-astro-cid-4awwq4wc": true })}</span> <h2 data-astro-cid-4awwq4wc>${dt("Avatar and banner")}</h2> </div> <div class="dfx-grid" data-astro-cid-4awwq4wc> <div class="dfx-field" data-astro-cid-4awwq4wc> <div class="cz-field-head" data-astro-cid-4awwq4wc><label for="avatar_url" data-astro-cid-4awwq4wc>${dt("Avatar")}</label><button type="button" class="cz-reset" data-reset="avatar_url,avatar_file" data-reset-field="avatar" data-astro-cid-4awwq4wc>${dt("Reset")}</button></div>  <input id="avatar_url" type="url" name="avatar_url"${addAttribute(avatarUrl, "value")} hidden data-astro-cid-4awwq4wc> <input id="avatar_file" type="file" name="avatar_file" accept="image/*" class="cz-sr" tabindex="-1" aria-hidden="true" data-astro-cid-4awwq4wc> <button type="button" class="btn btn-ghost btn-sm cz-choose" data-cz-pick="avatar" aria-haspopup="dialog" data-astro-cid-4awwq4wc>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:image-fill", "width": "14", "height": "14", "data-astro-cid-4awwq4wc": true })}${dt("Choose avatar")}</button> <span class="dfx-hint" data-astro-cid-4awwq4wc>${dt("Pick one of Petto's pictures, upload your own (under 2MB) or paste a link. Reset goes back to the default avatar.")}</span> </div> <div class="dfx-field" data-astro-cid-4awwq4wc> <div class="cz-field-head" data-astro-cid-4awwq4wc><label for="banner_url" data-astro-cid-4awwq4wc>${dt("Banner")}</label><button type="button" class="cz-reset" data-reset="banner_url,banner_file" data-reset-field="banner" data-astro-cid-4awwq4wc>${dt("Reset")}</button></div> <input id="banner_url" type="url" name="banner_url"${addAttribute(bannerUrl, "value")} hidden data-astro-cid-4awwq4wc> <input id="banner_file" type="file" name="banner_file" accept="image/*" class="cz-sr" tabindex="-1" aria-hidden="true" data-astro-cid-4awwq4wc> <button type="button" class="btn btn-ghost btn-sm cz-choose" data-cz-pick="banner" aria-haspopup="dialog" data-astro-cid-4awwq4wc>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:image-fill", "width": "14", "height": "14", "data-astro-cid-4awwq4wc": true })}${dt("Choose banner")}</button> <span class="dfx-hint" data-astro-cid-4awwq4wc>${dt("Pick one of Petto's banners, upload your own (under 2MB) or paste a link. It is shown behind the avatar on the preview card.")}</span> </div> </div> </section> <section class="sx-panel cz-panel" data-astro-cid-4awwq4wc> <div class="sx-panel-head" data-astro-cid-4awwq4wc> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-4awwq4wc>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chat-text-fill", "width": "17", "height": "17", "data-astro-cid-4awwq4wc": true })}</span> <h2 id="cz-desc-h" data-astro-cid-4awwq4wc>${dt("Description")}</h2> <button type="button" class="cz-reset" data-reset="description" data-reset-field="description" data-astro-cid-4awwq4wc>${dt("Reset")}</button> </div> <div class="dfx-field" data-astro-cid-4awwq4wc> <textarea class="dgl-autogrow" id="description" name="description" data-ac data-count maxlength="190" rows="3" aria-labelledby="cz-desc-h"${addAttribute(dt("A friendly moderation and community bot."), "placeholder")} data-astro-cid-4awwq4wc>${description}</textarea> <span class="dfx-hint" data-astro-cid-4awwq4wc>${dt("Max 190 characters. Custom emoji like")} <code data-astro-cid-4awwq4wc>${"<:name:id>"}</code> ${dt("render fine.")}</span> </div> </section> <section class="sx-panel cz-panel cz-style"${addAttribute(JSON.stringify(effectColorCount), "data-effect-colors")} data-astro-cid-4awwq4wc> <div class="sx-panel-head" data-astro-cid-4awwq4wc> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-4awwq4wc>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:palette-fill", "width": "17", "height": "17", "data-astro-cid-4awwq4wc": true })}</span> <h2 data-astro-cid-4awwq4wc>${dt("Name style")}</h2> <button type="button" class="cz-reset" data-reset="name_effect" data-reset-field="name_style" data-astro-cid-4awwq4wc>${dt("Reset")}</button> </div> <div class="cz-style-box" data-astro-cid-4awwq4wc>  <select id="name_effect" name="name_effect" hidden data-astro-cid-4awwq4wc> <option value="0"${addAttribute(!nameStyle, "selected")} data-astro-cid-4awwq4wc>${dt("No style")}</option> ${NAME_EFFECTS.map((effect) => renderTemplate`<option${addAttribute(effect.id, "value")}${addAttribute(nameStyle?.effectId === effect.id, "selected")} data-astro-cid-4awwq4wc>${dt(effect.label)}</option>`)} </select> <select id="name_font" name="name_font" hidden data-astro-cid-4awwq4wc> ${NAME_FONTS.map((font) => renderTemplate`<option${addAttribute(font.id, "value")}${addAttribute(styleForm.fontId === font.id, "selected")} data-astro-cid-4awwq4wc>${dt(font.label)}</option>`)} </select> <div class="dfx-field" data-astro-cid-4awwq4wc> <span class="cz-opt-label" id="cz-effect-h" data-astro-cid-4awwq4wc>${dt("Effect")}</span> <div class="cz-opts" role="radiogroup" aria-labelledby="cz-effect-h" data-cz-opts="name_effect" data-astro-cid-4awwq4wc> <button type="button" role="radio" class="cz-opt" data-value="0"${addAttribute(!nameStyle ? "true" : "false", "aria-checked")} data-astro-cid-4awwq4wc><span class="cz-opt-sample" data-astro-cid-4awwq4wc>${dt("No style")}</span></button> ${NAME_EFFECTS.map((effect) => renderTemplate`<button type="button" role="radio" class="cz-opt"${addAttribute(effect.id, "data-value")}${addAttribute(nameStyle?.effectId === effect.id ? "true" : "false", "aria-checked")} data-astro-cid-4awwq4wc><span class="cz-opt-sample"${addAttribute(effect.id, "data-effect")} data-astro-cid-4awwq4wc>${dt(effect.label)}</span></button>`)} </div> </div> <div class="dfx-field" data-astro-cid-4awwq4wc> <span class="cz-opt-label" id="cz-font-h" data-astro-cid-4awwq4wc>${dt("Font")}</span> <div class="cz-opts cz-opts-fonts" role="radiogroup" aria-labelledby="cz-font-h" data-cz-opts="name_font" data-astro-cid-4awwq4wc> ${NAME_FONTS.map((font) => renderTemplate`<button type="button" role="radio" class="cz-opt cz-opt-font"${addAttribute(font.id, "data-value")}${addAttribute(styleForm.fontId === font.id ? "true" : "false", "aria-checked")}${addAttribute(dt(font.label), "title")} data-astro-cid-4awwq4wc> <span class="cz-opt-gg"${addAttribute(`font-family:${NAME_FONT_STACKS[font.id] ?? "inherit"}`, "style")} data-astro-cid-4awwq4wc>Gg</span> <small data-astro-cid-4awwq4wc>${dt(font.label)}</small> </button>`)} </div> </div> <div class="dfx-grid cz-style-grid" data-astro-cid-4awwq4wc> <div class="dfx-field cz-color" data-astro-cid-4awwq4wc>${renderComponent($$result3, "ColorPicker", $$ColorPicker, { "id": "name_color_1", "name": "name_color_1", "value": styleColors[0], "label": dt("Color"), "data-astro-cid-4awwq4wc": true })}</div> <div class="dfx-field cz-color" data-astro-cid-4awwq4wc>${renderComponent($$result3, "ColorPicker", $$ColorPicker, { "id": "name_color_2", "name": "name_color_2", "value": styleColors[1], "label": dt("Second color"), "data-astro-cid-4awwq4wc": true })}</div> </div> </div> <span class="dfx-hint" data-astro-cid-4awwq4wc>${dt("Like the name styles of Nitro: a gradient, neon or glow on the name of Petto in this server. The preview shows the colors and the effect, Discord draws the font.")}</span> </section> </div> ` })} </div> <div class="sx-foot" data-astro-cid-4awwq4wc><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-4awwq4wc": true })}${dt("Save changes")}</button></div> </form> </div> </div>  <dialog id="czPicker" class="cz-picker" aria-labelledby="czPickerTitle"${addAttribute(pickerWords.avatar, "data-w-avatar")}${addAttribute(pickerWords.banner, "data-w-banner")} data-astro-cid-4awwq4wc> <div class="cz-picker-head" data-astro-cid-4awwq4wc> <h2 id="czPickerTitle" data-astro-cid-4awwq4wc>${pickerWords.avatar}</h2> <button type="button" class="cz-picker-x" data-cz-close${addAttribute(pickerWords.close, "aria-label")} data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-bold", "width": "16", "height": "16", "data-astro-cid-4awwq4wc": true })}</button> </div> ${!premiumActive ? renderTemplate`<div class="cz-picker-lock" data-astro-cid-4awwq4wc> <span class="cz-picker-lock-icon" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "20", "height": "20", "data-astro-cid-4awwq4wc": true })}</span> <p data-astro-cid-4awwq4wc>${dt("Server specific avatar, banner and bio are available with Premium. Nicknames are free and stay available to help identify Petto in your server.")}</p> <a class="btn btn-primary btn-sm"${addAttribute(`/dash/premium?guild_id=${guildId}`, "href")} data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-open-fill", "width": "14", "height": "14", "data-astro-cid-4awwq4wc": true })}${dt("See Premium plans")}</a> </div>` : [["avatar", avatarGroups], ["banner", bannerGroups]].map(([kind, groups]) => renderTemplate`<div class="cz-picker-body"${addAttribute(kind, "data-panel")}${addAttribute(kind !== "avatar", "hidden")} data-astro-cid-4awwq4wc> <button type="button" class="cz-drop"${addAttribute(kind, "data-cz-upload")} data-astro-cid-4awwq4wc> <span class="cz-drop-icon" data-astro-cid-4awwq4wc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:upload-simple-bold", "width": "22", "height": "22", "data-astro-cid-4awwq4wc": true })}</span> <strong data-astro-cid-4awwq4wc>${pickerWords.upload}</strong> <span data-astro-cid-4awwq4wc>${pickerWords.uploadHint}</span> </button> <div class="cz-or" data-astro-cid-4awwq4wc><span data-astro-cid-4awwq4wc>${pickerWords.or}</span></div> <div class="cz-import" data-astro-cid-4awwq4wc> <div class="dfx-field" data-astro-cid-4awwq4wc><input type="url" inputmode="url" placeholder="https://example.com/image.png"${addAttribute(kind, "data-cz-link")} autocomplete="off"${addAttribute(pickerWords.or, "aria-label")} data-astro-cid-4awwq4wc></div> <button type="button" class="btn btn-accent btn-sm"${addAttribute(kind, "data-cz-import")} data-astro-cid-4awwq4wc>${pickerWords.import}</button> </div> <h3 class="cz-samples-h" data-astro-cid-4awwq4wc>${pickerWords.samples}</h3> ${groups.map((group) => renderTemplate`<div class="cz-group" data-astro-cid-4awwq4wc> <div class="cz-group-label" data-astro-cid-4awwq4wc>${dt(group.label)}</div> <div${addAttribute(["cz-samples", { "is-banner": kind === "banner" }], "class:list")} data-astro-cid-4awwq4wc> ${group.items.map((item) => renderTemplate`<button type="button" class="cz-sample"${addAttribute(item.src, "data-src")}${addAttribute(dt(item.label), "title")} data-astro-cid-4awwq4wc> <img${addAttribute(item.src, "src")}${addAttribute(dt(item.label), "alt")} loading="lazy" decoding="async" data-astro-cid-4awwq4wc> </button>`)} </div> </div>`)} </div>`)} </dialog> </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCustomize.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Customize = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Customize;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const premiumActive = await hasPremiumForGuild(Astro2, session.userId, id);
  if (!premiumActive) await resetGuildPremiumCustomizationIfStale(Astro2, id);
  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  async function loadConfig() {
    const res = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=bot_nickname,bot_avatar_url,bot_banner_url,bot_description`, { headers: apiHeaders });
    const rows = res.ok ? await res.json() : [];
    return rows[0] ?? { bot_nickname: null, bot_avatar_url: null, bot_banner_url: null, bot_description: null };
  }
  async function loadNameStyleRaw() {
    try {
      const res = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=bot_name_style`, { headers: apiHeaders });
      const rows = res.ok ? await res.json() : [];
      return rows[0]?.bot_name_style ?? null;
    } catch {
      return null;
    }
  }
  async function loadNameStyle() {
    return readNameStyle(await loadNameStyleRaw());
  }
  const hasLegacyFont = (raw) => Number(raw?.fontId) in LEGACY_FONT_IDS;
  async function saveNameStyle(style) {
    const res = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...apiHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({ bot_name_style: style, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    }).catch(() => null);
    return Boolean(res?.ok);
  }
  let saved = false;
  let error = null;
  let discordWarning = false;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const resetField = String(form.get("reset_field") ?? "").trim();
    if (!premiumActive) {
      if (resetField && resetField !== "nickname") return Astro2.redirect(`/dash/premium?guild_id=${encodeURIComponent(id)}&error=premium_required`);
      const stored = await loadConfig();
      const nickname = resetField === "nickname" ? "" : String(form.get("nickname") ?? "").trim().slice(0, 32);
      if (nickname !== (stored.bot_nickname ?? "")) {
        const applied = await setBotGuildProfile(id, botToken, { nick: nickname || null });
        if (!applied) discordWarning = true;
      }
      const dbRes = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { ...apiHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({ bot_nickname: nickname || null, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
      });
      if (dbRes.ok) saved = true;
      else error = "discord_rejected";
    } else if (resetField) {
      if (resetField === "name_style") {
        const applied = await loadNameStyle() ? await setBotNameStyle(id, botToken, null) : true;
        if (!applied) discordWarning = true;
        if (await saveNameStyle(null)) saved = true;
        else error = "discord_rejected";
      } else if (["nickname", "avatar", "banner", "description"].includes(resetField)) {
        const resetPatch = {
          nickname: { discord: { nick: null }, database: { bot_nickname: null } },
          avatar: { discord: { avatarDataUri: null }, database: { bot_avatar_url: null } },
          banner: { discord: { bannerDataUri: null }, database: { bot_banner_url: null } },
          description: { discord: { bio: null }, database: { bot_description: null } }
        }[resetField];
        const applied = await setBotGuildProfile(id, botToken, resetPatch.discord);
        if (!applied) discordWarning = true;
        const dbRes = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { ...apiHeaders, Prefer: "return=minimal" },
          body: JSON.stringify({ ...resetPatch.database, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
        });
        if (dbRes.ok) saved = true;
        else error = "discord_rejected";
      }
    } else {
      const stored = await loadConfig();
      const nickname = String(form.get("nickname") ?? "").trim().slice(0, 32);
      const avatarUrl = String(form.get("avatar_url") ?? "").trim();
      const avatarFile = form.get("avatar_file");
      const bannerUrl = String(form.get("banner_url") ?? "").trim();
      const bannerFile = form.get("banner_file");
      const description = String(form.get("description") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 190);
      let avatarDataUri;
      let nextAvatarUrl = avatarUrl;
      if (avatarFile instanceof File && avatarFile.size > 0) {
        const result = await fileToDataUri(avatarFile);
        if ("error" in result) error = result.error === "too_large" ? "avatar_too_large" : "avatar_fetch_failed";
        else {
          avatarDataUri = result.dataUri;
          nextAvatarUrl = "";
        }
      } else if (avatarUrl && avatarUrl !== (stored.bot_avatar_url ?? "")) {
        const result = await imageUrlToDataUri(avatarUrl);
        if ("error" in result) error = result.error === "too_large" ? "avatar_too_large" : "avatar_fetch_failed";
        else avatarDataUri = result.dataUri;
      } else if (!avatarUrl && (stored.bot_avatar_url ?? "")) {
        avatarDataUri = null;
      }
      let bannerDataUri;
      let nextBannerUrl = bannerUrl;
      if (!error) {
        if (bannerFile instanceof File && bannerFile.size > 0) {
          const result = await fileToDataUri(bannerFile);
          if ("error" in result) error = result.error === "too_large" ? "banner_too_large" : "banner_fetch_failed";
          else {
            bannerDataUri = result.dataUri;
            nextBannerUrl = "";
          }
        } else if (bannerUrl && bannerUrl !== (stored.bot_banner_url ?? "")) {
          const result = await imageUrlToDataUri(bannerUrl);
          if ("error" in result) error = result.error === "too_large" ? "banner_too_large" : "banner_fetch_failed";
          else bannerDataUri = result.dataUri;
        } else if (!bannerUrl && (stored.bot_banner_url ?? "")) {
          bannerDataUri = null;
        }
      }
      if (!error) {
        const parsedStyle = parseNameStyleForm(form);
        if ("error" in parsedStyle) {
          error = parsedStyle.error;
        } else {
          const bioChanged = description !== (stored.bot_description ?? "");
          const profileChanged = nickname !== (stored.bot_nickname ?? "") || avatarDataUri !== void 0 || bannerDataUri !== void 0 || bioChanged;
          const saveProfile = async () => {
            const [applied, dbRes] = await Promise.all([
              profileChanged ? setBotGuildProfile(id, botToken, { nick: nickname || null, avatarDataUri, bannerDataUri, bio: description || null }) : Promise.resolve(true),
              fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
                method: "POST",
                headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
                body: JSON.stringify({
                  guild_id: id,
                  bot_nickname: nickname || null,
                  bot_avatar_url: nextAvatarUrl || null,
                  bot_banner_url: nextBannerUrl || null,
                  bot_description: description || null,
                  updated_at: (/* @__PURE__ */ new Date()).toISOString()
                }),
                signal: AbortSignal.timeout(15e3)
              }).catch(() => null)
            ]);
            if (!applied) discordWarning = true;
            return Boolean(dbRes?.ok);
          };
          const saveStyle = async () => {
            const stored2 = await loadNameStyleRaw();
            if (sameNameStyle(parsedStyle.style, readNameStyle(stored2)) && !hasLegacyFont(stored2)) return "same";
            if (!await setBotNameStyle(id, botToken, parsedStyle.style)) return "rejected";
            return await saveNameStyle(parsedStyle.style) ? "ok" : "database";
          };
          const [profileSaved, styleResult] = await Promise.all([saveProfile(), saveStyle()]);
          if (profileSaved) saved = true;
          else error = "discord_rejected";
          if (styleResult === "rejected") {
            error = "name_style_rejected";
            saved = false;
          } else if (styleResult === "database") error = "discord_rejected";
        }
      }
    }
  }
  if (Astro2.request.method === "POST" && Astro2.request.headers.get("x-petto-ajax") === "1") {
    return new Response(JSON.stringify({ saved, warning: discordWarning, error }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  }
  if (Astro2.request.method === "POST") {
    const next = new URLSearchParams();
    if (saved) next.set("saved", "1");
    if (discordWarning) next.set("warning", "1");
    if (error) next.set("error", error);
    return Astro2.redirect(`${Astro2.url.pathname}${next.size ? `?${next}` : ""}`, 303);
  }
  if (Astro2.request.method === "GET") {
    const asked = Astro2.url.searchParams;
    saved = asked.get("saved") === "1";
    discordWarning = asked.get("warning") === "1";
    const reason = asked.get("error") ?? "";
    error = /^[a-z_]{1,40}$/.test(reason) ? reason : null;
  }
  const BOT_GLOBAL_TTL_MS = 10 * 6e4;
  const BOT_GLOBAL_STALE_MS = 24 * 36e5;
  const botIdFromToken = (() => {
    try {
      const value = atob(botToken.split(".")[0]);
      return /^\d{15,22}$/.test(value) ? value : null;
    } catch {
      return null;
    }
  })();
  const [guildInfo, botProfile, globalDescription, config, nameStyle, memberSelfEarly] = await Promise.all([
    getGuildInfo(id, botToken),
    cached(`bot-profile:${botToken.split(".")[0]}`, () => getBotProfile(botToken), { freshMs: BOT_GLOBAL_TTL_MS, staleMs: BOT_GLOBAL_STALE_MS, allowStale: true, shared: true, keep: (value) => value !== null }),
    cached(`bot-description:${botToken.split(".")[0]}`, () => getBotDescription(botToken), { freshMs: BOT_GLOBAL_TTL_MS, staleMs: BOT_GLOBAL_STALE_MS, allowStale: true, shared: true }),
    loadConfig(),
    loadNameStyle(),
    botIdFromToken ? getGuildMemberSelf(id, botToken, botIdFromToken) : Promise.resolve(null)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const memberSelf = memberSelfEarly ?? (botProfile && botProfile.id !== botIdFromToken ? await getGuildMemberSelf(id, botToken, botProfile.id) : null);
  const nicknameValue = config.bot_nickname ?? "";
  const avatarUrlValue = config.bot_avatar_url ?? "";
  const bannerUrlValue = config.bot_banner_url ?? "";
  const descriptionValue = config.bot_description ?? "";
  const botUsername = botProfile?.username ?? "Petto";
  const effectiveAvatar = memberSelf?.avatarUrl || botProfile?.avatarUrl || guildInfo.icon || "/assets/mascot-icon.webp";
  const effectiveBanner = memberSelf?.bannerUrl || botProfile?.bannerUrl || null;
  const effectiveDescription = descriptionValue || globalDescription;
  return renderTemplate`${renderComponent($$result, "DashCustomize", $$DashCustomize, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "nickname": nicknameValue, "avatarUrl": avatarUrlValue, "effectiveAvatar": effectiveAvatar, "botUsername": botUsername, "bannerUrl": bannerUrlValue, "effectiveBanner": effectiveBanner, "description": descriptionValue, "effectiveDescription": effectiveDescription, "globalUsername": botProfile?.username ?? "Petto", "globalAvatar": botProfile?.avatarUrl, "globalBanner": botProfile?.bannerUrl, "globalDescription": globalDescription, "saved": saved, "discordWarning": discordWarning, "error": error, "premiumActive": premiumActive, "nameStyle": nameStyle })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/customize.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/customize.astro";
const $$url = "/dash/guild/[id]/customize";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Customize,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
