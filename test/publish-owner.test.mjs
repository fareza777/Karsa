import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import * as KV from '../lib/kv.js';

async function ownerModule() {
  try {
    return await import('../lib/publish-owner.js');
  } catch (error) {
    expect.fail(`publish owner helper belum tersedia: ${error.message}`);
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
});

describe('publish owner capability', () => {
  it('menerima hanya token hex 256-bit', async () => {
    const { ownerTokenValid } = await ownerModule();
    expect(ownerTokenValid('ab'.repeat(32))).toBe(true);
    expect(ownerTokenValid('ab'.repeat(31))).toBe(false);
    expect(ownerTokenValid('zz'.repeat(32))).toBe(false);
  });

  it('hash deterministik dan token salah tidak cocok', async () => {
    const { hashOwnerToken, ownerMatches } = await ownerModule();
    const token = '01'.repeat(32);
    const hash = hashOwnerToken(token);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hashOwnerToken(token)).toBe(hash);
    expect(ownerMatches(token, hash)).toBe(true);
    expect(ownerMatches('02'.repeat(32), hash)).toBe(false);
    expect(ownerMatches(token, 'invalid')).toBe(false);
  });
});

describe('atomic KV claim', () => {
  it('membedakan claim baru dan key yang sudah dimiliki', async () => {
    expect(typeof KV.kvSetNx).toBe('function');
    process.env.KV_REST_API_URL = 'https://kv.example';
    process.env.KV_REST_API_TOKEN = 'token';
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: 'OK' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: null }) });

    await expect(KV.kvSetNx('owner', 'hash')).resolves.toEqual({ claimed: true });
    await expect(KV.kvSetNx('owner', 'hash')).resolves.toEqual({ claimed: false });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(['SET', 'owner', 'hash', 'NX']);
  });
});

describe('publish integration contract', () => {
  const api = readFileSync(new URL('../api/publish.js', import.meta.url), 'utf8');
  const client = readFileSync(new URL('../js/publish.js', import.meta.url), 'utf8');

  it('mengotorisasi owner sebelum menulis HTML', () => {
    expect(api).toContain('async function authorizePublishOwner');
    expect(api.indexOf('await authorizePublishOwner')).toBeGreaterThan(-1);
    expect(api.indexOf("await authorizePublishOwner")).toBeLessThan(api.indexOf("kvSet('karsa:pub:' + slug + ':html'"));
  });

  it('tidak menghapus mapping previous domain secara buta', () => {
    expect(api).toContain("kvGet('karsa:domain:' + prev)");
    expect(api).toMatch(/prevMapping\.value\s*===\s*slug/);
  });

  it('client membuat dan menyimpan capability proyek', () => {
    expect(client).toContain('function ensureOwnerToken(project)');
    expect(client).toContain('crypto.getRandomValues');
    expect(client).toContain('body.ownerToken = ownerToken');
    expect(client).toContain('body.previousPublishedAt = project.publish.publishedAt');
    expect(client).toContain('ownerToken: data.ownerToken || ownerToken');
    const persist = client.indexOf('State.updateProject(project.id, { publish: { ...prev, ownerToken } })');
    const request = client.indexOf('const data = await doPublish');
    expect(persist).toBeGreaterThan(-1);
    expect(persist).toBeLessThan(request);
  });
});
