/* ===== KARSA AI — proxy serverless ke MiniMax (API key aman di server) ===== */

import { trackAiUsage } from '../lib/analytics.js';

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
const MAX_TEXT_CHARS = 200000;
const MAX_TOTAL_CHARS = 3500000; // termasuk gambar data-URL (batas body Vercel ±4,5 MB)
const MAX_OUTPUT_TOKENS = Number(process.env.KARSA_AI_MAX_TOKENS) || 65536;

// Konten boleh string, atau array bagian {type:'text'}|{type:'image_url'} (vision)
function contentSize(content) {
  if (typeof content === 'string') return { text: content.length, total: content.length };
  if (!Array.isArray(content)) return null;
  let text = 0, total = 0;
  for (const part of content) {
    if (part && part.type === 'text' && typeof part.text === 'string') {
      text += part.text.length;
      total += part.text.length;
    } else if (
      part && part.type === 'image_url' &&
      part.image_url && typeof part.image_url.url === 'string' &&
      part.image_url.url.startsWith('data:image/')
    ) {
      total += part.image_url.url.length;
    } else {
      return null;
    }
  }
  return { text, total };
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return 'messages harus berupa array berisi pesan.';
  if (messages.length > MAX_MESSAGES) return 'Terlalu banyak pesan (maks ' + MAX_MESSAGES + ').';
  let textTotal = 0, grandTotal = 0;
  for (const msg of messages) {
    if (!msg || !['system', 'user', 'assistant'].includes(msg.role)) return 'Format pesan tidak valid.';
    const size = contentSize(msg.content);
    if (!size) return 'Format konten pesan tidak valid.';
    textTotal += size.text;
    grandTotal += size.total;
  }
  if (textTotal > MAX_TEXT_CHARS) return 'Total teks terlalu besar (maks ' + MAX_TEXT_CHARS + ' karakter).';
  if (grandTotal > MAX_TOTAL_CHARS) return 'Lampiran terlalu besar (maks ±3 MB total).';
  return null;
}

function trimMessagesToFit(messages, maxText) {
  if (!Array.isArray(messages)) return messages;
  let total = 0;
  for (const msg of messages) {
    const size = contentSize(msg.content);
    if (size) total += size.text;
  }
  if (total <= maxText) return messages;

  const system = messages[0];
  const projectCtx = messages[1];
  const last = messages[messages.length - 1];
  let middle = messages.slice(2, -1).map((msg) => {
    if (msg.role === 'assistant' && typeof msg.content === 'string') {
      let t = msg.content;
      t = t.replace(/```[\w-]*[ \t]+file=[^\n`]+\n[\s\S]*?```/g, '(file di ringkas)');
      if (t.length > 3000) t = t.slice(0, 3000) + '\n[…]';
      return { role: 'assistant', content: t };
    }
    if (typeof msg.content === 'string' && msg.content.length > 2500) {
      return { role: msg.role, content: msg.content.slice(0, 2500) + '\n[…]' };
    }
    return msg;
  });
  let trimmed = [system, projectCtx, ...middle.slice(-2), last];
  total = 0;
  for (const msg of trimmed) {
    const size = contentSize(msg.content);
    if (size) total += size.text;
  }
  if (total > maxText && projectCtx && typeof projectCtx.content === 'string') {
    trimmed[1] = {
      role: projectCtx.role,
      content: projectCtx.content.slice(0, Math.max(8000, Math.floor(maxText * 0.35))) + '\n[… konteks dipotong]',
    };
  }
  return trimmed;
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

  const { messages: rawMessages, model } = req.body || {};
  const messages = trimMessagesToFit(rawMessages, MAX_TEXT_CHARS - 5000);
  const invalid = validateMessages(messages);
  if (invalid) {
    res.status(400).json({ error: invalid });
    return;
  }

  const chosenModel = ALLOWED_MODELS.includes(model) ? model : 'MiniMax-M2.7-highspeed';
  let inputChars = 0;
  for (const msg of messages) {
    const s = contentSize(msg.content);
    if (s) inputChars += s.total;
  }

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
        max_completion_tokens: MAX_OUTPUT_TOKENS,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.7,
        // Model reasoning (M3): pangkas penalaran — user tidak perlu prompt manual
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
  const decoder = new TextDecoder();
  let sseBuffer = '';
  let outputChars = 0;
  let usage = { prompt_tokens: 0, completion_tokens: 0 };
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
      if (typeof res.flush === 'function') res.flush();
      sseBuffer += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = sseBuffer.indexOf('\n')) !== -1) {
        const line = sseBuffer.slice(0, nl).trim();
        sseBuffer = sseBuffer.slice(nl + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const json = JSON.parse(payload);
          if (json.usage) {
            usage.prompt_tokens = json.usage.prompt_tokens || usage.prompt_tokens;
            usage.completion_tokens = json.usage.completion_tokens || usage.completion_tokens;
          }
          const delta = json.choices?.[0]?.delta?.content;
          if (typeof delta === 'string') outputChars += delta.length;
        } catch (_) { /* chunk parsial */ }
      }
    }
  } catch (err) {
    res.write('data: ' + JSON.stringify({ error: 'Stream terputus: ' + err.message }) + '\n\n');
  } finally {
    trackAiUsage({
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      promptChars: inputChars,
      completionChars: outputChars,
    }).catch(() => {});
    res.end();
  }
}
