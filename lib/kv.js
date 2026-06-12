/* ===== KARSA — helper Vercel KV / Upstash Redis REST ===== */

export function kvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvCommand(command) {
  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!base || !token) return { error: 'KV tidak dikonfigurasi' };
  const res = await fetch(base, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { error: 'KV error ' + res.status + ': ' + text.slice(0, 200) };
  }
  return res.json();
}

export async function kvGet(key) {
  const data = await kvCommand(['GET', key]);
  if (data.error) return { error: data.error };
  return { value: data.result };
}

export async function kvSet(key, value) {
  const data = await kvCommand(['SET', key, value]);
  if (data.error) return { error: data.error };
  return { ok: true };
}
