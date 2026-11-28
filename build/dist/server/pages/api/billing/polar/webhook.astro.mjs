import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { v as verifyPolarWebhook, s as syncPolarSubscription, c as creditCoinPack, r as refundCoinPack, n as notifyPremiumEvent } from '../../../../chunks/polarWebhook_B_r2jyuY.mjs';
import { f as forgetPremiumSnapshots } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  const body = await request.text();
  const secret = getEnv({ locals }, "POLAR_WEBHOOK_SECRET");
  if (!secret || !await verifyPolarWebhook(body, request.headers, secret)) {
    return new Response("Invalid webhook signature.", { status: 403 });
  }
  try {
    const event = JSON.parse(body);
    await syncPolarSubscription({ locals }, event);
    await creditCoinPack({ locals }, event);
    await refundCoinPack({ locals }, event);
    await notifyPremiumEvent({ locals }, event);
    forgetPremiumSnapshots();
    return new Response("", { status: 202 });
  } catch (error) {
    console.error("Polar Premium webhook failed", error);
    return new Response("Webhook processing failed.", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
