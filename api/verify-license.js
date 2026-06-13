/* ===== KARSA — aktivasi license key Lemon Squeezy ===== */

import { activateLicense } from '../lib/lemon.js';
import { setProByUserId, adminConfigured } from '../lib/supabase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }

  if (!adminConfigured()) {
    res.status(503).json({ error: 'Billing belum siap di server (service role).' });
    return;
  }

  const { licenseKey, userId } = req.body || {};
  const key = String(licenseKey || '').trim();
  const uid = String(userId || '').trim();
  if (!key) {
    res.status(400).json({ error: 'License key wajib diisi.' });
    return;
  }
  if (!uid) {
    res.status(400).json({ error: 'Login dulu sebelum aktivasi license.' });
    return;
  }

  try {
    const license = await activateLicense(key, `karsa-${uid.slice(0, 8)}`);
    if (!license.valid) {
      res.status(401).json({ error: 'License tidak aktif atau sudah habis.' });
      return;
    }
    await setProByUserId(uid, true, {
      pro_source: 'lemon_license',
      lemon_license_key: key.slice(0, 8) + '…',
    });
    res.status(200).json({ ok: true, pro: true });
  } catch (err) {
    res.status(401).json({ error: err.message || 'License tidak valid.' });
    return;
  }
}
