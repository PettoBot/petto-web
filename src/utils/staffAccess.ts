// Who sees the Staff group in the account menu. It only decides what the menu shows: every staff page still runs its own check
// (isPettoOwner for the owner pages, canEditPartners for the partners, credits and appeal names) and refuses everybody else.
import { canEditPartners } from './partners';
import { isPettoOwner } from './premiumAdmin';

export interface StaffAccess { owner: boolean; team: boolean }

// The team list rarely changes: a short memory per person keeps the menu from asking the database on every account page.
const memory = new Map<string, { at: number; team: boolean }>();
const KEEP_MS = 60_000;

export async function staffAccess(astro: any, userId: string): Promise<StaffAccess> {
  const owner = isPettoOwner(astro, userId);
  if (owner) return { owner, team: true };
  const known = memory.get(userId);
  if (known && Date.now() - known.at < KEEP_MS) return { owner, team: known.team };
  const team = await canEditPartners(astro, userId).catch(() => false);
  if (memory.size > 500) memory.clear();
  memory.set(userId, { at: Date.now(), team });
  return { owner, team };
}
