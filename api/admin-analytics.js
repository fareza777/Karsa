/* ===== KARSA — dashboard analitik (superuser only) ===== */

import { isSuperuserEmail } from '../lib/superuser.js';
import { analyticsEnabled, getStatsRange, getRecentActivity } from '../lib/analytics.js';
import { getAdminOverview, adminConfigured } from '../lib/supabase-admin.js';

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

  const days = analyticsEnabled() ? await getStatsRange(30) : [];
  const today = days.length ? days[days.length - 1] : null;
  const last7 = days.slice(-7);
  const sum = (key) => last7.reduce((a, d) => a + (d[key] || 0), 0);

  const supabase = adminConfigured() ? await getAdminOverview() : null;
  const activity = analyticsEnabled() ? await getRecentActivity(40) : [];

  res.status(200).json({
    analyticsEnabled: analyticsEnabled(),
    supabaseConfigured: adminConfigured(),
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
