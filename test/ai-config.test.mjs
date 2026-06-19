import { describe, it, expect } from 'vitest';
import { buildModelCandidates, resolveChatModel, DEFAULT_ALLOWED_MODELS } from '../lib/ai-config.js';

const cfg = {
  allowedModels: ['MiniMax-M2.7-highspeed', 'MiniMax-M3', 'MiniMax-M2.5', 'MiniMax-M2'],
  visionModel: 'MiniMax-M3',
  defaultModel: 'MiniMax-M2.7-highspeed',
};

describe('buildModelCandidates', () => {
  it('model terpilih didahulukan, lalu sisanya, maks 3', () => {
    const c = buildModelCandidates('MiniMax-M3', cfg, false);
    expect(c[0]).toBe('MiniMax-M3');
    expect(c.length).toBe(3);
    expect(new Set(c).size).toBe(c.length); // tak ada duplikat
  });

  it('gambar (vision) hanya satu model', () => {
    expect(buildModelCandidates('MiniMax-M3', cfg, true)).toEqual(['MiniMax-M3']);
  });

  it('tak menduplikasi model terpilih', () => {
    const c = buildModelCandidates('MiniMax-M2.7-highspeed', cfg, false);
    expect(c.filter((m) => m === 'MiniMax-M2.7-highspeed')).toHaveLength(1);
  });
});

describe('resolveChatModel', () => {
  it('gambar → vision model', () => {
    expect(resolveChatModel('MiniMax-M2.7-highspeed', cfg, true)).toBe('MiniMax-M3');
  });
  it('hormati requested bila diizinkan', () => {
    expect(resolveChatModel('MiniMax-M2.5', cfg, false)).toBe('MiniMax-M2.5');
  });
  it('fallback ke default bila requested tak diizinkan', () => {
    expect(resolveChatModel('model-asing', cfg, false)).toBe('MiniMax-M2.7-highspeed');
  });
  it('DEFAULT_ALLOWED_MODELS tersedia', () => {
    expect(DEFAULT_ALLOWED_MODELS.length).toBeGreaterThan(0);
  });
});
