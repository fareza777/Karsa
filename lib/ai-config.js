/* ===== KARSA — konfigurasi LLM (KV + fallback env) ===== */

import { kvGet, kvSet, kvConfigured } from './kv.js';

export const KV_AI_CONFIG_KEY = 'karsa:ai-config';

export const DEFAULT_ALLOWED_MODELS = [
  'MiniMax-M3',
  'MiniMax-M2.7', 'MiniMax-M2.7-highspeed',
  'MiniMax-M2.5', 'MiniMax-M2.5-highspeed',
  'MiniMax-M2.1', 'MiniMax-M2.1-highspeed',
  'MiniMax-M2',
];

function clampNum(n, min, max, fallback) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

function parseModels(raw) {
  if (Array.isArray(raw)) {
    return raw.map((m) => String(m).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw.split(/[\n,]+/).map((m) => m.trim()).filter(Boolean);
  }
  return null;
}

export function defaultAiConfig() {
  return {
    upstreamUrl: process.env.KARSA_AI_UPSTREAM_URL || 'https://api.minimax.io/v1/chat/completions',
    defaultModel: process.env.KARSA_AI_DEFAULT_MODEL || 'MiniMax-M2.7-highspeed',
    visionModel: process.env.KARSA_AI_VISION_MODEL || 'MiniMax-M3',
    maxOutputTokens: Number(process.env.KARSA_AI_MAX_TOKENS) || 65536,
    temperature: 0.7,
    allowedModels: DEFAULT_ALLOWED_MODELS.slice(),
    apiKey: process.env.MINIMAX_API_KEY || '',
  };
}

export function maskAiConfig(cfg) {
  const key = cfg.apiKey || '';
  return {
    upstreamUrl: cfg.upstreamUrl,
    defaultModel: cfg.defaultModel,
    visionModel: cfg.visionModel,
    maxOutputTokens: cfg.maxOutputTokens,
    temperature: cfg.temperature,
    allowedModels: cfg.allowedModels || DEFAULT_ALLOWED_MODELS.slice(),
    apiKey: key ? '••••' + key.slice(-4) : '',
    apiKeyConfigured: !!key,
    updatedAt: cfg.updatedAt || null,
    updatedBy: cfg.updatedBy || null,
    source: cfg.source || 'env',
  };
}

export async function getAiConfig() {
  const base = defaultAiConfig();
  const envKey = process.env.MINIMAX_API_KEY || '';

  if (!kvConfigured()) {
    return { ...base, apiKey: envKey, source: 'env' };
  }

  const { value, error } = await kvGet(KV_AI_CONFIG_KEY);
  if (error || !value) {
    return { ...base, apiKey: envKey, source: 'env' };
  }

  try {
    const saved = JSON.parse(value);
    const allowed = parseModels(saved.allowedModels);
    return {
      ...base,
      upstreamUrl: saved.upstreamUrl || base.upstreamUrl,
      defaultModel: saved.defaultModel || base.defaultModel,
      visionModel: saved.visionModel || base.visionModel,
      maxOutputTokens: clampNum(saved.maxOutputTokens, 1024, 131072, base.maxOutputTokens),
      temperature: clampNum(saved.temperature, 0, 2, base.temperature),
      allowedModels: allowed && allowed.length ? allowed : base.allowedModels,
      apiKey: saved.apiKey || envKey,
      updatedAt: saved.updatedAt || null,
      updatedBy: saved.updatedBy || null,
      source: 'kv',
    };
  } catch {
    return { ...base, apiKey: envKey, source: 'env' };
  }
}

export async function saveAiConfig(patch, updatedBy) {
  if (!kvConfigured()) {
    return { error: 'Vercel KV belum dikonfigurasi — tambahkan KV_REST_API_URL & KV_REST_API_TOKEN di env.' };
  }

  const current = await getAiConfig();
  const allowed = parseModels(patch.allowedModels) || current.allowedModels;
  const next = {
    upstreamUrl: String(patch.upstreamUrl || current.upstreamUrl).trim(),
    defaultModel: String(patch.defaultModel || current.defaultModel).trim(),
    visionModel: String(patch.visionModel || current.visionModel).trim(),
    maxOutputTokens: clampNum(patch.maxOutputTokens, 1024, 131072, current.maxOutputTokens),
    temperature: clampNum(patch.temperature, 0, 2, current.temperature),
    allowedModels: allowed.length ? allowed : DEFAULT_ALLOWED_MODELS.slice(),
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy || '',
  };

  if (!/^https:\/\/.+/i.test(next.upstreamUrl)) {
    return { error: 'Upstream URL harus diawali https://' };
  }

  const keyIn = patch.apiKey;
  if (typeof keyIn === 'string' && keyIn.trim() && !keyIn.startsWith('••••')) {
    next.apiKey = keyIn.trim();
  } else {
    next.apiKey = current.apiKey;
  }

  if (!next.apiKey) {
    return { error: 'API key wajib — isi di form atau set MINIMAX_API_KEY di env Vercel.' };
  }

  const stored = await kvSet(KV_AI_CONFIG_KEY, JSON.stringify(next));
  if (stored.error) return { error: stored.error };

  return { ok: true, config: maskAiConfig({ ...next, source: 'kv' }) };
}

export function resolveChatModel(requested, cfg, hasImages) {
  const allowed = cfg.allowedModels || DEFAULT_ALLOWED_MODELS;
  if (hasImages && cfg.visionModel && allowed.includes(cfg.visionModel)) {
    return cfg.visionModel;
  }
  if (requested && allowed.includes(requested)) return requested;
  if (cfg.defaultModel && allowed.includes(cfg.defaultModel)) return cfg.defaultModel;
  return allowed[0] || 'MiniMax-M2.7-highspeed';
}
