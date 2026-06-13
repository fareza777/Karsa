/* ===== KARSA — event analitik dari klien (login, signup) ===== */

import { trackLogin, trackSignup } from '../lib/analytics.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }
  const { event, userId } = req.body || {};
  if (!event || !['login', 'signup'].includes(event)) {
    res.status(400).json({ error: 'Event tidak valid.' });
    return;
  }
  try {
    if (event === 'login') await trackLogin(userId);
    else await trackSignup(userId);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Gagal mencatat event.' });
  }
}
