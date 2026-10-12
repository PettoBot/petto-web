/**
 * An aggregate read straight from the database (Node build with PETTO_DATABASE_URL, see directDb.ts), or null when this build
 * or host cannot do it; the caller then reads the rows through the bot API. The Worker build leaves the database code out.
 */
type DirectQuery = <T = Record<string, unknown>>(text: string, values: unknown[]) => Promise<T[] | null>;

export const directQuery: DirectQuery | null = __DIRECT_DB__
  ? async (text, values) => (await import('./directDb')).queryDirect(text, values)
  : null;
