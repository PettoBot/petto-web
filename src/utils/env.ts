type RuntimeLocals = { runtime?: { env?: Record<string, string | undefined> } };

/**
 * Cloudflare Workers never populate process.env from dashboard-configured
 * variables, they arrive through Astro.locals.runtime.env instead. process.env
 * still works locally (dotenv) and at build time, so both are checked.
 */
export function getEnv(astro: { locals?: RuntimeLocals }, name: string): string | undefined {
  const value = astro.locals?.runtime?.env?.[name] ?? process.env[name];
  return name === 'PETTO_BOT_API_URL' ? value?.replace(/\/+$/, '') : value;
}
