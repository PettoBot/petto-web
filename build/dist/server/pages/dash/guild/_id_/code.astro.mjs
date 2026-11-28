import { c as createAstro, a as createComponent, m as maybeRenderHead, d as renderComponent, b as addAttribute, r as renderTemplate } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$ChannelOptions } from '../../../../chunks/ChannelOptions_DK_gXtFz.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { g as getDashLang, a as dashLocale, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                         */
import { C as CODE_GENERATOR_URL } from '../../../../chunks/ui_C1MR3LHJ.mjs';
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { c as canUseCodeCommands } from '../../../../chunks/codeAccess_BCmrm43i.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$2 = createAstro("https://petto.sbs");
const $$DashCodeTools = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DashCodeTools;
  const { endpoint, channels, roles = [] } = Astro2.props;
  const channelChoices = channels.map((channel) => ({ id: channel.id, name: `#${channel.name}` }));
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const ZONES = [
    "UTC",
    "America/Bogota",
    "America/Lima",
    "America/Mexico_City",
    "America/Caracas",
    "America/Santiago",
    "America/Argentina/Buenos_Aires",
    "America/Sao_Paulo",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "America/Panama",
    "America/Guatemala",
    "America/Havana",
    "America/La_Paz",
    "America/Montevideo",
    "America/Asuncion",
    "America/Santo_Domingo",
    "Atlantic/Canary",
    "Europe/Madrid",
    "Europe/Lisbon",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Rome",
    "Europe/Moscow",
    "Europe/Istanbul",
    "Africa/Cairo",
    "Africa/Lagos",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Bangkok",
    "Asia/Manila",
    "Asia/Shanghai",
    "Asia/Tokyo",
    "Asia/Seoul",
    "Australia/Sydney",
    "Pacific/Auckland"
  ];
  const ui = {
    loading: dt("Loading..."),
    unavailable: dt("The bot did not answer. Try again in a moment."),
    closed: dt("Commands in code are turned off for now."),
    // Reminders
    pickCommand: dt("Pick a command first."),
    chooseCommand: dt("Choose a command..."),
    pickChannel: dt("Pick the channel where it runs."),
    badEvery: dt("Every 5 minutes at the least, and every 7 days at the most."),
    badTime: dt("Write the time, like 20:00."),
    reminderSaved: dt("The reminder was saved."),
    reminderCancelled: dt("The reminder was cancelled."),
    confirmCancel: dt("Cancel this reminder? It stops running."),
    yesCancel: dt("Cancel reminder"),
    noReminders: dt("No reminders yet. Make the first one above."),
    everyTime: dt("Every {n} {unit}"),
    everyDay: dt("Every day at {time} ({zone})"),
    everyWeek: dt("Every {day} at {time} ({zone})"),
    nextRun: dt("Next: {when}"),
    inChannel: dt("In #{channel}"),
    minute: dt("minute"),
    minutes: dt("minutes"),
    hour: dt("hour"),
    hours: dt("hours"),
    day: dt("day"),
    days: dt("days"),
    serverZone: dt("The one of the server ({zone})"),
    // Connections
    linksSaved: dt("Connections saved."),
    noLinks: dt("Nothing connected yet."),
    addCommand: dt("Add a command..."),
    remove: dt("Remove"),
    full: dt("The most it can have."),
    noCommands: dt("No commands in code yet. Write one in the Commands tab first."),
    // Settings
    zoneSaved: dt("The time zone was saved."),
    zoneNow: dt("It is {time} there now."),
    zoneBad: dt("That is not a time zone. Use a name like America/Bogota or hours like UTC-5."),
    failed: dt("It could not be saved."),
    optionsSaved: dt("The options were saved."),
    saveFirstSettings: dt("Save the command first."),
    scheduleSaved: dt("The schedule was saved. The command now runs by itself."),
    scheduleOff: dt("The schedule was removed.")
  };
  return renderTemplate`${maybeRenderHead()}<div class="ct-wrap" id="ct-wrap"> <div class="ct-sched" id="ct-sched" hidden> <p class="ct-hint">${dt("The command runs by itself, as you, in the channel you pick, and keeps working if Petto restarts. To send the same message to several channels with one code, put a list of channels in sendMessage inside the command.")}</p> <div class="ct-form"> <div class="ct-field" id="ct-r-every-box"><span>${dt("Every")}</span> <span class="ct-pair"> <input type="number" id="ct-r-every" class="ct-input" min="1" max="10080" value="1"> <select id="ct-r-unit" class="ct-input"><option value="minutes">${dt("minutes")}</option><option value="hours" selected>${dt("hours")}</option><option value="days">${dt("days")}</option></select> </span> </div> <label class="ct-field" id="ct-r-day-box" hidden><span>${dt("Day")}</span> <select id="ct-r-day" class="ct-input"></select> </label> <label class="ct-field" id="ct-r-time-box" hidden><span>${dt("At")}</span> <input type="time" id="ct-r-time" class="ct-input" value="20:00"> </label> <label class="ct-field" id="ct-r-zone-box" hidden><span>${dt("Time zone")}</span> <input type="text" id="ct-r-zone" class="ct-input" list="ct-zones" maxlength="40" spellcheck="false" autocomplete="off"> </label> <label class="ct-field"><span>${dt("Channel where it runs")}</span> <select id="ct-r-channel" class="ct-input"><option value="">${dt("Choose a channel...")}</option>${renderComponent($$result, "ChannelOptions", $$ChannelOptions, { "channels": channels })}</select> </label> </div> </div> <section class="ct-section"> <h3>${dt("Then it also runs")}</h3> <p class="ct-hint">${dt("Connect commands without writing code: the commands you add here run right after this one, as the same member, in the same channel. Up to 3. In code you can also use callCC and execCC.")}</p> <div class="ct-chips" id="ct-links"></div> <select id="ct-link-add" class="ct-input ct-small-input"></select> </section> <section class="ct-section"> <h3>${dt("Who can use it, and where")}</h3> <p class="ct-hint">${dt("A member or a channel that is not allowed gets no answer (a button says it cannot be used here). Leave a list empty to allow everybody and every channel.")}</p> <div class="ct-opt"> <span class="ct-opt-title">${dt("Roles")}</span> <label class="ct-radio"><input type="radio" name="ct-o-rmode" value="require" checked><span>${dt("Only members with one of these roles")}</span></label> <label class="ct-radio"><input type="radio" name="ct-o-rmode" value="ignore"><span>${dt("Everyone except members with one of these roles")}</span></label> ${renderComponent($$result, "MultiSelect", $$MultiSelect, { "name": "ct-o-roles", "options": roles, "selected": [], "placeholder": dt("Search roles...") })} </div> <div class="ct-opt"> <span class="ct-opt-title">${dt("Channels")}</span> <label class="ct-radio"><input type="radio" name="ct-o-cmode" value="only" checked><span>${dt("Only in these channels")}</span></label> <label class="ct-radio"><input type="radio" name="ct-o-cmode" value="ignore"><span>${dt("Everywhere except these channels")}</span></label> ${renderComponent($$result, "MultiSelect", $$MultiSelect, { "name": "ct-o-channels", "options": channelChoices, "selected": [], "placeholder": dt("Search channels...") })} <p class="ct-hint">${dt("A thread counts as its channel.")}</p> </div> </section> <section class="ct-section"> <h3>${dt("Mistakes of this command")}</h3> <label class="ct-check"><input type="checkbox" id="ct-o-errors" checked><span>${dt("Show a mistake as the answer of the command")}</span></label> <label class="ct-field ct-narrow"><span>${dt("Also send the mistakes to a channel")}</span> <select id="ct-o-errchannel" class="ct-input"><option value="">${dt("No channel")}</option>${renderComponent($$result, "ChannelOptions", $$ChannelOptions, { "channels": channels })}</select> </label> <div class="ct-actions"><button type="button" class="ct-btn ct-btn-primary" id="ct-o-save">${renderComponent($$result, "Icon", $$Icon, { "name": "ph:floppy-disk-fill", "width": "13", "height": "13" })}${dt("Save these options")}</button></div> </section> <section class="ct-section"> <h3>${dt("Time zone of the server")}</h3> <p class="ct-hint">${dt("The zone that .TimeZone, the date functions and the reminders use when they do not say one. Names like America/Bogota or hours like UTC-5.")}</p> <div class="ct-zone-row"> <input type="text" id="ct-z-input" class="ct-input" list="ct-zones" maxlength="40" spellcheck="false" autocomplete="off"${addAttribute(dt("Time zone"), "aria-label")}> <button type="button" class="ct-btn" id="ct-z-browser">${renderComponent($$result, "Icon", $$Icon, { "name": "ph:browser-fill", "width": "13", "height": "13" })}${dt("Use the zone of my browser")}</button> <button type="button" class="ct-btn ct-btn-primary" id="ct-z-save">${renderComponent($$result, "Icon", $$Icon, { "name": "ph:floppy-disk-fill", "width": "13", "height": "13" })}${dt("Save time zone")}</button> </div> <p class="ct-hint" id="ct-z-now"></p> </section> <p class="ct-message" id="ct-message" role="status" hidden></p> </div> <datalist id="ct-zones">${ZONES.map((zone) => renderTemplate`<option${addAttribute(zone, "value")}></option>`)}</datalist> <div id="ct" hidden${addAttribute(endpoint, "data-endpoint")}${addAttribute(JSON.stringify(ui), "data-ui")}${addAttribute(dashLang, "data-lang")}${addAttribute(dashLocale(dashLang), "data-locale")}${addAttribute(JSON.stringify(channels), "data-channels")}></div>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCodeTools.astro", void 0);

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCode = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCode;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, commands, prefix, ready, loadFailed = false, channels = [], roles = [] } = Astro2.props;
  const ui = {
    ok: dt("The code is fine."),
    checking: dt("Checking..."),
    line: dt("line {n}"),
    saved: dt("Saved."),
    saving: dt("Saving..."),
    deleted: dt("Deleted."),
    confirmDelete: dt("Delete this command? This cannot be undone."),
    confirmTemplate: dt("Replace what you wrote with this template?"),
    confirmLeave: dt("You have changes that are not saved. Leave anyway?"),
    confirmNew: dt("You have changes that are not saved. Start a new command anyway?"),
    yesDelete: dt("Delete"),
    yesLeave: dt("Leave anyway"),
    yesContinue: dt("Continue"),
    yesReplace: dt("Replace"),
    needName: dt("Write a name first."),
    running: dt("Running..."),
    prints: dt("It would print"),
    nothing: dt("nothing"),
    does: dt("It would do"),
    nothingElse: dt("nothing else"),
    stopped: dt("The code stopped"),
    stepsTime: dt("{steps} steps, {ms} ms"),
    noMatch: dt("No function matches."),
    otherGroup: dt("Other"),
    mainFile: dt("main"),
    fileName: dt("Name of the file"),
    addFile: dt("Add a file"),
    fileLimit: dt("A command can have at most 5 files."),
    confirmDeleteFile: dt("Delete this file and its code? This cannot be undone."),
    yesDeleteFile: dt("Delete file"),
    inFile: dt("{file}, line {n}"),
    unavailable: dt("The bot did not answer. Try again in a moment."),
    closed: dt("Commands in code are turned off for now."),
    triggerSaved: dt("The trigger was saved."),
    scheduleSaved: dt("The schedule was saved. The command now runs by itself."),
    saveFirst: dt("Save the command first."),
    imported: dt("The command was imported. It is not saved until you press Save."),
    importedExists: dt("The command was imported. A command with this name already exists: saving replaces it."),
    importBad: dt("That share code is not valid. Nothing was changed."),
    // The Discord-like preview of a test.
    onlyYou: dt("Only you can see this"),
    dmTo: dt("Direct message to {name}"),
    otherChannel: dt("In another channel ({channel})"),
    after: dt("After {s} s"),
    updated: dt("Changes the message of the button"),
    deletedAfter: dt("Deleted after {s} s"),
    execRuns: dt("Runs {name}"),
    execRunsAfter: dt("Runs {name} after {s} s"),
    deletedNow: dt("Deleted"),
    form: dt("Form"),
    submit: dt("Submit"),
    cancel: dt("Cancel"),
    usedButton: dt("{name} used the button {id}"),
    usedMenu: dt("{name} used the menu {id}"),
    noReply: dt("No answer is shown."),
    // The suggestions of the editor.
    suggestions: dt("Suggestions"),
    limitNear: dt("Close to the limit of characters."),
    limitOver: dt("Over the limit of characters: it cannot be saved."),
    // The cards of the list of commands.
    oneLine: dt("1 line"),
    lines: dt("{n} lines")
  };
  const snippetLabels = [
    ["embed", dt("Embed")],
    ["button", dt("Button and what it does")],
    ["menu", dt("Menu and what it does")],
    ["modal", dt("Form that pops up")],
    ["modalAll", dt("Form with every kind of part")],
    ["reaction", dt("Reaction and what it does")],
    ["cooldown", dt("Cooldown (dbSetExpire)")],
    ["counter", dt("Counter (dbIncr)")],
    ["ranking", dt("Ranking (dbTop and dbRank)")],
    ["mentions", dt("Mentioned member (.Mentions)")]
  ];
  const avatar = user.avatar || "/assets/mascot-icon.webp";
  const linesOf = (source) => source.trim() ? source.replace(/\n+$/, "").split("\n").length : 0;
  const tileNumbers = [commands.length, commands.reduce((sum, command) => sum + linesOf(command.code), 0), commands.filter((command) => command.triggerType && command.triggerType !== "command").length, commands.reduce((most, command) => Math.max(most, linesOf(command.code)), 0)];
  const triggerTypes = [
    ["command", dt("The prefix of Petto")],
    ["prefix", dt("Its own prefix")],
    ["startswith", dt("A message that starts with...")],
    ["exact", dt("A whole message")],
    ["contains", dt("A message that has...")],
    ["@interval", dt("By itself, every some time")],
    ["@daily", dt("By itself, every day")],
    ["@weekly", dt("By itself, every week")]
  ];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "code", "pageTitle": "Commands in code", "data-astro-cid-imi4fbyl": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-imi4fbyl": true })} ${maybeRenderHead()}<div class="cc-page" data-astro-cid-imi4fbyl> <div class="cc-title" data-astro-cid-imi4fbyl> <h1 data-astro-cid-imi4fbyl>${dt("Commands in code")}</h1> <a class="cc-docs" href="https://code.petto.sbs" target="_blank" rel="noopener" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-imi4fbyl": true })}${dt("Read the docs")}</a> </div> ${loadFailed && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-imi4fbyl": true })}${dt("We could not load your commands. Reload the page: nothing was deleted.")} <a href="" onclick="location.reload(); return false;" data-astro-cid-imi4fbyl>${dt("Reload")}</a></div>`} ${!ready && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-imi4fbyl": true })}${dt("This arrives with the next Petto update.")}</div>`} <div id="cc-tiles"${addAttribute(JSON.stringify(tileNumbers), "data-tiles")} data-astro-cid-imi4fbyl> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Commands"), value: tileNumbers[0], tone: "messages" },
    { label: dt("Lines of code"), value: tileNumbers[1], tone: "voice" },
    { label: dt("Custom triggers"), value: tileNumbers[2], tone: "invites" },
    { label: dt("Longest, in lines"), value: tileNumbers[3], tone: "joins" }
  ], "data-astro-cid-imi4fbyl": true })} </div> <div id="cc" class="cc-grid"${addAttribute(`/dash/guild/${guildId}/code-api`, "data-endpoint")}${addAttribute(prefix, "data-prefix")}${addAttribute(JSON.stringify(commands), "data-commands")}${addAttribute(JSON.stringify(ui), "data-ui")}${addAttribute(CODE_GENERATOR_URL, "data-generator")}${addAttribute(dashLang, "data-lang")}${addAttribute(JSON.stringify({ name: user.username, avatar }), "data-user")} data-astro-cid-imi4fbyl> <aside class="cc-side" data-astro-cid-imi4fbyl> <section class="cc-box cc-b-list" data-astro-cid-imi4fbyl> <div class="sx-panel-head" data-astro-cid-imi4fbyl> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "17", "height": "17", "data-astro-cid-imi4fbyl": true })}</span> <h2 data-astro-cid-imi4fbyl>${dt("Your commands")}</h2> <button type="button" class="cc-btn cc-btn-small" id="cc-new" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-imi4fbyl": true })}${dt("New")}</button> </div> <ul class="cc-list" id="cc-list" data-astro-cid-imi4fbyl></ul> <p class="cc-empty sx-empty" id="cc-empty" hidden data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "16", "height": "16", "data-astro-cid-imi4fbyl": true })}${dt("No commands in code yet. Start from a template.")}</p> </section> <section class="cc-box cc-b-tpl" data-astro-cid-imi4fbyl> <div class="sx-panel-head" data-astro-cid-imi4fbyl> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:stack-fill", "width": "17", "height": "17", "data-astro-cid-imi4fbyl": true })}</span> <h2 data-astro-cid-imi4fbyl>${dt("Templates")}</h2> </div> <p class="cc-hint" data-astro-cid-imi4fbyl>${dt("A ready command to start from. It is not saved until you press Save.")}</p> <select id="cc-templates" class="cc-input" data-astro-cid-imi4fbyl><option value="" data-astro-cid-imi4fbyl>${dt("Choose a template...")}</option></select> <p class="cc-note" id="cc-template-note" data-astro-cid-imi4fbyl></p> </section> <section class="cc-box cc-b-fn" data-astro-cid-imi4fbyl> <div class="sx-panel-head" data-astro-cid-imi4fbyl> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:code-fill", "width": "17", "height": "17", "data-astro-cid-imi4fbyl": true })}</span> <h2 data-astro-cid-imi4fbyl>${dt("Functions")}</h2> </div> <input type="text" id="cc-fn-search" class="cc-input"${addAttribute(dt("Search a function"), "placeholder")} autocomplete="off" data-astro-cid-imi4fbyl> <ul class="cc-fns" id="cc-fns" data-astro-cid-imi4fbyl><li class="cc-fns-wait" aria-hidden="true" data-astro-cid-imi4fbyl><span class="sk" data-astro-cid-imi4fbyl></span><span class="sk" data-astro-cid-imi4fbyl></span><span class="sk" data-astro-cid-imi4fbyl></span><span class="sk" data-astro-cid-imi4fbyl></span><span class="sk" data-astro-cid-imi4fbyl></span></li></ul> <p class="cc-note" data-astro-cid-imi4fbyl>${dt("Click a function to put it in the code.")}</p> </section> </aside> <div class="cc-main" data-astro-cid-imi4fbyl> <div class="cc-box cc-b-editor" data-astro-cid-imi4fbyl> <div class="cc-row" data-astro-cid-imi4fbyl> <label class="cc-field cc-grow" data-astro-cid-imi4fbyl> <span data-astro-cid-imi4fbyl>${dt("Name")}</span> <span class="cc-prefixed" data-astro-cid-imi4fbyl><code id="cc-prefix-show" data-astro-cid-imi4fbyl>${prefix}</code><input type="text" id="cc-name" class="cc-input" maxlength="32"${addAttribute(dt("hello"), "placeholder")} autocomplete="off" spellcheck="false" data-astro-cid-imi4fbyl></span> </label> <div class="cc-actions" data-astro-cid-imi4fbyl> <button type="button" class="cc-btn cc-btn-primary" id="cc-save" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:floppy-disk-fill", "width": "14", "height": "14", "data-astro-cid-imi4fbyl": true })}${dt("Save")}</button> <button type="button" class="cc-btn cc-btn-danger" id="cc-delete" hidden data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14", "data-astro-cid-imi4fbyl": true })}${dt("Delete")}</button> </div> </div> <div class="cc-toolbar" data-astro-cid-imi4fbyl> <label class="cc-insert" data-astro-cid-imi4fbyl> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:code-fill", "width": "14", "height": "14", "data-astro-cid-imi4fbyl": true })} <span class="cc-sr" data-astro-cid-imi4fbyl>${dt("Insert")}</span> <select id="cc-snippet" class="cc-input" data-astro-cid-imi4fbyl> <option value="" data-astro-cid-imi4fbyl>${dt("Insert...")}</option> ${snippetLabels.map(([value, label]) => renderTemplate`<option${addAttribute(value, "value")} data-astro-cid-imi4fbyl>${label}</option>`)} </select> </label> <button type="button" class="cc-btn cc-btn-small" id="cc-generator" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magic-wand-fill", "width": "13", "height": "13", "data-astro-cid-imi4fbyl": true })}${dt("Open in the generator")}</button> <span class="cc-note cc-keys" id="cc-keys" data-astro-cid-imi4fbyl>${dt("Tab and Shift+Tab indent, Ctrl+Space suggests, Ctrl+S saves, Ctrl+Enter runs the test.")}</span> </div> <div class="cc-files" id="cc-files" role="tablist"${addAttribute(dt("Files of the command"), "aria-label")} data-astro-cid-imi4fbyl></div> <div class="cc-editor-wrap" id="cc-editor-wrap" data-astro-cid-imi4fbyl> <div class="cc-editor" data-astro-cid-imi4fbyl> <div class="cc-gutter" id="cc-gutter" aria-hidden="true" data-astro-cid-imi4fbyl></div> <div class="cc-area" id="cc-area" data-astro-cid-imi4fbyl> <div class="cc-layer" id="cc-layer" aria-hidden="true" data-astro-cid-imi4fbyl><div class="cc-errband" id="cc-errband" hidden data-astro-cid-imi4fbyl></div><pre class="cc-pre" id="cc-pre" data-astro-cid-imi4fbyl></pre></div> <span class="cc-measure" id="cc-measure" aria-hidden="true" data-astro-cid-imi4fbyl></span> <textarea id="cc-code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"${addAttribute(dt("Code"), "aria-label")} aria-describedby="cc-keys" aria-autocomplete="list" aria-controls="cc-ac"${addAttribute("Hello {{ .User.Username }}!", "placeholder")} data-astro-cid-imi4fbyl></textarea> </div> </div> <ul class="cc-ac" id="cc-ac" role="listbox"${addAttribute(dt("Suggestions"), "aria-label")} hidden data-astro-cid-imi4fbyl></ul> </div> <div class="cc-status" id="cc-status" role="status" data-astro-cid-imi4fbyl><span class="cc-dot" data-astro-cid-imi4fbyl></span><span id="cc-status-text" data-astro-cid-imi4fbyl>${dt("Checking...")}</span><span class="cc-count" id="cc-count" data-astro-cid-imi4fbyl></span></div> <ul class="cc-hints" id="cc-hints" hidden data-astro-cid-imi4fbyl></ul> <p class="cc-message" id="cc-message" hidden data-astro-cid-imi4fbyl></p> </div> <div class="cc-box cc-b-trigger" id="cc-trigger-box" data-astro-cid-imi4fbyl> <div class="sx-panel-head" data-astro-cid-imi4fbyl> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lightning-fill", "width": "17", "height": "17", "data-astro-cid-imi4fbyl": true })}</span> <h2 data-astro-cid-imi4fbyl>${dt("Settings of this command")}</h2> </div> <div class="cc-field" data-astro-cid-imi4fbyl><span data-astro-cid-imi4fbyl>${dt("What starts it")}</span></div> <div class="cc-row" data-astro-cid-imi4fbyl> <select id="cc-trigger-type" class="cc-input" data-astro-cid-imi4fbyl>${triggerTypes.map(([value, label]) => renderTemplate`<option${addAttribute(value, "value")} data-astro-cid-imi4fbyl>${label}</option>`)}</select> <input type="text" id="cc-trigger-text" class="cc-input cc-grow" maxlength="50"${addAttribute(dt("The prefix or the words"), "placeholder")} autocomplete="off" hidden data-astro-cid-imi4fbyl> <button type="button" class="cc-btn" id="cc-trigger-save" data-astro-cid-imi4fbyl>${dt("Save trigger")}</button> </div> <p class="cc-note" id="cc-trigger-note" data-astro-cid-imi4fbyl></p> ${renderComponent($$result2, "DashCodeTools", $$DashCodeTools, { "endpoint": `/dash/guild/${guildId}/code-api`, "channels": channels, "roles": roles, "data-astro-cid-imi4fbyl": true })} </div> <div class="cc-box cc-b-test" data-astro-cid-imi4fbyl> <div class="sx-panel-head" data-astro-cid-imi4fbyl> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:flask-fill", "width": "17", "height": "17", "data-astro-cid-imi4fbyl": true })}</span> <h2 data-astro-cid-imi4fbyl>${dt("Test")}</h2> <span class="cc-note" data-astro-cid-imi4fbyl>${dt("Nothing is sent or saved.")}</span> </div> <div class="cc-row" data-astro-cid-imi4fbyl> <select id="cc-test-mode" class="cc-input" data-astro-cid-imi4fbyl><option value="command" data-astro-cid-imi4fbyl>${dt("Someone uses the command")}</option><option value="button" data-astro-cid-imi4fbyl>${dt("Someone uses a button")}</option><option value="select" data-astro-cid-imi4fbyl>${dt("Someone uses a menu")}</option></select> <input type="text" id="cc-test-args" class="cc-input cc-grow"${addAttribute(dt("Arguments, like: 4 5 6"), "placeholder")} maxlength="500" autocomplete="off" data-astro-cid-imi4fbyl> </div> <div class="cc-row" id="cc-test-extra" hidden data-astro-cid-imi4fbyl> <input type="text" id="cc-test-handler" class="cc-input"${addAttribute(dt("Button or menu id"), "placeholder")} maxlength="20" autocomplete="off" data-astro-cid-imi4fbyl> <input type="text" id="cc-test-value" class="cc-input"${addAttribute(dt("Chosen value (menus)"), "placeholder")} maxlength="100" autocomplete="off" data-astro-cid-imi4fbyl> </div> <div data-astro-cid-imi4fbyl><button type="button" class="cc-btn cc-btn-primary" id="cc-run" data-astro-cid-imi4fbyl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:play-fill", "width": "14", "height": "14", "data-astro-cid-imi4fbyl": true })}${dt("Run test")}</button></div> <div class="cc-result" id="cc-result" hidden data-astro-cid-imi4fbyl></div> </div> </div> </div> </div> ` })}   `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCode.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Code = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Code;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!canUseCodeCommands(Astro2, session.userId)) return Astro2.redirect(`/dash/guild/${id}/overview`);
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const toRow = (row) => ({ name: row.name, code: row.code ?? "", triggerType: row.trigger_type ?? "command", triggerText: row.trigger_text ?? "", files: Array.isArray(row.files) ? row.files.filter((file) => file && typeof file.name === "string" && Number.isInteger(file.size)).map((file) => ({ name: String(file.name), size: Number(file.size) })) : [] });
  async function loadCommands() {
    const base = `${apiUrl}/rest/v1/custom_commands?guild_id=eq.${id}`;
    let withFiles = true;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      for (const [filter, pick] of [["&code=not.is.null", false], ["", true]]) {
        try {
          const columns = `select=name,code,trigger_type,trigger_text${withFiles ? ",files" : ""}&order=name.asc`;
          const res = await fetch(`${base}${filter}&${columns}`, { headers: apiHeaders, signal: AbortSignal.timeout(6e3) });
          if (res.ok) {
            const rows = await res.json();
            return { commands: (pick ? rows.filter((row) => row.code) : rows).map(toRow), state: "ok" };
          }
          const body = await res.text().catch(() => "");
          if (res.status === 400 && withFiles && /files/i.test(body)) {
            withFiles = false;
            continue;
          }
          if (res.status === 400 && /code|trigger_/i.test(body) && pick) return { commands: [], state: "missing" };
        } catch {
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
    return { commands: [], state: "failed" };
  }
  async function loadChannels() {
    try {
      const res = await getGuildList(Astro2, id, botToken, "channels");
      if (!res.ok) return [];
      const all = await res.json();
      const categories = new Map(all.filter((channel) => channel.type === 4).map((channel) => [String(channel.id), String(channel.name)]));
      return all.filter((channel) => channel.type === 0 || channel.type === 5).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)).map((channel) => ({ id: String(channel.id), name: String(channel.name), category: channel.parent_id ? categories.get(String(channel.parent_id)) : void 0 }));
    } catch {
      return [];
    }
  }
  async function loadRoles() {
    try {
      const res = await getGuildList(Astro2, id, botToken, "roles");
      if (!res.ok) return [];
      return (await res.json()).filter((role) => String(role.id) !== id).sort((a, b) => (b.position ?? 0) - (a.position ?? 0)).map((role) => ({ id: String(role.id), name: String(role.name) }));
    } catch {
      return [];
    }
  }
  const [loaded, channels, roles] = await Promise.all([loadCommands(), loadChannels(), loadRoles()]);
  const commands = loaded.commands;
  const ready = loaded.state !== "missing";
  const loadFailed = loaded.state === "failed";
  let prefix = "!";
  try {
    const res = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=prefix`, { headers: apiHeaders });
    if (res.ok) prefix = String((await res.json())?.[0]?.prefix || "!");
  } catch {
  }
  return renderTemplate`${renderComponent($$result, "DashCode", $$DashCode, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "commands": commands, "prefix": prefix, "ready": ready, "loadFailed": loadFailed, "channels": channels, "roles": roles })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/code.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/code.astro";
const $$url = "/dash/guild/[id]/code";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Code,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
