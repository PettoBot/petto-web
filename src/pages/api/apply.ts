import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { getEnv } from '../../utils/env';
import { applicationRoles, isApplicationRole, readAnswers, sendApplication, tooManyAttempts } from '../../utils/applications';
import { applicationCopy } from '../../data/applicationCopy';
import { localePath, type Locale } from '../../i18n/ui';

export const prerender = false;

function localeFrom(value: FormDataEntryValue | null): Locale {
  return value === 'es' || value === 'pt-BR' ? value : 'en';
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}

export const POST: APIRoute = async (context) => {
  const { request, url, redirect } = context;
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return new Response('Forbidden', { status: 403 });

  // The page sends the form with fetch and reads JSON. Without JavaScript it is a plain form post and gets redirected.
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const form = await request.formData();
  const lang = localeFrom(form.get('lang'));
  const role = form.get('role');
  const back = (query: string) => redirect(`${localePath[lang]}/apply?${query}`, 303);
  const fail = (code: 'invalid' | 'unavailable' | 'rate' | 'failed', status: number, errors?: Record<string, string>) =>
    wantsJson ? json({ ok: false, error: code, errors }, status) : back(`${isApplicationRole(role) ? `role=${role}&` : ''}error=${code}`);

  if (!isApplicationRole(role)) return fail('invalid', 400);
  // Hidden field that real visitors never fill in, only automated form fillers do.
  if (String(form.get('website') ?? '') !== '') return wantsJson ? json({ ok: true }) : back(`role=${role}&sent=1`);

  const webhookUrl = getEnv(context, 'PETTO_FORMS_WEBHOOK_URL');
  if (!webhookUrl) return fail('unavailable', 503);

  const parsed = readAnswers(role, form);
  if ('errors' in parsed) return fail('invalid', 422, parsed.errors);

  const visitor = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  if (tooManyAttempts(visitor)) return fail('rate', 429);

  const session = await getDashboardSession(context);
  const copy = applicationCopy.en;
  const selectKeys = new Set(applicationRoles[role].fields.filter((f) => f.kind === 'select').map((f) => f.key));
  const answers = Object.fromEntries(Object.entries(parsed.answers).map(([key, value]) => [key, selectKeys.has(key) ? copy.options[value] ?? value : value]));
  const sent = await sendApplication(webhookUrl, role, answers, {
    verifiedId: session?.userId ?? null,
    username: session?.username ?? null,
    labels: Object.fromEntries(Object.entries(copy.fields[role]).map(([key, value]) => [key, value.label])),
    title: `${copy.roles[role].title} application`,
    verifiedLabel: 'Logged in with Discord as',
    unverifiedLabel: 'Not logged in. The Discord user below was typed by the applicant and is not verified.',
  });

  if (!sent) return fail('failed', 502);
  return wantsJson ? json({ ok: true }) : back(`role=${role}&sent=1`);
};
