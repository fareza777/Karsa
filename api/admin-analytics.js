/* ===== KARSA — dashboard analitik + pengaturan LLM (superuser only) ===== */

import { isSuperuserEmail } from '../lib/superuser.js';
import { requireUser } from '../lib/supabase-auth.js';
import { analyticsEnabled, getStatsRange, getRecentActivity } from '../lib/analytics.js';
import { getAdminOverview, adminConfigured } from '../lib/supabase-admin.js';
import { kvConfigured } from '../lib/kv.js';
import {
  defaultAiConfig,
  getAiConfig,
  saveAiConfig,
  maskAiConfig,
} from '../lib/ai-config.js';

async function handleAiConfig(req, res, user) {
  const action = String(req.body?.action || 'ai-get');

  if (action === 'ai-save') {
    const result = await saveAiConfig(req.body.config || {}, user.email);
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST saja.' });
    return;
  }
  const user = await requireUser(req, res);
  if (!user) return;
  const email = String(user.email || '').trim().toLowerCase();
  if (!isSuperuserEmail(email)) {
    res.status(403).json({ error: 'Akses admin ditolak.' });
    return;
  }

  const action = String(req.body?.action || 'stats');
  if (action === 'ai-get' || action === 'ai-save') {
    await handleAiConfig(req, res, user);
    return;
  }

  const days = analyticsEnabled() ? await getStatsRange(30) : [];
  const today = days.length ? days[days.length - 1] : null;
  const last7 = days.slice(-7);
  const sum = (key) => last7.reduce((a, d) => a + (d[key] || 0), 0);

  const supabase = adminConfigured() ? await getAdminOverview() : null;
  const activity = analyticsEnabled() ? await getRecentActivity(40) : [];
  const aiBrief = maskAiConfig(await getAiConfig());

  res.status(200).json({
    analyticsEnabled: analyticsEnabled(),
    kvConfigured: kvConfigured(),
    supabaseConfigured: adminConfigured(),
    aiBrief,
    today,
    last7: {
      logins: sum('logins'),
      signups: sum('signups'),
      ai_requests: sum('ai_requests'),
      tokens_in: sum('tokens_in'),
      tokens_out: sum('tokens_out'),
      publishes: sum('publishes'),
      unique_users: sum('unique_users'),
    },
    days,
    activity,
    supabase,
    generatedAt: new Date().toISOString(),
  });
}
