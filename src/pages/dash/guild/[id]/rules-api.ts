export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { ensureGuildRow } from '../../../../utils/ensureGuild';
import { LIMITS, cleanConditions, cleanDomains, cleanRule, cleanWords } from '../../../../utils/modRules';
import { makeT, getDashLang } from '../../../../i18n/dash';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const SNOWFLAKE = /^\d{15,25}$/;
const ID = /^\d{1,18}$/;

/**
 * The moderation rules of a server (the Rules page): settings, lists, rulesets and rules. The page only draws them: every change comes here, is cleaned
 * (utils/modRules.ts) and saved in the tables the bot reads (mod_rule_settings, mod_lists, mod_rulesets, mod_rules). Rules are made only here, never by a command.
 */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const dt = makeT(getDashLang(astro));
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: dt('Sign in again.') }, 401);
  const body: any = await astro.request.json().catch(() => null);
  const op = String(body?.op ?? '');
  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!apiUrl || !apiKey) return json({ ok: false, message: dt('The dashboard is not connected to the bot.') }, 500);
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  const rest = (path: string, init: RequestInit = {}) => fetch(`${apiUrl}/rest/v1/${path}`, { ...init, headers: { ...headers, ...(init.headers as Record<string, string> | undefined) } }).catch(() => null);
  const rows = async (path: string): Promise<any[] | null> => { const res = await rest(path); return res?.ok ? ((await res.json().catch(() => null)) as any[] | null) : null; };
  const fail = (message: string, status = 400) => json({ ok: false, message }, status);
  const failed = () => fail(dt('Something went wrong, try again.'), 502);
  const rowId = (value: unknown) => (ID.test(String(value ?? '')) ? String(value) : null);

  if (op === 'settings') {
    const channel = SNOWFLAKE.test(String(body.log_channel_id ?? '')) ? String(body.log_channel_id) : null;
    await ensureGuildRow(apiUrl, headers, id);
    const res = await rest('mod_rule_settings?on_conflict=guild_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ guild_id: id, enabled: body.enabled !== false, ignore_staff: body.ignore_staff !== false, log_channel_id: channel, updated_at: new Date().toISOString() }) });
    return res?.ok ? json({ ok: true }) : failed();
  }

  if (op === 'list_save') {
    const name = String(body.name ?? '').trim().slice(0, LIMITS.listName);
    const kind = body.kind === 'domains' ? 'domains' : 'words';
    if (!name) return fail(dt('Give the list a name.'));
    const items = kind === 'domains' ? cleanDomains(body.items) : cleanWords(body.items);
    const listId = rowId(body.id);
    if (listId) {
      const res = await rest(`mod_lists?guild_id=eq.${id}&id=eq.${listId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ name, items }) });
      return res?.ok ? json({ ok: true }) : res?.status === 409 ? fail(dt('A list with that name already exists.')) : failed();
    }
    const current = await rows(`mod_lists?guild_id=eq.${id}&select=id`);
    if (current && current.length >= LIMITS.lists) return fail(dt('A server can have {max} lists. Remove one first.', { max: LIMITS.lists }));
    await ensureGuildRow(apiUrl, headers, id);
    const res = await rest('mod_lists', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ guild_id: id, name, kind, items }) });
    return res?.ok ? json({ ok: true }) : res?.status === 409 ? fail(dt('A list with that name already exists.')) : failed();
  }
  if (op === 'list_delete') {
    const listId = rowId(body.id);
    if (!listId) return fail(dt('That is not a list.'));
    const res = await rest(`mod_lists?guild_id=eq.${id}&id=eq.${listId}`, { method: 'DELETE' });
    return res?.ok ? json({ ok: true }) : failed();
  }

  if (op === 'ruleset_save') {
    const name = String(body.name ?? '').trim().slice(0, LIMITS.listName);
    if (!name) return fail(dt('Give the ruleset a name.'));
    const patch = { name, enabled: body.enabled !== false, conditions: cleanConditions(body.conditions) };
    const setId = rowId(body.id);
    if (setId) {
      const res = await rest(`mod_rulesets?guild_id=eq.${id}&id=eq.${setId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(patch) });
      return res?.ok ? json({ ok: true, id: setId }) : failed();
    }
    const current = await rows(`mod_rulesets?guild_id=eq.${id}&select=id,position&order=position.desc`);
    if (current && current.length >= LIMITS.rulesets) return fail(dt('A server can have {max} rulesets. Remove one first.', { max: LIMITS.rulesets }));
    await ensureGuildRow(apiUrl, headers, id);
    const res = await rest('mod_rulesets', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ guild_id: id, ...patch, position: (Number(current?.[0]?.position) || 0) + 1 }) });
    const made: any = res?.ok ? ((await res.json().catch(() => null)) as any[] | null)?.[0] : null;
    return made ? json({ ok: true, id: String(made.id) }) : failed();
  }
  if (op === 'ruleset_delete') {
    const setId = rowId(body.id);
    if (!setId) return fail(dt('That is not a ruleset.'));
    const res = await rest(`mod_rulesets?guild_id=eq.${id}&id=eq.${setId}`, { method: 'DELETE' });
    return res?.ok ? json({ ok: true }) : failed();
  }

  if (op === 'rule_save') {
    const setId = rowId(body.ruleset_id);
    if (!setId) return fail(dt('That is not a ruleset.'));
    const checked = cleanRule(body.rule);
    if (!checked.ok) return fail(checked.error === 'name' ? dt('Give the rule a name.') : checked.error === 'triggers' ? dt('Add at least one valid trigger: what the rule looks for.') : dt('Add at least one valid effect: what Petto does.'));
    const set = await rows(`mod_rulesets?guild_id=eq.${id}&id=eq.${setId}&select=id`);
    if (!set?.length) return fail(dt('That is not a ruleset.'));
    const ruleId = rowId(body.rule?.id);
    if (ruleId) {
      const res = await rest(`mod_rules?guild_id=eq.${id}&id=eq.${ruleId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(checked.rule) });
      return res?.ok ? json({ ok: true }) : failed();
    }
    const current = await rows(`mod_rules?guild_id=eq.${id}&ruleset_id=eq.${setId}&select=id,position&order=position.desc`);
    if (current && current.length >= LIMITS.rulesPerSet) return fail(dt('A ruleset can have {max} rules. Remove one first.', { max: LIMITS.rulesPerSet }));
    const res = await rest('mod_rules', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ guild_id: id, ruleset_id: Number(setId), ...checked.rule, position: (Number(current?.[0]?.position) || 0) + 1 }) });
    return res?.ok ? json({ ok: true }) : failed();
  }
  if (op === 'rule_toggle' || op === 'rule_delete') {
    const ruleId = rowId(body.id);
    if (!ruleId) return fail(dt('That is not a rule.'));
    const res = op === 'rule_delete'
      ? await rest(`mod_rules?guild_id=eq.${id}&id=eq.${ruleId}`, { method: 'DELETE' })
      : await rest(`mod_rules?guild_id=eq.${id}&id=eq.${ruleId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ enabled: body.enabled === true }) });
    return res?.ok ? json({ ok: true }) : failed();
  }
  if (op === 'move') {
    // Swaps the place of a rule (inside its ruleset) or of a ruleset with the one before or after it.
    const kind = body.kind === 'ruleset' ? 'mod_rulesets' : 'mod_rules';
    const rowIdValue = rowId(body.id);
    if (!rowIdValue) return fail(dt('That is not a rule.'));
    const me = (await rows(`${kind}?guild_id=eq.${id}&id=eq.${rowIdValue}&select=id,position${kind === 'mod_rules' ? ',ruleset_id' : ''}`))?.[0];
    if (!me) return fail(dt('That is not a rule.'));
    const scope = kind === 'mod_rules' ? `&ruleset_id=eq.${me.ruleset_id}` : '';
    const siblings = (await rows(`${kind}?guild_id=eq.${id}${scope}&select=id,position&order=position.asc,id.asc`)) ?? [];
    const index = siblings.findIndex((row) => String(row.id) === rowIdValue);
    const other = siblings[index + (Number(body.dir) < 0 ? -1 : 1)];
    if (index < 0 || !other) return json({ ok: true });
    // Positions are renumbered so that two rows that were equal still end up in a clear order.
    const order = siblings.map((row) => String(row.id));
    [order[index], order[order.indexOf(String(other.id))]] = [String(other.id), rowIdValue];
    for (let i = 0; i < order.length; i += 1) await rest(`${kind}?guild_id=eq.${id}&id=eq.${order[i]}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ position: i + 1 }) });
    return json({ ok: true });
  }
  if (op === 'clear_logs') {
    const res = await rest(`mod_rule_logs?guild_id=eq.${id}`, { method: 'DELETE' });
    return res?.ok ? json({ ok: true }) : failed();
  }
  return fail(dt('Something went wrong, try again.'));
};
