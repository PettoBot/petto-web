function getEnv(astro, name) {
  const value = astro.locals?.runtime?.env?.[name] ?? process.env[name];
  return name === "PETTO_BOT_API_URL" ? value?.replace(/\/+$/, "") : value;
}

export { getEnv as g };
