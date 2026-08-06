import type { APIRoute } from 'astro';
import { getEnv } from '../../../../utils/env';
import { syncPolarSubscription, verifyPolarWebhook } from '../../../../utils/polarWebhook';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.text();
  const secret = getEnv({ locals }, 'POLAR_WEBHOOK_SECRET');
  if (!secret || !(await verifyPolarWebhook(body, request.headers, secret))) {
    return new Response('Invalid webhook signature.', { status: 403 });
  }

  try {
    await syncPolarSubscription({ locals }, JSON.parse(body));
    return new Response('', { status: 202 });
  } catch (error) {
    console.error('Polar Premium webhook failed', error);
    return new Response('Webhook processing failed.', { status: 500 });
  }
};
