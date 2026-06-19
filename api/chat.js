/* ===== KARSA AI — proxy serverless ke provider LLM (API key aman di server) ===== */

import { trackAiUsage } from '../lib/analytics.js';
import { getAiConfig, resolveChatModel } from '../lib/ai-config.js';
import { checkChatLimits } from '../lib/ratelimit.js';

// Wajib: tanpa ini Vercel mem-buffer seluruh respons sebelum dikirim ke browser,
// sehingga streaming tidak pernah tampil dan permintaan panjang mati kena timeout.
export const config = {
  supportsResponseStreaming: true,
  maxDuration: 300,
};

const MINIMAX_URL = 'https://api.minimax.io/v1/chat/completions';
const MAX_MESSAGES = 40;
const MAX_TEXT_CHARS = 200000;
const MAX_TOTAL_CHARS = 3500000; // termasuk gambar data-URL (batas body Vercel ±4,5 MB)
const MAX_OUTPUT_TOKENS_DEFAULT = Number(process.env.KARSA_AI_MAX_TOKENS) || 65536;

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

  // #7 Lindungi API key: cek origin + rate-limit per-IP + penjaga anggaran.
  let limit;
  try {
    limit = await checkChatLimits(req);
  } catch (e) {
    limit = { ok: true }; // fail-open kalau mekanisme limit error
  }
  if (!limit.ok) {
    if (limit.retryAfter) res.setHeader('Retry-After', String(Math.max(1, Math.ceil(limit.retryAfter))));
    res.status(limit.status || 429).json({ error: limit.error });
    return;
  }

  const aiCfg = await getAiConfig();
  const apiKey = aiCfg.apiKey;
  if (!apiKey) {
    res.status(500).json({ error: 'API key LLM belum dikonfigurasi (env atau Admin → KARSA AI).' });
    return;
  }

  const { messages: rawMessages, model } = req.body || {};
  const messages = trimMessagesToFit(rawMessages, MAX_TEXT_CHARS - 5000);
  const invalid = validateMessages(messages);
  if (invalid) {
    res.status(400).json({ error: invalid });
    return;
  }

  const hasImages = messages.some((msg) =>
    Array.isArray(msg.content) && msg.content.some((p) => p && p.type === 'image_url')
  );
  const chosenModel = resolveChatModel(model, aiCfg, hasImages);
  const maxOutputTokens = aiCfg.maxOutputTokens || MAX_OUTPUT_TOKENS_DEFAULT;
  const upstreamUrl = aiCfg.upstreamUrl || MINIMAX_URL;
  const temperature = aiCfg.temperature ?? 0.7;
  let inputChars = 0;
  for (const msg of messages) {
    const s = contentSize(msg.content);
    if (s) inputChars += s.total;
  }

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: chosenModel,
        messages,
        stream: true,
        max_completion_tokens: maxOutputTokens,
        max_tokens: maxOutputTokens,
        temperature,
        ...(chosenModel.includes('M3') ? { reasoning_effort: 'low' } : {}),
      }),
    });
  } catch (err) {
    res.status(502).json({ error: 'Gagal menghubungi KARSA AI: ' + err.message });
    return;
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    res.status(upstream.status).json({ error: 'KARSA AI menolak permintaan (' + upstream.status + ').', detail: detail.slice(0, 500) });
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
