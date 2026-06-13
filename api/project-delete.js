/* ===== KARSA — hapus proyek cloud (service role, verifikasi sesi) ===== */

import { deleteUserProject, adminConfigured } from '../lib/supabase-admin.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }

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
