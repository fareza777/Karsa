/* ===== KARSA — Lemon Squeezy helpers ===== */

import crypto from 'node:crypto';

const ACTIVE_SUB_STATUSES = new Set(['active', 'on_trial', 'paused']);

export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!secret || !signature) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const sig = Buffer.from(signature, 'utf8');
  if (digest.length !== sig.length) return false;
  return crypto.timingSafeEqual(digest, sig);
}

export function parseWebhookPayload(rawBody) {
  return JSON.parse(rawBody);
}

export function eventName(payload) {
  return payload?.meta?.event_name || '';
}

export function customerEmail(payload) {
  const attrs = payload?.data?.attributes || {};
  return (
    attrs.user_email
    || attrs.customer_email
    || attrs.email
    || payload?.meta?.custom_data?.email
    || ''
  ).trim().toLowerCase();
}

export function customUserId(payload) {
  const custom = payload?.meta?.custom_data || {};
  return custom.user_id || custom.userId || null;
}

export function subscriptionStatus(payload) {
  return String(payload?.data?.attributes?.status || '').toLowerCase();
}

export function subscriptionIsActive(payload) {
  const name = eventName(payload);
  const status = subscriptionStatus(payload);
  if (name === 'subscription_cancelled' || name === 'subscription_expired') return false;
  if (name === 'subscription_payment_failed') return false;
  if (status) return ACTIVE_SUB_STATUSES.has(status);
  if (name === 'subscription_created' || name === 'subscription_updated') return true;
  if (name === 'subscription_payment_success' || name === 'subscription_resumed') return true;
  return false;
}

export function buildCheckoutUrl(base, { email, userId, name } = {}) {
  if (!base) return null;
  const url = new URL(base);
  if (email) url.searchParams.set('checkout[email]', email);
  if (name) url.searchParams.set('checkout[name]', name);
  if (userId) url.searchParams.set('checkout[custom][user_id]', userId);
  url.searchParams.set('checkout[custom][product]', 'karsa-pro');
  return url.toString();
}

export async function activateLicense(licenseKey, instanceName) {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  if (!apiKey) throw new Error('LEMON_SQUEEZY_API_KEY belum dikonfigurasi.');
  const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      license_key: licenseKey,
      instance_name: instanceName || 'karsa-web',
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = body?.errors?.[0]?.detail || body?.error || 'License tidak valid.';
    throw new Error(err);
  }
  if (body.error) throw new Error(body.error);
  const key = body.license_key || body.meta?.license_key;
  const status = key?.status || key?.attributes?.status;
  return {
    valid: body.activated !== false && status !== 'inactive' && status !== 'disabled',
    meta: key,
  };
}

export function billingConfigured() {
  return !!(process.env.LEMON_SQUEEZY_CHECKOUT_URL || process.env.LEMON_SQUEEZY_VARIANT_ID);
}
