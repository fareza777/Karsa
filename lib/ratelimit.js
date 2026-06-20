/* ===== KARSA — pembatas laju & cek origin untuk endpoint mahal (/api/chat) =====
   Tujuan: cegah penyalahgunaan API key LLM dari pemanggilan langsung/lintas-situs.
   Semua pembatasan fail-open kalau KV bermasalah (jangan blokir user sah karena
   KV hiccup), kecuali batas global harian yang memang penjaga anggaran. */

import { kvConfigured, kvIncr, kvExpire } from './kv.js';
import { publishHost } from './domains.js';

// IP klien di belakang proxy Vercel.
export function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function hostOf(value) {
  if (!value) return '';
  try {
    return new URL(value).host.toLowerCase();
  } catch (e) {
    return String(value).toLowerCase();
  }
}

// Daftar host yang boleh memanggil endpoint (app sendiri + host publish + lokal).
function allowedHosts(req) {
  const hosts = new Set();
  const self = (req.headers.host || '').toLowerCase();
  if (self) hosts.add(self);
  const ph = publishHost();
  if (ph) hosts.add(ph.toLowerCase());
  const extra = (process.env.KARSA_ALLOWED_ORIGINS || '')
    .split(',').map((s) => hostOf(s.trim())).filter(Boolean);
  extra.forEach((h) => hosts.add(h));
  // host lokal untuk pengembangan
  ['localhost:3000', '127.0.0.1:3000', 'localhost', '127.0.0.1'].forEach((h) => hosts.add(h));
  return hosts;
}

// True jika permintaan datang dari origin yang diizinkan.
// Permintaan tanpa Origin & Referer dibiarkan lewat (mis. same-origin GET di
// sebagian browser / proxy) — lapisan rate-limit per-IP tetap melindungi.
export function originAllowed(req) {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  if (!origin && !referer) return true;
  const allowed = allowedHosts(req);
  const oHost = hostOf(origin);
  const rHost = hostOf(referer);
  if (oHost && allowed.has(oHost)) return true;
  if (!oHost && rHost && allowed.has(rHost)) return true;
  // Subdomain dari host publish (situs yang dipublish) juga sah.
  const ph = (publishHost() || '').toLowerCase();
  if (ph && (oHost.endsWith('.' + ph) || rHost.endsWith('.' + ph))) return true;
  return false;
}

// Penghitung jendela tetap (fixed window) berbasis KV. Fail-open saat error.
async function hitWindow(bucket, id, limit, windowSec) {
  if (!kvConfigured()) return { allowed: true, skipped: true };
  const win = Math.floor(Date.now() / 1000 / windowSec);
  const key = `karsa:rl:${bucket}:${id}:${win}`;
  const { value, error } = await kvIncr(key);
  if (error || typeof value !== 'number') return { allowed: true, error };
  if (value === 1) await kvExpire(key, windowSec + 5);
  const resetSec = (win + 1) * windowSec - Math.floor(Date.now() / 1000);
  return { allowed: value <= limit, count: value, limit, resetSec };
}

// Pembatas satu-jendela yang bisa dipakai endpoint lain (publish, dll).
// Fail-open saat KV error / tak dikonfigurasi.
export async function rateLimitOnce(bucket, id, limit, windowSec) {
  return hitWindow(bucket, id, limit, windowSec);
}

function num(envName, fallback) {
  const v = Number(process.env[envName]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

// Cek semua batas untuk /api/chat. Mengembalikan { ok } atau { ok:false, status, error, retryAfter }.
export async function checkChatLimits(req) {
  if (!originAllowed(req)) {
    return { ok: false, status: 403, error: 'Permintaan ditolak: origin tidak diizinkan.' };
  }
  if (!kvConfigured()) return { ok: true }; // tanpa KV (dev) — lewati rate-limit

  const ip = clientIp(req);

  const perMin = await hitWindow('chat:min', ip, num('KARSA_CHAT_RL_PER_MIN', 20), 60);
  if (!perMin.allowed) {
    return { ok: false, status: 429, error: 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.', retryAfter: perMin.resetSec };
  }
  const perDay = await hitWindow('chat:day', ip, num('KARSA_CHAT_RL_PER_DAY', 300), 86400);
  if (!perDay.allowed) {
    return { ok: false, status: 429, error: 'Batas harian penggunaan AI dari perangkat ini tercapai. Coba lagi besok.', retryAfter: perDay.resetSec };
  }

  // Penjaga anggaran global (opsional, aktif bila KARSA_CHAT_DAILY_MAX di-set).
  const globalMax = Number(process.env.KARSA_CHAT_DAILY_MAX);
  if (Number.isFinite(globalMax) && globalMax > 0) {
    const g = await hitWindow('chat:global', 'all', globalMax, 86400);
    if (!g.allowed) {
      return { ok: false, status: 429, error: 'Layanan AI sedang sibuk (batas harian). Coba lagi nanti.', retryAfter: g.resetSec };
    }
  }
  return { ok: true };
}
