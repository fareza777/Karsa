/* ===== KARSA — analitik harian (Vercel KV) ===== */

import { kvConfigured, kvGet, kvIncr, kvSadd, kvScard } from './kv.js';

function dateKey(date, suffix) {
  return `karsa:a:${date}:${suffix}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function analyticsEnabled() {
  return kvConfigured();
}

export async function trackLogin(userId) {
  if (!kvConfigured()) return;
  const d = today();
  await kvIncr(dateKey(d, 'logins'));
  if (userId) await kvSadd(dateKey(d, 'users'), String(userId));
}

export async function trackSignup(userId) {
  if (!kvConfigured()) return;
  const d = today();
  await kvIncr(dateKey(d, 'signups'));
  if (userId) await kvSadd(dateKey(d, 'users'), String(userId));
}

export async function trackAiUsage({ promptTokens = 0, completionTokens = 0, promptChars = 0, completionChars = 0 }) {
  if (!kvConfigured()) return;
  const d = today();
  await kvIncr(dateKey(d, 'ai_requests'));
  const tin = promptTokens || Math.ceil(promptChars / 4);
  const tout = completionTokens || Math.ceil(completionChars / 4);
  if (tin) await kvIncr(dateKey(d, 'tokens_in'), tin);
  if (tout) await kvIncr(dateKey(d, 'tokens_out'), tout);
}

export async function trackPublish() {
  if (!kvConfigured()) return;
  await kvIncr(dateKey(today(), 'publishes'));
}

async function readCounter(date, suffix) {
  const hit = await kvGet(dateKey(date, suffix));
  if (hit.error) return 0;
  const n = parseInt(hit.value, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function getDayStats(date) {
  const [logins, signups, ai_requests, tokens_in, tokens_out, publishes, unique_users] = await Promise.all([
    readCounter(date, 'logins'),
    readCounter(date, 'signups'),
    readCounter(date, 'ai_requests'),
    readCounter(date, 'tokens_in'),
    readCounter(date, 'tokens_out'),
    readCounter(date, 'publishes'),
    kvScard(dateKey(date, 'users')).catch(() => 0),
  ]);
  return { date, logins, signups, ai_requests, tokens_in, tokens_out, publishes, unique_users };
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
