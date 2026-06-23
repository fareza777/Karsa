import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLE_PATHS, HUB_PATHS, SEO_ROUTES } from './seo-routes.mjs';

function maxIsoDate(...dates) {
  return dates.filter(Boolean).sort().at(-1) ?? '2026-06-23';
}

export function buildSitemapEntries() {
  const home = SEO_ROUTES['/'];
  const latestArticleDate = maxIsoDate(
    ...ARTICLE_PATHS.map((path) => SEO_ROUTES[path].dateModified || SEO_ROUTES[path].datePublished)
  );

  /** @type {{ loc: string; lastmod: string; changefreq: string; priority: number }[]} */
  const entries = [
    {
      loc: home.canonical,
      lastmod: maxIsoDate(home.dateModified, latestArticleDate),
      changefreq: 'weekly',
      priority: 1.0,
    },
  ];

  for (const path of HUB_PATHS) {
    const route = SEO_ROUTES[path];
    entries.push({
      loc: route.canonical,
      lastmod: maxIsoDate(route.dateModified, latestArticleDate),
      changefreq: 'weekly',
      priority: 0.9,
    });
  }

  for (const path of ARTICLE_PATHS) {
    const route = SEO_ROUTES[path];
    entries.push({
      loc: route.canonical,
      lastmod: maxIsoDate(route.dateModified, route.datePublished),
      changefreq: 'monthly',
      priority: 0.8,
    });
  }

  return entries;
}

export function renderSitemapXml(entries = buildSitemapEntries()) {
  const body = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function generateSitemap(targetDir = process.cwd()) {
  const xml = renderSitemapXml();
  const outPath = join(targetDir, 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  return outPath;
}

const isCliEntry =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliEntry) {
  const out = generateSitemap();
  const entries = buildSitemapEntries();
  console.log(`✓ sitemap.xml generated (${entries.length} URLs) → ${out.replace(process.cwd(), '.')}`);
}