// The routes that also have a Spanish page ('/', '/commands', '/form/[id]'...), as patterns of an address without its language.
// The list is read from src/pages/es when the site is built (astro.config.mjs). Importing the pages instead (import.meta.glob) would
// tie every one of them, and the scripts of their components, to every page that uses Base.astro.
export const LOCALIZED_ROUTES: RegExp[] = __ES_ROUTES__.map((route) => new RegExp(`^${route.replace(/\[\.\.\.[^\]]+\]/g, '.+').replace(/\[[^\]]+\]/g, '[^/]+')}$`));
