import type { APIRoute } from 'astro';
import { getEnv } from '../../../../utils/env';
import { notifyPremiumEvent, syncPolarSubscription, verifyPolarWebhook } from '../../../../utils/polarWebhook';
import { forgetPremiumSnapshots } from '../../../../utils/premium';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.text();
  const secret = getEnv({ locals }, 'POLAR_WEBHOOK_SECRET');
  if (!secret || !(await verifyPolarWebhook(body, request.headers, secret))) {
    return new Response('Invalid webhook signature.', { status: 403 });
  }

  try {
    const event = JSON.parse(body);
    await syncPolarSubscription({ locals }, event);
    await notifyPremiumEvent({ locals }, event);
    // A subscription changed: the Premium states kept by the dashboard are read again.
    forgetPremiumSnapshots();
    return new Response('', { status: 202 });
  } catch (error) {
    console.error('Polar Premium webhook failed', error);
    return new Response('Webhook processing failed.', { status: 500 });
  }
};
