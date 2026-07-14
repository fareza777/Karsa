import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';

async function helpers() {
  return import('../lib/ai-upstream.js');
}

describe('AI upstream timeout helpers', () => {
  it('returns a completed fetch and clears its timeout', async () => {
    const { fetchWithTimeout } = await helpers();
    const response = { ok: true };
    const fetchImpl = vi.fn().mockResolvedValue(response);
    await expect(fetchWithTimeout(fetchImpl, 'https://example.test', {}, 50)).resolves.toBe(response);
  });

  it('aborts a stalled connection with AI_CONNECT_TIMEOUT', async () => {
    const { fetchWithTimeout } = await helpers();
    const fetchImpl = vi.fn((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
    }));
    await expect(fetchWithTimeout(fetchImpl, 'https://example.test', {}, 5)).rejects.toMatchObject({
      code: 'AI_CONNECT_TIMEOUT',
    });
  });

  it('preserves a parent AbortError', async () => {
    const { fetchWithTimeout } = await helpers();
    const parent = new AbortController();
    const fetchImpl = vi.fn((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
    }));
    const pending = fetchWithTimeout(fetchImpl, 'https://example.test', {}, 100, parent.signal);
    parent.abort(new DOMException('client disconnected', 'AbortError'));
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('returns reader data normally', async () => {
    const { readWithIdleTimeout } = await helpers();
    const result = { done: false, value: new Uint8Array([1]) };
    await expect(readWithIdleTimeout({ read: vi.fn().mockResolvedValue(result) }, 50)).resolves.toBe(result);
  });

  it('rejects an idle reader with AI_STREAM_IDLE', async () => {
    const { readWithIdleTimeout } = await helpers();
    await expect(readWithIdleTimeout({ read: () => new Promise(() => {}) }, 5)).rejects.toMatchObject({
      code: 'AI_STREAM_IDLE',
    });
  });
});

describe('chat proxy reliability contracts', () => {
  const source = fs.readFileSync(new URL('../api/chat.js', import.meta.url), 'utf8');

  it('applies explicit connection and stream-idle timeouts', () => {
    expect(source).toContain('fetchWithTimeout(fetch, upstreamUrl');
    expect(source).toContain('CONNECT_TIMEOUT_MS');
    expect(source).toContain('readWithIdleTimeout(reader, STREAM_IDLE_TIMEOUT_MS)');
  });

  it('guards missing response bodies and flushes the decoder', () => {
    expect(source).toMatch(/if \(!upstream\.body\)/);
    expect(source).toContain('decoder.decode()');
  });

  it('uses one parser for complete lines and the final buffer', () => {
    expect(source).toContain('function parseSseLine(line)');
    expect(source).toContain('parseSseLine(sseBuffer.trim())');
  });
});
