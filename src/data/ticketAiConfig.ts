// Settings of the AI assistant of the tickets (beta) that Liam may tune: the Groq model, time limits and rate limits.
// The size caps of the texts live in src/utils/ticketAiPrompt.mjs (LIMITS) because scripts/check-ticket-ai.mjs tests them with node alone.

export const TICKET_AI_CONFIG = {
  groqBase: 'https://api.groq.com/openai/v1',
  /**
   * Used in this order when GROQ_MODEL is not set: the first one Groq lists in GET /models (checked at run time, the list is kept for
   * `modelsCacheMs`). When the list cannot be read, the first one here is used. Fast models first.
   */
  modelPreference: ['openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile'],
  modelsCacheMs: 6 * 60 * 60 * 1000,
  /** After a failed GET /models, the fallback is used for this long before asking again. */
  modelsRetryMs: 10 * 60 * 1000,
  /** One chat request to Groq gives up after this. */
  timeoutMs: 20_000,
  modelsTimeoutMs: 4_000,
  /** Requests to the test chat and the setup helper, together, per server. */
  rateLimitPerServer: 20,
  /** And per person, across servers. */
  rateLimitPerUser: 30,
  rateWindowMs: 60 * 60 * 1000,
  /** Tokens the model may write (reasoning models count their thinking here too). */
  maxTokensTest: 700,
  maxTokensHelper: 2000,
  temperature: 0.3,
} as const;
