import { g as getEnv } from './env_WnBvzCjc.mjs';

function canUseCodeCommands(astro, _userId) {
  return getEnv(astro, "CODE_COMMANDS_DISABLED") !== "true";
}

export { canUseCodeCommands as c };
