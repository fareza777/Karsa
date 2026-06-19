import { describe, it, expect, beforeEach } from 'vitest';
import { originAllowed, clientIp } from '../lib/ratelimit.js';

function req({ host = 'karsa.work', origin, referer, xff } = {}) {
  const headers = { host };
  if (origin !== undefined) headers.origin = origin;
  if (referer !== undefined) headers.referer = referer;
  if (xff !== undefined) headers['x-forwarded-for'] = xff;
  return { headers, socket: {} };
}

describe('originAllowed', () => {
  beforeEach(() => {
    process.env.KARSA_PUBLISH_HOST = 'karsa.work';
    delete process.env.KARSA_ALLOWED_ORIGINS;
  });

  it('mengizinkan same-origin', () => {
    expect(originAllowed(req({ host: 'karsa.work', origin: 'https://karsa.work' }))).toBe(true);
  });

  it('mengizinkan tanpa origin & referer (same-origin sebagian browser)', () => {
    expect(originAllowed(req({ host: 'karsa.work' }))).toBe(true);
  });

  it('menolak origin lintas-situs', () => {
    expect(originAllowed(req({ host: 'karsa.work', origin: 'https://jahat.example' }))).toBe(false);
  });

  it('mengizinkan subdomain host publish', () => {
    expect(originAllowed(req({ host: 'karsa.work', origin: 'https://tokoku.karsa.work' }))).toBe(true);
  });

  it('menghormati KARSA_ALLOWED_ORIGINS', () => {
    process.env.KARSA_ALLOWED_ORIGINS = 'https://app.lain.com';
    expect(originAllowed(req({ host: 'karsa.work', origin: 'https://app.lain.com' }))).toBe(true);
  });

  it('jatuh ke referer saat origin kosong', () => {
    expect(originAllowed(req({ host: 'karsa.work', referer: 'https://karsa.work/app.html' }))).toBe(true);
    expect(originAllowed(req({ host: 'karsa.work', referer: 'https://jahat.example/x' }))).toBe(false);
  });
});

describe('clientIp', () => {
  it('ambil IP pertama dari x-forwarded-for', () => {
    expect(clientIp(req({ xff: '203.0.113.5, 10.0.0.1' }))).toBe('203.0.113.5');
  });
  it('fallback unknown', () => {
    expect(clientIp(req())).toBe('unknown');
  });
});
