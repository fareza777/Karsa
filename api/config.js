/* ===== KARSA — konfigurasi publik (publish host, DNS) ===== */

import { cnameTarget, publishHost } from '../lib/domains.js';
import { kvConfigured } from '../lib/kv.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'GET saja.' });
    return;
  }
  res.status(200).json({
    publishHost: publishHost() || null,
    cnameTarget: cnameTarget(),
    publishEnabled: kvConfigured(),
    subdomainExample: publishHost() ? 'namabisnis.' + publishHost() : null,
    freeAiDaily: Number(process.env.KARSA_FREE_AI_DAILY) || 30,
    proAvailable: !!process.env.KARSA_PRO_TOKEN,
  });
}
