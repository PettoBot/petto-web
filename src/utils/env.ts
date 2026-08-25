type RuntimeLocals = { runtime?: { env?: Record<string, string | undefined> } };

export function getEnv(astro: { locals?: RuntimeLocals }, name: string): string | undefined {
  return astro.locals?.runtime?.env?.[name] ?? process.env[name];
}
