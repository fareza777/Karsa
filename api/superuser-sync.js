/* ===== KARSA — akun: superuser sync + hapus proyek cloud ===== */

import { isSuperuserEmail } from '../lib/superuser.js';
import { setProByEmail, adminConfigured, deleteUserProject } from '../lib/supabase-admin.js';
import { requireUser } from '../lib/supabase-auth.js';

async function handleProjectDelete(req, res, user) {
  if (!adminConfigured()) {
    res.status(503).json({ error: 'Hapus cloud belum dikonfigurasi di server.' });
    return;
  }

  const { projectId } = req.body || {};
  const pid = String(projectId || '').trim();
  if (!pid) {
    res.status(400).json({ error: 'projectId wajib.' });
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

  const user = await requireUser(req, res);
  if (!user) return;

  if (req.body?.action === 'delete-project') {
    return handleProjectDelete(req, res, user);
  }

  const email = String(user.email || '').trim().toLowerCase();
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
