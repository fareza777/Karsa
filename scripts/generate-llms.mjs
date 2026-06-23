import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLE_PATHS, SEO_ROUTES, SITE } from './seo-routes.mjs';

export function renderLlmsTxt() {
  const articles = ARTICLE_PATHS.map((path) => {
    const route = SEO_ROUTES[path];
    return `- [${route.headline}](${route.canonical}): ${route.description}`;
  }).join('\n');

  return `# KARSA

> Pembuat aplikasi dan website di browser dengan AI vibecoding bahasa Indonesia.

KARSA membantu pengguna Indonesia membuat landing page, katalog UMKM, dan prototype aplikasi dari browser — tanpa install, dengan live preview dan publish ke karsa.work.

## Halaman utama

- [Beranda](${SITE}/): Pembuat aplikasi & website dengan AI
- [Panduan](${SITE}/panduan): Indeks artikel vibecoding dan no-code
- [App](${SITE}/app): Workspace KARSA (noindex)
- [RSS Feed](${SITE}/feed.xml): Artikel terbaru
- [Sitemap](${SITE}/sitemap.xml): Semua halaman publik

## Artikel panduan

${articles}

## Kontak

- Email: fajar.mreza@gmail.com
`;
}

export function generateLlms(targetDir = process.cwd()) {
  const outPath = join(targetDir, 'llms.txt');
  writeFileSync(outPath, renderLlmsTxt(), 'utf8');
  return outPath;
}

const isCliEntry =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliEntry) {
  const out = generateLlms();
  console.log(`✓ llms.txt generated → ${out.replace(process.cwd(), '.')}`);
}