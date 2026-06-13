/* ===== KARSA — konfigurasi publik (publish host, DNS) ===== */

import { cnameTarget, publishHost } from '../lib/domains.js';
import { kvConfigured } from '../lib/kv.js';
import { billingConfigured } from '../lib/lemon.js';

function lemonCheckoutBase() {
  const direct = process.env.LEMON_SQUEEZY_CHECKOUT_URL;
  if (direct) return direct.replace(/\/$/, '');
  const variant = process.env.LEMON_SQUEEZY_VARIANT_ID;
  const store = process.env.LEMON_SQUEEZY_STORE_SLUG || 'promptlab';
  if (!variant) return null;
  return `https://${store}.lemonsqueezy.com/checkout/buy/${variant}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'GET saja.' });
    return;
  }
  const supabaseUrl = process.env.SUPABASE_URL || null;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || null;
  const ph = publishHost();
  const checkoutBase = lemonCheckoutBase();
  const billingEnabled = billingConfigured();

  res.status(200).json({
    appUrl: ph ? 'https://' + ph : null,
    publishHost: ph || null,
    cnameTarget: cnameTarget(),
    publishEnabled: kvConfigured(),
    subdomainExample: publishHost() ? 'namabisnis.' + publishHost() : null,
    freeAiDaily: Number(process.env.KARSA_FREE_AI_DAILY) || 30,
    proAvailable: !!(process.env.KARSA_PRO_TOKEN || billingEnabled),
    billingEnabled,
    lemonCheckoutBase: checkoutBase,
    supabaseUrl,
    supabaseAnonKey,
    authEnabled: !!(supabaseUrl && supabaseAnonKey),
  });
}
