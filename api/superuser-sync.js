/* ===== KARSA — sinkron status superuser (Pro + tanpa limit) ===== */

import { isSuperuserEmail } from '../lib/superuser.js';
import { setProByEmail, adminConfigured } from '../lib/supabase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email) {
    res.status(400).json({ error: 'Email wajib.' });
    return;
  }

  if (!isSuperuserEmail(email)) {
    res.status(200).json({ superuser: false, pro: false });
    return;
  }

  let cloud = false;
  if (adminConfigured()) {
    try {
      const result = await setProByEmail(email, true, {
        pro_source: 'superuser',
      });
      cloud = !!result.ok;
    } catch (err) {
      console.warn('superuser-sync:', err.message || err);
    }
  }

  res.status(200).json({
    superuser: true,
    pro: true,
    cloud,
    message: cloud
      ? 'Superuser aktif (cloud).'
      : 'Superuser aktif (lokal). Tambahkan SUPABASE_SERVICE_ROLE_KEY untuk sinkron cloud.',
  });
}
