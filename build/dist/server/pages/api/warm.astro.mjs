import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { g as getCachedBotGuildIds, a as getBotGuildList } from '../../chunks/discordCache_CnRINZ-g.mjs';
import { w as warmBotProfile } from '../../chunks/discord_CxeBz2tv.mjs';
import { g as getServiceStatus } from '../../chunks/serviceStatus_CQG8Q7f5.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
let lastWarm = 0;
const GET = async ({ locals }) => {
  if (Date.now() - lastWarm > 2e4) {
    lastWarm = Date.now();
    const botToken = getEnv({ locals }, "DISCORD_TOKEN");
    await Promise.allSettled([
      botToken ? getCachedBotGuildIds(botToken) : Promise.resolve(null),
      botToken ? getBotGuildList(botToken) : Promise.resolve(null),
      botToken ? warmBotProfile(botToken) : Promise.resolve(null),
      getServiceStatus({ locals })
    ]);
  }
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
