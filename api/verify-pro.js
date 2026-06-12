/* ===== KARSA — verifikasi kode Pro (env KARSA_PRO_TOKEN) ===== */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }

  const secret = process.env.KARSA_PRO_TOKEN;
  if (!secret) {
    res.status(503).json({ error: 'Pro belum dikonfigurasi di server (KARSA_PRO_TOKEN).' });
    return;
  }

  const code = String((req.body && req.body.code) || '').trim();
  if (!code || code !== secret) {
    res.status(401).json({ error: 'Kode Pro tidak valid.' });
    return;
  }

  res.status(200).json({ ok: true, pro: true });
}
