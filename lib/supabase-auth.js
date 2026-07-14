/* ===== KARSA — verifikasi sesi Supabase untuk endpoint server ===== */

export function bearerToken(req) {
  const header = String(req?.headers?.authorization || '').trim();
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1].trim() : '';
}

export function authConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

export async function userFromRequest(req, fetchImpl = fetch) {
  const token = bearerToken(req);
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!token || !url || !anonKey) return null;

  try {
    const response = await fetchImpl(`${url}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
      },
    });
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id ? user : null;
  } catch {
    return null;
  }
}

export async function requireUser(req, res, fetchImpl = fetch) {
  if (!authConfigured()) {
    res.status(503).json({ error: 'Login belum dikonfigurasi di server.' });
    return null;
  }
  const user = await userFromRequest(req, fetchImpl);
  if (!user) {
    res.status(401).json({ error: 'Login diperlukan.' });
    return null;
  }
  return user;
}

