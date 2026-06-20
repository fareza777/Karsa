/* ===== KARSA — analitik harian (Vercel KV) ===== */

import { kvConfigured, kvGet, kvIncr, kvSadd, kvScard, kvLpush, kvLrange, kvLtrim } from './kv.js';

const ACTIVITY_KEY = 'karsa:a:activity';
const ACTIVITY_MAX = 50;

function dateKey(date, suffix) {
  return `karsa:a:${date}:${suffix}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function analyticsEnabled() {
  return kvConfigured();
}

function shortId(userId) {
  if (!userId) return null;
  const s = String(userId);
  return s.length > 8 ? s.slice(0, 8) + '…' : s;
}

export async function pushActivity(type, detail = {}) {
  if (!kvConfigured()) return;
  const entry = JSON.stringify({
    type,
    t: Date.now(),
    uid: shortId(detail.userId),
    n: detail.count || 0,
  });
  await kvLpush(ACTIVITY_KEY, entry);
  await kvLtrim(ACTIVITY_KEY, 0, ACTIVITY_MAX - 1);
}

export async function getRecentActivity(limit = 30) {
  if (!kvConfigured()) return [];
  const rows = await kvLrange(ACTIVITY_KEY, 0, limit - 1);
  return rows
    .map((raw) => {
      try { return JSON.parse(raw); } catch (_) { return null; }
    })
    .filter(Boolean);
}

export async function trackLogin(userId) {
  if (!kvConfigured()) return;
  const d = today();
  await kvIncr(dateKey(d, 'logins'));
  if (userId) await kvSadd(dateKey(d, 'users'), String(userId));
  await pushActivity('login', { userId });
}

export async function trackSignup(userId) {
  if (!kvConfigured()) return;
  const d = today();
  await kvIncr(dateKey(d, 'signups'));
  if (userId) await kvSadd(dateKey(d, 'users'), String(userId));
  await pushActivity('signup', { userId });
}

export async function trackAiUsage({ promptTokens = 0, completionTokens = 0, promptChars = 0, completionChars = 0 }) {
  if (!kvConfigured()) return;
  const d = today();
  await kvIncr(dateKey(d, 'ai_requests'));
  const tin = promptTokens || Math.ceil(promptChars / 4);
  const tout = completionTokens || Math.ceil(completionChars / 4);
  if (tin) await kvIncr(dateKey(d, 'tokens_in'), tin);
  if (tout) await kvIncr(dateKey(d, 'tokens_out'), tout);
  await pushActivity('ai', { count: tout || tin });
}

export async function trackPublish() {
  if (!kvConfigured()) return;
  await kvIncr(dateKey(today(), 'publishes'));
  await pushActivity('publish');
}

// #A9 Observability engine AI: rasio terpotong & seberapa sering fallback model.
export async function trackChatOutcome({ truncated = false, fallback = false } = {}) {
  if (!kvConfigured()) return;
  const d = today();
  if (truncated) await kvIncr(dateKey(d, 'ai_truncated'));
  if (fallback) await kvIncr(dateKey(d, 'ai_fallback'));
}

async function readCounter(date, suffix) {
  const hit = await kvGet(dateKey(date, suffix));
  if (hit.error) return 0;
  const n = parseInt(hit.value, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function getDayStats(date) {
  const [logins, signups, ai_requests, tokens_in, tokens_out, publishes, unique_users, ai_truncated, ai_fallback] = await Promise.all([
    readCounter(date, 'logins'),
    readCounter(date, 'signups'),
    readCounter(date, 'ai_requests'),
    readCounter(date, 'tokens_in'),
    readCounter(date, 'tokens_out'),
    readCounter(date, 'publishes'),
    kvScard(dateKey(date, 'users')).catch(() => 0),
    readCounter(date, 'ai_truncated'),
    readCounter(date, 'ai_fallback'),
  ]);
  return { date, logins, signups, ai_requests, tokens_in, tokens_out, publishes, unique_users, ai_truncated, ai_fallback };
}

export async function getStatsRange(days = 30) {
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push(await getDayStats(key));
  }
  return out;
}
