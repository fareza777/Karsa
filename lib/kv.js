/* ===== KARSA — helper Vercel KV / Upstash Redis REST ===== */

export function kvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvCommand(command) {
  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!base || !token) return { error: 'KV tidak dikonfigurasi' };
  // Seluruh codebase mengandalkan helper KV MENGEMBALIKAN {error}, bukan
  // melempar — handler API tak punya try/catch. Bungkus fetch+parse agar
  // blip jaringan ke Upstash jadi {error} rapi, bukan 500 dgn stack bocor.
  try {
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
    return await res.json();
  } catch (e) {
    return { error: 'KV tidak terjangkau: ' + (e && e.message ? e.message : 'jaringan') };
  }
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

export async function kvSetNx(key, value) {
  const data = await kvCommand(['SET', key, value, 'NX']);
  if (data.error) return { error: data.error };
  return { claimed: data.result === 'OK' };
}

export async function kvDel(key) {
  const data = await kvCommand(['DEL', key]);
  if (data.error) return { error: data.error };
  return { ok: true };
}

export async function kvIncr(key, by = 1) {
  const cmd = by === 1 ? ['INCR', key] : ['INCRBY', key, by];
  const data = await kvCommand(cmd);
  if (data.error) return { error: data.error };
  return { value: data.result };
}

export async function kvExpire(key, seconds) {
  const data = await kvCommand(['EXPIRE', key, String(seconds)]);
  if (data.error) return { error: data.error };
  return { ok: true };
}

export async function kvSadd(key, member) {
  const data = await kvCommand(['SADD', key, member]);
  if (data.error) return { error: data.error };
  return { ok: true };
}

export async function kvScard(key) {
  const data = await kvCommand(['SCARD', key]);
  if (data.error) return 0;
  return data.result || 0;
}

export async function kvLpush(key, value) {
  const data = await kvCommand(['LPUSH', key, value]);
  if (data.error) return { error: data.error };
  return { ok: true };
}

export async function kvLrange(key, start, stop) {
  const data = await kvCommand(['LRANGE', key, String(start), String(stop)]);
  if (data.error) return [];
  return data.result || [];
}

export async function kvLtrim(key, start, stop) {
  const data = await kvCommand(['LTRIM', key, String(start), String(stop)]);
  if (data.error) return { error: data.error };
  return { ok: true };
}
