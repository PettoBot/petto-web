export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoMemberSearch } from '../../../../utils/pettoBotApi';
import { memberAvatarUrl } from '../../../../utils/memberNames';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The "pick a person" boxes of the dashboard: members of the server whose name starts with what was typed. */
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ members: [] }, 401);
  const query = String(new URL(astro.request.url).searchParams.get('q') ?? '').slice(0, 32);
  const found = await callPettoMemberSearch(astro, id, String(auth.session.userId), query);
  return json({ members: found.map((member) => ({ id: member.id, username: member.username, displayName: member.displayName, avatar: memberAvatarUrl(member.id, member as any, 32) })) });
};
