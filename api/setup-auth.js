/* ===== KARSA — setup sekali: URL auth Supabase + Google OAuth ===== */

import { publishHost } from '../lib/domains.js';
import { setupSupabaseAuth } from '../lib/supabase-mgmt.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }

  const secret = process.env.KARSA_PRO_TOKEN;
  if (!secret) {
    res.status(503).json({ error: 'KARSA_PRO_TOKEN belum dikonfigurasi.' });
    return;
  }

  const authHeader = String(req.headers.authorization || '');
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const bodyToken = String((req.body && req.body.token) || '').trim();
  const token = bearer || bodyToken;
  if (!token || token !== secret) {
    res.status(401).json({ error: 'Token setup tidak valid.' });
    return;
  }

  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  if (!accessToken) {
    res.status(503).json({
      error: 'SUPABASE_ACCESS_TOKEN belum ada di Vercel.',
      hint: 'Buat Personal Access Token di https://supabase.com/dashboard/account/tokens lalu tambahkan ke env production.',
    });
    return;
  }

  const ph = publishHost();
  const appUrl = ph ? `https://${ph}` : 'https://karsa.work';
  const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID || '';
  const googleSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || '';

  try {
    const result = await setupSupabaseAuth({
      accessToken,
      appUrl,
      googleClientId,
      googleSecret,
    });
    res.status(200).json({
      ...result,
      google_configured: !!(googleClientId && googleSecret),
      message: googleClientId && googleSecret
        ? 'Auth Supabase + Google OAuth dikonfigurasi.'
        : 'Auth Supabase dikonfigurasi. Tambahkan GOOGLE_OAUTH_CLIENT_ID/SECRET lalu panggil lagi untuk Google.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Setup gagal.' });
  }
}
