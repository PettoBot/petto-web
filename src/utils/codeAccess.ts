import { getEnv } from './env';

/**
 * Commands written in code are open to every server: anyone who manages it sees the editor. CODE_COMMANDS_DISABLED=true closes it
 * (the bot has the same switch and also checks it when something is saved).
 */
export function canUseCodeCommands(astro: any, _userId?: string | undefined): boolean {
  return getEnv(astro, 'CODE_COMMANDS_DISABLED') !== 'true';
}
