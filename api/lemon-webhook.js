/* ===== KARSA — webhook Lemon Squeezy (aktivasi Pro) ===== */

import {
  verifyWebhookSignature, parseWebhookPayload, eventName,
  customerEmail, customUserId, subscriptionIsActive,
} from '../lib/lemon.js';
import { setProByEmail, setProByUserId, adminConfigured } from '../lib/supabase-admin.js';

export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const SUB_EVENTS = new Set([
  'subscription_created', 'subscription_updated', 'subscription_cancelled',
  'subscription_resumed', 'subscription_expired', 'subscription_payment_success',
  'subscription_payment_failed', 'subscription_payment_recovered',
]);

const ORDER_EVENTS = new Set(['order_created']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    res.status(503).json({ error: 'LEMON_SQUEEZY_WEBHOOK_SECRET belum dikonfigurasi.' });
    return;
  }
  if (!adminConfigured()) {
    res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.' });
    return;
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (e) {
    rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  }

  const signature = req.headers['x-signature'] || req.headers['X-Signature'] || '';
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    res.status(401).json({ error: 'Signature tidak valid.' });
    return;
  }

  let payload;
  try {
    payload = parseWebhookPayload(rawBody);
  } catch (e) {
    res.status(400).json({ error: 'Payload tidak valid.' });
    return;
  }

  const ev = eventName(payload);
  const email = customerEmail(payload);
  const userId = customUserId(payload);

  try {
    if (SUB_EVENTS.has(ev)) {
      const active = subscriptionIsActive(payload);
      const subId = String(payload?.data?.id || '');
      const extra = {
        lemon_subscription_id: subId || null,
        pro_source: 'lemon_subscription',
      };
      let result;
      if (userId) result = await setProByUserId(userId, active, extra);
      else if (email) result = await setProByEmail(email, active, extra);
      else {
        res.status(422).json({ error: 'Email pelanggan tidak ditemukan di webhook.' });
        return;
      }
      res.status(200).json({ ok: true, event: ev, active, ...result });
      return;
    }

    if (ORDER_EVENTS.has(ev)) {
      const refunded = !!payload?.data?.attributes?.refunded;
      const status = String(payload?.data?.attributes?.status || '').toLowerCase();
      const paid = !refunded && (status === 'paid' || status === 'completed');
      if (paid && (email || userId)) {
        const extra = { pro_source: 'lemon_order', lemon_order_id: String(payload?.data?.id || '') };
        const result = userId
          ? await setProByUserId(userId, true, extra)
          : await setProByEmail(email, true, extra);
        res.status(200).json({ ok: true, event: ev, active: true, ...result });
        return;
      }
    }

    res.status(200).json({ ok: true, event: ev, ignored: true });
  } catch (err) {
    console.error('lemon-webhook:', err);
    res.status(500).json({ error: err.message || 'Webhook gagal.' });
  }
}
