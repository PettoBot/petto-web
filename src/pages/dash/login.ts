export const prerender = false;
import type { APIRoute } from 'astro';
import { dashAuthorizeUrl } from '../../utils/discordLogin';

/** The Login button of the site's top bar: the same Discord login as the button of the dashboard, in one step. */
export const GET: APIRoute = async ({ locals, url, redirect }) => {
  const to = dashAuthorizeUrl({ locals, url });
  return redirect(to ?? '/dash?error=server_not_configured', 302);
};
