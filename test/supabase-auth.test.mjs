import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function authModule() {
  try {
    return await import('../lib/supabase-auth.js');
  } catch (error) {
    expect.fail(`helper autentikasi server belum tersedia: ${error.message}`);
  }
}

describe('autentikasi request Supabase', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.SUPABASE_URL = 'https://project.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'anon-key';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it('mengambil hanya Bearer token yang valid', async () => {
    const { bearerToken } = await authModule();
    expect(bearerToken({ headers: { authorization: 'Bearer abc.def' } })).toBe('abc.def');
    expect(bearerToken({ headers: { authorization: 'Basic abc.def' } })).toBe('');
    expect(bearerToken({ headers: {} })).toBe('');
  });

  it('mengambil identitas dari Supabase, bukan request body', async () => {
    const { userFromRequest } = await authModule();
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'trusted-id', email: 'admin@example.com' }),
    });
    const user = await userFromRequest({
      headers: { authorization: 'Bearer trusted-token' },
      body: { userId: 'forged-id', email: 'attacker@example.com' },
    }, fetchImpl);

    expect(user).toEqual({ id: 'trusted-id', email: 'admin@example.com' });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://project.supabase.co/auth/v1/user',
      { headers: { Authorization: 'Bearer trusted-token', apikey: 'anon-key' } },
    );
  });

  it('menolak token kosong atau token yang ditolak Supabase', async () => {
    const { userFromRequest } = await authModule();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    await expect(userFromRequest({ headers: {} }, fetchImpl)).resolves.toBeNull();
    await expect(userFromRequest({ headers: { authorization: 'Bearer bad' } }, fetchImpl)).resolves.toBeNull();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('requireUser memberi 401 tanpa membocorkan detail token', async () => {
    const { requireUser } = await authModule();
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const user = await requireUser({ headers: {} }, res, vi.fn());

    expect(user).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Login diperlukan.' });
  });
});

