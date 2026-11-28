import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { c as cleanJoinGate, L as LIMITS, a as cleanDomains, b as cleanWords, d as cleanConditions, e as cleanRule } from '../../../../chunks/modRules_BmF65XBm.mjs';
import { O as callPettoRuleTest } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const SNOWFLAKE = /^\d{15,25}$/;
const ID = /^\d{1,18}$/;
const POST = async (astro) => {
  const { id } = astro.params;
  const dt = makeT(getDashLang(astro));
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, message: dt("Sign in again.") }, 401);
  const body = await astro.request.json().catch(() => null);
  const op = String(body?.op ?? "");
  const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!apiUrl || !apiKey) return json({ ok: false, message: dt("The dashboard is not connected to the bot.") }, 500);
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const rest = (path, init = {}) => fetch(`${apiUrl}/rest/v1/${path}`, { ...init, headers: { ...headers, ...init.headers } }).catch(() => null);
  const rows = async (path) => {
    const res = await rest(path);
    return res?.ok ? await res.json().catch(() => null) : null;
  };
  const fail = (message, status = 400) => json({ ok: false, message }, status);
  const failed = () => fail(dt("Something went wrong, try again."), 502);
  const rowId = (value) => ID.test(String(value ?? "")) ? String(value) : null;
  if (op === "settings") {
    const channel = SNOWFLAKE.test(String(body.log_channel_id ?? "")) ? String(body.log_channel_id) : null;
    await ensureGuildRow(apiUrl, headers, id);
    const quarantine = SNOWFLAKE.test(String(body.quarantine_role_id ?? "")) ? String(body.quarantine_role_id) : null;
    const decay = Math.max(0, Math.min(1e3, Math.floor(Number(body.heat_decay)) || 0));
    const res = await rest("mod_rule_settings?on_conflict=guild_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, enabled: body.enabled !== false, ignore_staff: body.ignore_staff !== false, ignore_bots: body.ignore_bots !== false, heat_decay: Number.isFinite(decay) ? decay : 10, quarantine_role_id: quarantine, log_channel_id: channel, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
    return res?.ok ? json({ ok: true }) : failed();
  }
  if (op === "join_gate_save") {
    const gate = cleanJoinGate(body.gate);
    const res = await (async () => {
      await ensureGuildRow(apiUrl, headers, id);
      return rest("mod_join_gate?on_conflict=guild_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, ...gate, raid_alert_channel_id: gate.raid_alert_channel_id || null, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
    })();
    return res?.ok ? json({ ok: true }) : failed();
  }
  if (op === "test") {
    const result = await callPettoRuleTest(astro, id, String(auth.session.userId), body.rule, body.sample, getDashLang(astro));
    return result ? json(result, result.ok === false && result.error === "failed" ? 502 : 200) : fail(dt("Petto did not answer. Try again in a moment."), 502);
  }
  if (op === "import") {
    const data = body.data;
    if (!data || typeof data !== "object" || data.format !== "petto-mod-rules") return fail(dt("That is not a file made by Export."));
    await ensureGuildRow(apiUrl, headers, id);
    const existingLists = await rows(`mod_lists?guild_id=eq.${id}&select=id,name,kind`) ?? [];
    const listIds = new Map(existingLists.map((l) => [`${l.kind}:${l.name}`, Number(l.id)]));
    let listsMade = 0;
    let setsMade = 0;
    let rulesMade = 0;
    let skipped = 0;
    for (const list of (Array.isArray(data.lists) ? data.lists : []).slice(0, LIMITS.lists)) {
      const name = String(list?.name ?? "").trim().slice(0, LIMITS.listName);
      const kind = list?.kind === "domains" ? "domains" : "words";
      if (!name || listIds.has(`${kind}:${name}`) || listIds.size >= LIMITS.lists) {
        if (name) skipped += 1;
        continue;
      }
      const items = kind === "domains" ? cleanDomains(list.items) : cleanWords(list.items);
      const res = await rest("mod_lists", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ guild_id: id, name, kind, items }) });
      const made = res?.ok ? (await res.json().catch(() => null))?.[0] : null;
      if (made) {
        listIds.set(`${kind}:${name}`, Number(made.id));
        listsMade += 1;
      } else skipped += 1;
    }
    const currentSets = await rows(`mod_rulesets?guild_id=eq.${id}&select=id,position&order=position.desc`) ?? [];
    let position = Number(currentSets[0]?.position) || 0;
    let setCount = currentSets.length;
    for (const set of (Array.isArray(data.rulesets) ? data.rulesets : []).slice(0, LIMITS.rulesets)) {
      const name = String(set?.name ?? "").trim().slice(0, LIMITS.listName);
      if (!name || setCount >= LIMITS.rulesets) {
        skipped += 1;
        continue;
      }
      position += 1;
      const res = await rest("mod_rulesets", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ guild_id: id, name, enabled: set.enabled !== false, conditions: cleanConditions(set.conditions), position }) });
      const made = res?.ok ? (await res.json().catch(() => null))?.[0] : null;
      if (!made) {
        skipped += 1;
        continue;
      }
      setCount += 1;
      setsMade += 1;
      let rulePosition = 0;
      for (const raw of (Array.isArray(set.rules) ? set.rules : []).slice(0, LIMITS.rulesPerSet)) {
        const triggers = (Array.isArray(raw?.triggers) ? raw.triggers : []).map((tr) => {
          if (tr && typeof tr === "object" && typeof tr.list_name === "string") return { ...tr, list_id: listIds.get(`${tr.type === "links" ? "domains" : "words"}:${tr.list_name}`) ?? null };
          return tr;
        });
        const checked = cleanRule({ ...raw, triggers });
        if (!checked.ok) {
          skipped += 1;
          continue;
        }
        rulePosition += 1;
        const saved = await rest("mod_rules", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, ruleset_id: made.id, ...checked.rule, position: rulePosition }) });
        if (saved?.ok) rulesMade += 1;
        else skipped += 1;
      }
    }
    return json({ ok: true, lists: listsMade, rulesets: setsMade, rules: rulesMade, skipped });
  }
  if (op === "list_save") {
    const name = String(body.name ?? "").trim().slice(0, LIMITS.listName);
    const kind = body.kind === "domains" ? "domains" : "words";
    if (!name) return fail(dt("Give the list a name."));
    const items = kind === "domains" ? cleanDomains(body.items) : cleanWords(body.items);
    const listId = rowId(body.id);
    if (listId) {
      const res2 = await rest(`mod_lists?guild_id=eq.${id}&id=eq.${listId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ name, items }) });
      return res2?.ok ? json({ ok: true }) : res2?.status === 409 ? fail(dt("A list with that name already exists.")) : failed();
    }
    const current = await rows(`mod_lists?guild_id=eq.${id}&select=id`);
    if (current && current.length >= LIMITS.lists) return fail(dt("A server can have {max} lists. Remove one first.", { max: LIMITS.lists }));
    await ensureGuildRow(apiUrl, headers, id);
    const res = await rest("mod_lists", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, name, kind, items }) });
    return res?.ok ? json({ ok: true }) : res?.status === 409 ? fail(dt("A list with that name already exists.")) : failed();
  }
  if (op === "list_delete") {
    const listId = rowId(body.id);
    if (!listId) return fail(dt("That is not a list."));
    const res = await rest(`mod_lists?guild_id=eq.${id}&id=eq.${listId}`, { method: "DELETE" });
    return res?.ok ? json({ ok: true }) : failed();
  }
  if (op === "ruleset_save") {
    const name = String(body.name ?? "").trim().slice(0, LIMITS.listName);
    if (!name) return fail(dt("Give the ruleset a name."));
    const patch = { name, enabled: body.enabled !== false, conditions: cleanConditions(body.conditions) };
    const setId = rowId(body.id);
    if (setId) {
      const res2 = await rest(`mod_rulesets?guild_id=eq.${id}&id=eq.${setId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) });
      return res2?.ok ? json({ ok: true, id: setId }) : failed();
    }
    const current = await rows(`mod_rulesets?guild_id=eq.${id}&select=id,position&order=position.desc`);
    if (current && current.length >= LIMITS.rulesets) return fail(dt("A server can have {max} rulesets. Remove one first.", { max: LIMITS.rulesets }));
    await ensureGuildRow(apiUrl, headers, id);
    const res = await rest("mod_rulesets", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ guild_id: id, ...patch, position: (Number(current?.[0]?.position) || 0) + 1 }) });
    const made = res?.ok ? (await res.json().catch(() => null))?.[0] : null;
    return made ? json({ ok: true, id: String(made.id) }) : failed();
  }
  if (op === "ruleset_delete") {
    const setId = rowId(body.id);
    if (!setId) return fail(dt("That is not a ruleset."));
    const res = await rest(`mod_rulesets?guild_id=eq.${id}&id=eq.${setId}`, { method: "DELETE" });
    return res?.ok ? json({ ok: true }) : failed();
  }
  if (op === "rule_save") {
    const setId = rowId(body.ruleset_id);
    if (!setId) return fail(dt("That is not a ruleset."));
    const checked = cleanRule(body.rule);
    if (!checked.ok) return fail(checked.error === "name" ? dt("Give the rule a name.") : checked.error === "triggers" ? dt("Add at least one valid trigger: what the rule looks for.") : dt("Add at least one valid effect: what Petto does."));
    const set = await rows(`mod_rulesets?guild_id=eq.${id}&id=eq.${setId}&select=id`);
    if (!set?.length) return fail(dt("That is not a ruleset."));
    const ruleId = rowId(body.rule?.id);
    if (ruleId) {
      const res2 = await rest(`mod_rules?guild_id=eq.${id}&id=eq.${ruleId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(checked.rule) });
      return res2?.ok ? json({ ok: true }) : failed();
    }
    const current = await rows(`mod_rules?guild_id=eq.${id}&ruleset_id=eq.${setId}&select=id,position&order=position.desc`);
    if (current && current.length >= LIMITS.rulesPerSet) return fail(dt("A ruleset can have {max} rules. Remove one first.", { max: LIMITS.rulesPerSet }));
    const res = await rest("mod_rules", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, ruleset_id: Number(setId), ...checked.rule, position: (Number(current?.[0]?.position) || 0) + 1 }) });
    return res?.ok ? json({ ok: true }) : failed();
  }
  if (op === "rule_toggle" || op === "rule_delete") {
    const ruleId = rowId(body.id);
    if (!ruleId) return fail(dt("That is not a rule."));
    const res = op === "rule_delete" ? await rest(`mod_rules?guild_id=eq.${id}&id=eq.${ruleId}`, { method: "DELETE" }) : await rest(`mod_rules?guild_id=eq.${id}&id=eq.${ruleId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ enabled: body.enabled === true }) });
    return res?.ok ? json({ ok: true }) : failed();
  }
  if (op === "move") {
    const kind = body.kind === "ruleset" ? "mod_rulesets" : "mod_rules";
    const rowIdValue = rowId(body.id);
    if (!rowIdValue) return fail(dt("That is not a rule."));
    const me = (await rows(`${kind}?guild_id=eq.${id}&id=eq.${rowIdValue}&select=id,position${kind === "mod_rules" ? ",ruleset_id" : ""}`))?.[0];
    if (!me) return fail(dt("That is not a rule."));
    const scope = kind === "mod_rules" ? `&ruleset_id=eq.${me.ruleset_id}` : "";
    const siblings = await rows(`${kind}?guild_id=eq.${id}${scope}&select=id,position&order=position.asc,id.asc`) ?? [];
    const index = siblings.findIndex((row) => String(row.id) === rowIdValue);
    const other = siblings[index + (Number(body.dir) < 0 ? -1 : 1)];
    if (index < 0 || !other) return json({ ok: true });
    const order = siblings.map((row) => String(row.id));
    [order[index], order[order.indexOf(String(other.id))]] = [String(other.id), rowIdValue];
    for (let i = 0; i < order.length; i += 1) await rest(`${kind}?guild_id=eq.${id}&id=eq.${order[i]}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ position: i + 1 }) });
    return json({ ok: true });
  }
  if (op === "clear_logs") {
    const res = await rest(`mod_rule_logs?guild_id=eq.${id}`, { method: "DELETE" });
    return res?.ok ? json({ ok: true }) : failed();
  }
  return fail(dt("Something went wrong, try again."));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
