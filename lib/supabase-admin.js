/* ===== KARSA — Supabase admin (service role, server-only) ===== */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function adminHeaders() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server.');
  }
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };
}

async function findUserIdByEmail(email) {
  const url = `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`;
  const res = await fetch(url, { headers: adminHeaders() });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || body.error || 'Gagal mencari user.');
  const users = body.users || [];
  return users[0]?.id || null;
}

export async function setProByEmail(email, isPro, extra = {}) {
  const userId = await findUserIdByEmail(email);
  if (!userId) {
    return { ok: false, reason: 'user_not_found', email };
  }
  return setProByUserId(userId, isPro, extra);
}

export async function setProByUserId(userId, isPro, extra = {}) {
  const row = {
    id: userId,
    is_pro: !!isPro,
    updated_at: new Date().toISOString(),
    ...extra,
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      ...adminHeaders(),
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(row),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || body.error || 'Gagal update profil.');
  return { ok: true, userId, profile: Array.isArray(body) ? body[0] : body };
}

export function adminConfigured() {
  return !!(SUPABASE_URL && SERVICE_KEY);
}
