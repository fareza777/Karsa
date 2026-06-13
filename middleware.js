/* ===== KARSA — routing subdomain & custom domain ke situs publish ===== */

import { isMainAppHost, slugFromSubdomain, normalizeDomain } from './lib/domains.js';

export const config = {
  matcher: [
    '/((?!api/|css/|js/|_next/|favicon|og\\.svg|.*\\.(?:css|js|html|ico|png|svg|woff2?|json|map)$).*)',
  ],
};

async function lookupCustomSlug(host, origin) {
  const domain = normalizeDomain(host);
  if (!domain) return null;
  try {
    const res = await fetch(origin + '/api/domain?host=' + encodeURIComponent(domain), {
      headers: { 'x-karsa-middleware': '1' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.slug || null;
  } catch (e) {
    return null;
  }
}

export default async function middleware(request) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() || '';
  if (isMainAppHost(host)) return;

  let slug = slugFromSubdomain(host);
  if (!slug) slug = await lookupCustomSlug(host, new URL(request.url).origin);
  if (!slug) {
    return new Response(
      '<!DOCTYPE html><html lang="id"><body style="font-family:system-ui;text-align:center;padding:48px;color:#64748b">' +
      '<p>✦</p><h1>Situs tidak ditemukan</h1><p>Domain belum terhubung ke KARSA atau belum dipublish.</p>' +
      '<p><a href="https://karsa.work" style="color:#7c5cff">Kembali ke KARSA</a></p></body></html>',
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const siteUrl = new URL('/api/site/' + encodeURIComponent(slug), request.url);
  return fetch(siteUrl.toString(), { headers: request.headers });
}
