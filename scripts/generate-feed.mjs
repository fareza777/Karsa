import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLE_PATHS, SEO_ROUTES, SITE } from './seo-routes.mjs';

function maxIsoDate(...dates) {
  return dates.filter(Boolean).sort().at(-1) ?? '2026-06-01';
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderFeedXml() {
  const items = [...ARTICLE_PATHS]
    .sort(
      (a, b) =>
        new Date(SEO_ROUTES[b].datePublished).getTime() -
        new Date(SEO_ROUTES[a].datePublished).getTime()
    )
    .map((path) => {
      const route = SEO_ROUTES[path];
      return `    <item>
      <title>${escapeXml(route.title)}</title>
      <link>${route.canonical}</link>
      <guid isPermaLink="true">${route.canonical}</guid>
      <description>${escapeXml(route.description)}</description>
      <pubDate>${new Date(`${route.datePublished}T08:00:00+07:00`).toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KARSA — Panduan Vibecoding</title>
    <link>${SITE}/</link>
    <description>Panduan pembuat aplikasi, vibecoding UMKM, dan publish website dari KARSA.</description>
    <language>id</language>
    <lastBuildDate>${new Date(`${maxIsoDate(...ARTICLE_PATHS.map((path) => SEO_ROUTES[path].dateModified))}T08:00:00+07:00`).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

export function generateFeed(targetDir = process.cwd()) {
  const xml = renderFeedXml();
  const outPath = join(targetDir, 'feed.xml');
  writeFileSync(outPath, xml, 'utf8');
  return outPath;
}

const isCliEntry =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliEntry) {
  const out = generateFeed();
  console.log(`✓ feed.xml generated → ${out.replace(process.cwd(), '.')}`);
}