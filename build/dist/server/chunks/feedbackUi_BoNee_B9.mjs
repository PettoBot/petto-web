import { a as createComponent, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                        */
import { p as prefixFor } from './dashPrefix_eB5wKYeM.mjs';

const $$FeedbackStyles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "/home/runner/work/petto-web/petto-web/src/components/feedback/FeedbackStyles.astro", void 0);

const feedbackBase = (lang) => `${prefixFor(lang)}/feedback`;
const KIND_ICON = { idea: "ph:lightbulb-fill", feedback: "ph:chat-circle-dots-fill", bug: "ph:bug-fill" };
const KIND_LABEL = { idea: "Idea", feedback: "Feedback", bug: "Bug" };
const STATUS_LABEL = { open: "Open", planned: "Planned", in_progress: "In progress", done: "Done", declined: "Declined" };
const TAG_LABEL = { commands: "Commands", moderation: "Moderation", logging: "Logging", dashboard: "Dashboard", website: "Website", quests: "Quests", embeds: "Embeds", premium: "Premium", other: "Other" };
function ago(date, lang) {
  const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1e3);
  const formatter = new Intl.RelativeTimeFormat(lang === "pt-BR" ? "pt-BR" : lang, { numeric: "auto" });
  const steps = [["year", 31536e3], ["month", 2592e3], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, size] of steps) if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  return formatter.format(0, "second");
}
const score = (post) => post.votes_up - post.votes_down;
const avatarOf = (id, avatar) => avatar ?? `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`;

export { $$FeedbackStyles as $, KIND_ICON as K, STATUS_LABEL as S, TAG_LABEL as T, KIND_LABEL as a, avatarOf as b, ago as c, feedbackBase as f, score as s };
