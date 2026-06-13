/* ===== KARSA — superuser (akses Pro penuh untuk tim / QA) ===== */

export function superuserEmails() {
  const raw = process.env.KARSA_SUPERUSER_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isSuperuserEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  if (!e) return false;
  const list = superuserEmails();
  return list.length > 0 && list.includes(e);
}
