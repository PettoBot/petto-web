/**
 * Why a page of the staff area has nothing to show, from the answer of the bot: it did not answer (`down`), it answered that this account is not the owner
 * (`forbidden`: the owner id the bot has is not the account that is logged in), it refused the key of the website (`key`), or it answered with something it does not know (`old`: a bot that was not
 * restarted with the latest code). Each one is said with its own words, so the owner is not left with a "Petto did not answer" that is not true.
 */
export type StaffProblem = 'down' | 'forbidden' | 'key' | 'old';

export function staffProblem(call: { ok: boolean; data: any; down: boolean }): StaffProblem | null {
  if (call.ok) return null;
  if (call.down) return 'down';
  if (call.data && typeof call.data === 'object' && call.data.error === 'forbidden') return 'forbidden';
  // The bot refused the key of the website: PETTO_BOT_API_SECRET of the website is not the one the bot has.
  if (call.data && typeof call.data === 'object' && call.data.error === 'unauthorized') return 'key';
  return 'old';
}
