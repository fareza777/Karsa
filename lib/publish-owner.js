import crypto from 'node:crypto';

const OWNER_TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

export function ownerTokenValid(token) {
  return OWNER_TOKEN_PATTERN.test(String(token || ''));
}

export function hashOwnerToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export function ownerMatches(token, storedHash) {
  if (!ownerTokenValid(token) || !OWNER_TOKEN_PATTERN.test(String(storedHash || ''))) return false;

  const incoming = Buffer.from(hashOwnerToken(token), 'hex');
  const stored = Buffer.from(storedHash, 'hex');
  return incoming.length === stored.length && crypto.timingSafeEqual(incoming, stored);
}
