/* ===== KARSA — Supabase Management API (auth config) ===== */

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'rebryzzjrvsgzzxoutko';
const MGMT_BASE = 'https://api.supabase.com/v1';

export function authRedirectAllowList(appUrl) {
  const base = (appUrl || 'https://karsa.work').replace(/\/$/, '');
  const lines = [
    `${base}/**`,
    'https://karsa-iota.vercel.app/**',
    'http://localhost:8080/**',
    'http://127.0.0.1:8080/**',
  ];
  return [...new Set(lines)].join('\n');
}

export function buildAuthPatch({ appUrl, googleClientId, googleSecret }) {
  const patch = {
    site_url: (appUrl || 'https://karsa.work').replace(/\/$/, ''),
    uri_allow_list: authRedirectAllowList(appUrl),
    mailer_autoconfirm: true,
    disable_signup: false,
  };
  if (googleClientId && googleSecret) {
    patch.external_google_enabled = true;
    patch.external_google_client_id = googleClientId;
    patch.external_google_secret = googleSecret;
  }
  return patch;
}

export async function getAuthConfig(accessToken) {
  const res = await fetch(`${MGMT_BASE}/projects/${PROJECT_REF}/config/auth`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.message || body.error || res.statusText;
    throw new Error(`Gagal baca auth config: ${msg}`);
  }
  return body;
}

export async function patchAuthConfig(accessToken, patch) {
  const res = await fetch(`${MGMT_BASE}/projects/${PROJECT_REF}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.message || body.error || res.statusText;
    throw new Error(`Gagal update auth config: ${msg}`);
  }
  return body;
}

export async function setupSupabaseAuth({
  accessToken,
  appUrl,
  googleClientId,
  googleSecret,
}) {
  if (!accessToken) {
    throw new Error('SUPABASE_ACCESS_TOKEN wajib (buat di supabase.com/dashboard/account/tokens).');
  }
  const patch = buildAuthPatch({ appUrl, googleClientId, googleSecret });
  const result = await patchAuthConfig(accessToken, patch);
  return {
    ok: true,
    site_url: result.site_url || patch.site_url,
    google_enabled: !!(googleClientId && googleSecret),
    mailer_autoconfirm: result.mailer_autoconfirm ?? patch.mailer_autoconfirm,
  };
}
