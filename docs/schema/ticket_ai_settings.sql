-- AI assistant of the tickets (beta). Read and written by the dashboard (Tickets → AI assistant) through the bot's REST API with the
-- service key; the bot reads ticket_ai_settings to answer in tickets and adds 1 to ticket_ai_usage for every AI reply it sends.
-- Until these tables exist the dashboard page works with defaults, says the database update is pending, and Save is off.

create table if not exists public.ticket_ai_settings (
  guild_id      text primary key,
  enabled       boolean     not null default false,
  -- ticket_categories.id values (as text) where the assistant answers; empty = every ticket type
  category_ids  text[]      not null default '{}',
  -- the owner's texts; inner line breaks are kept as written (only the ends are trimmed)
  instructions  text        not null default '',
  knowledge     text        not null default '',
  -- one keyword or situation per line (commas and semicolons also separate keywords)
  handoff       text        not null default '',
  -- how the answers should look (length, format, wording, examples); at most 2500 characters, checked by the bot and the dashboard
  reply_style   text        not null default '',
  -- links of Discord messages of this server (its rules, for example) that the bot reads live and gives to the assistant; at most 10
  message_links text[]      not null default '{}',
  -- the assistant knows the channels the ticket user can see (names and topics) and can point to them
  channel_guide boolean     not null default true,
  tone          text        not null default 'friendly' check (tone in ('friendly', 'neutral', 'formal')),
  max_replies   integer     not null default 3 check (max_replies between 1 and 10),
  -- 'auto' = the ticket user's language, or a fixed one
  language_mode text        not null default 'auto' check (language_mode in ('auto', 'en', 'es', 'pt-BR', 'fr', 'de', 'it')),
  updated_at    timestamptz not null default now(),
  -- Discord user id of who saved last
  updated_by    text,
  constraint ticket_ai_settings_sizes check (char_length(instructions) <= 6000 and char_length(knowledge) <= 8000 and char_length(handoff) <= 1000)
);

-- Servers that already have the table get the column too.
alter table public.ticket_ai_settings add column if not exists reply_style text not null default '';
alter table public.ticket_ai_settings add column if not exists message_links text[] not null default '{}';
alter table public.ticket_ai_settings add column if not exists channel_guide boolean not null default true;

alter table public.ticket_ai_settings enable row level security;
-- No policy on purpose: only the service key (dashboard and bot) reads or writes it.

create table if not exists public.ticket_ai_usage (
  guild_id text    not null,
  -- 'YYYY-MM', in UTC
  month    text    not null check (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  replies  integer not null default 0 check (replies >= 0),
  primary key (guild_id, month)
);

alter table public.ticket_ai_usage enable row level security;
-- No policy on purpose.

-- For the bot: count one AI reply atomically (call through REST: POST /rest/v1/rpc/ticket_ai_count_reply {"p_guild_id": "..."}).
create or replace function public.ticket_ai_count_reply(p_guild_id text)
returns integer
language sql
security invoker
as $$
  insert into public.ticket_ai_usage (guild_id, month, replies)
  values (p_guild_id, to_char(now() at time zone 'utc', 'YYYY-MM'), 1)
  on conflict (guild_id, month) do update set replies = public.ticket_ai_usage.replies + 1
  returning replies;
$$;
-- security invoker: it runs with the caller's rights, so RLS (no policy) still keeps every key but the service key out.
