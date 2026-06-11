/* ===== KARSA AI — proxy serverless ke MiniMax (API key aman di server) ===== */

// Wajib: tanpa ini Vercel mem-buffer seluruh respons sebelum dikirim ke browser,
// sehingga streaming tidak pernah tampil dan permintaan panjang mati kena timeout.
export const config = {
  supportsResponseStreaming: true,
  maxDuration: 300,
};

const MINIMAX_URL = 'https://api.minimax.io/v1/chat/completions';
const ALLOWED_MODELS = [
  'MiniMax-M3',
  'MiniMax-M2.7', 'MiniMax-M2.7-highspeed',
  'MiniMax-M2.5', 'MiniMax-M2.5-highspeed',
  'MiniMax-M2.1', 'MiniMax-M2.1-highspeed',
  'MiniMax-M2',
];
const MAX_MESSAGES = 40;
const MAX_TOTAL_CHARS = 200000;

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return 'messages harus berupa array berisi pesan.';
  if (messages.length > MAX_MESSAGES) return 'Terlalu banyak pesan (maks ' + MAX_MESSAGES + ').';
  let total = 0;
  for (const msg of messages) {
    if (!msg || typeof msg.content !== 'string' || !['system', 'user', 'assistant'].includes(msg.role)) {
      return 'Format pesan tidak valid.';
    }
    total += msg.content.length;
  }
  if (total > MAX_TOTAL_CHARS) return 'Total konteks terlalu besar (maks ' + MAX_TOTAL_CHARS + ' karakter).';
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Gunakan metode POST.' });
    return;
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'MINIMAX_API_KEY belum dikonfigurasi di server.' });
    return;
  }

  const { messages, model } = req.body || {};
  const invalid = validateMessages(messages);
  if (invalid) {
    res.status(400).json({ error: invalid });
    return;
  }

  const chosenModel = ALLOWED_MODELS.includes(model) ? model : 'MiniMax-M2.7-highspeed';

  let upstream;
  try {
    upstream = await fetch(MINIMAX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: chosenModel,
        messages,
        stream: true,
        max_tokens: 16384,
        temperature: 0.7,
        // Model reasoning (M3): pangkas penalaran agar respons lebih cepat
        ...(chosenModel.includes('M3') ? { reasoning_effort: 'low' } : {}),
      }),
    });
  } catch (err) {
    res.status(502).json({ error: 'Gagal menghubungi MiniMax: ' + err.message });
    return;
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    res.status(upstream.status).json({ error: 'MiniMax menolak permintaan (' + upstream.status + ').', detail: detail.slice(0, 500) });
    return;
  }

  // Teruskan stream SSE apa adanya ke browser
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  if (typeof res.flushHeaders === 'function') res.flushHeaders();

  const reader = upstream.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
      if (typeof res.flush === 'function') res.flush();
    }
  } catch (err) {
    res.write('data: ' + JSON.stringify({ error: 'Stream terputus: ' + err.message }) + '\n\n');
  } finally {
    res.end();
  }
}
