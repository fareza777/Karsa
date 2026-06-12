/* ===== KARSA — subdomain & custom domain ===== */

const DOMAIN_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export function publishHost() {
  return (process.env.KARSA_PUBLISH_HOST || '').toLowerCase().trim();
}

export function cnameTarget() {
  return process.env.KARSA_CNAME_TARGET || 'cname.vercel-dns.com';
}

export function mainHosts() {
  const env = (process.env.KARSA_MAIN_HOSTS || '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean);
  return env;
}

export function normalizeDomain(raw) {
  return String(raw || '')
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.$/, '')
    .replace(/^www\./, '');
}

export function validateCustomDomain(domain) {
  if (!domain) return null;
  if (domain.length < 4 || domain.length > 120) return 'Domain tidak valid.';
  if (!DOMAIN_RE.test(domain)) return 'Format domain salah (contoh: tokosaya.com).';
  const ph = publishHost();
  if (ph && (domain === ph || domain.endsWith('.' + ph))) {
    return 'Pakai subdomain gratis: nama.' + ph;
  }
  if (domain.includes('vercel.app')) return 'Domain vercel.app tidak bisa dipakai.';
  return null;
}

export function slugFromSubdomain(host) {
  const ph = publishHost();
  if (!ph || !host || !host.endsWith('.' + ph)) return null;
  const slug = host.slice(0, -(ph.length + 1));
  if (!slug || slug.includes('.') || slug === 'www') return null;
  if (!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug)) return null;
  return slug;
}

export function isMainAppHost(host) {
  if (!host) return true;
  const h = host.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1') return true;
  if (mainHosts().includes(h)) return true;
  if (h.endsWith('.vercel.app')) return true;
  const ph = publishHost();
  if (ph && (h === ph || h === 'www.' + ph)) return true;
  return false;
}

export function subdomainUrl(slug, proto) {
  const ph = publishHost();
  if (!ph || !slug) return null;
  return (proto || 'https') + '://' + slug + '.' + ph;
}
