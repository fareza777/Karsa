/* ===== KARSA — pengaturan LLM admin (superuser only) ===== */

import { isSuperuserEmail } from '../lib/superuser.js';
import { kvConfigured } from '../lib/kv.js';
import {
  defaultAiConfig,
  getAiConfig,
  saveAiConfig,
  maskAiConfig,
} from '../lib/ai-config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!isSuperuserEmail(email)) {
    res.status(403).json({ error: 'Akses admin ditolak.' });
    return;
  }

  const action = String(req.body?.action || 'get');

  if (action === 'save') {
    const result = await saveAiConfig(req.body.config || {}, email);
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.status(200).json({
      ok: true,
      kvConfigured: kvConfigured(),
      config: result.config,
    });
    return;
  }

  const cfg = await getAiConfig();
  const envDefaults = defaultAiConfig();

  res.status(200).json({
    ok: true,
    kvConfigured: kvConfigured(),
    config: maskAiConfig(cfg),
    envDefaults: {
      upstreamUrl: envDefaults.upstreamUrl,
      defaultModel: envDefaults.defaultModel,
      visionModel: envDefaults.visionModel,
      maxOutputTokens: envDefaults.maxOutputTokens,
      apiKeyConfigured: !!process.env.MINIMAX_API_KEY,
    },
  });
}
