/* ===== KARSA — akun: superuser sync + hapus proyek cloud ===== */

import { isSuperuserEmail } from '../lib/superuser.js';
import { setProByEmail, adminConfigured, deleteUserProject } from '../lib/supabase-admin.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function userFromAccessToken(accessToken) {
  if (!SUPABASE_URL || !ANON_KEY || !accessToken) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: ANON_KEY,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function handleProjectDelete(req, res) {
  if (!adminConfigured()) {
    res.status(503).json({ error: 'Hapus cloud belum dikonfigurasi di server.' });
    return;
  }

  const { projectId, accessToken } = req.body || {};
  const pid = String(projectId || '').trim();
  if (!pid) {
    res.status(400).json({ error: 'projectId wajib.' });
    return;
  }

  const user = await userFromAccessToken(String(accessToken || '').trim());
  if (!user?.id) {
    res.status(401).json({ error: 'Sesi tidak valid. Login ulang lalu coba lagi.' });
    return;
  }

  try {
    await deleteUserProject(user.id, pid);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Gagal menghapus proyek di cloud.' });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }

  if (req.body?.action === 'delete-project') {
    return handleProjectDelete(req, res);
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
