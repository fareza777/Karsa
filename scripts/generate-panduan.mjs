import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_ROUTES, SITE, sortedArticlePaths } from './seo-routes.mjs';
import { itemListJsonLd } from './render-seo.mjs';

function renderPanduanCards() {
  return sortedArticlePaths()
    .map((path) => {
      const route = SEO_ROUTES[path];
      return `          <a href="${path}" class="lp-article-card">
            <div class="lp-article-thumb"><time datetime="${route.datePublished}">${route.readMinutes} min baca</time></div>
            <div class="lp-article-body">
              <h2>${route.cardTitle}</h2>
              <p>${route.cardExcerpt}</p>
              <span class="lp-article-link">Baca artikel</span>
            </div>
          </a>`;
    })
    .join('\n');
}

export function renderPanduanHtml() {
  const route = SEO_ROUTES['/panduan'];
  const itemList = itemListJsonLd();

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${route.title}</title>
  <meta name="description" content="${route.description}">
  <meta name="keywords" content="${route.keywords}">
  <meta name="author" content="KARSA">
  <link rel="canonical" href="${route.canonical}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${route.canonical}">
  <meta property="og:title" content="${route.ogTitle}">
  <meta property="og:description" content="${route.ogDescription}">
  <meta property="og:image" content="${route.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${route.ogImageAlt}">
  <meta property="og:locale" content="id_ID">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${route.ogTitle}">
  <meta name="twitter:description" content="${route.ogDescription}">
  <meta name="twitter:image" content="${route.ogImage}">
  <link rel="alternate" type="application/rss+xml" title="KARSA Panduan" href="${SITE}/feed.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/landing.css?v=mqpuum62">
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: route.title,
    description: route.description,
    url: route.canonical,
    inLanguage: 'id-ID',
    isPartOf: { '@type': 'WebSite', name: 'KARSA', url: SITE },
  }, null, 2).split('\n').map((line) => `  ${line}`).join('\n').trim()}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(itemList, null, 2).split('\n').map((line) => `  ${line}`).join('\n').trim()}
  </script>
</head>
<body class="lp">
  <header class="lp-nav is-scrolled">
    <div class="lp-wrap lp-nav-inner">
      <a href="/" class="lp-brand"><span class="lp-brand-mark"></span>KARSA</a>
      <nav class="lp-nav-links" aria-label="Navigasi">
        <a href="/#fitur">Fitur</a>
        <a href="/panduan" aria-current="page">Panduan</a>
        <a href="/app">App</a>
      </nav>
      <a href="/app" class="lp-btn lp-btn-primary">Mulai gratis</a>
    </div>
  </header>
  <main class="lp-wrap lp-article-page">
    <nav class="lp-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Beranda</a><span aria-hidden="true">/</span>
      <span aria-current="page">Panduan</span>
    </nav>
    <h1>Panduan KARSA</h1>
    <p class="lp-article-meta">Artikel vibecoding, no-code, dan publish untuk UMKM Indonesia</p>
    <div class="lp-articles lp-articles-hub">
${renderPanduanCards()}
    </div>
    <p style="margin-top:48px"><a href="/app" class="lp-btn lp-btn-accent">Mulai gratis di KARSA</a></p>
  </main>
</body>
</html>
`;
}

export function generatePanduan(targetDir = process.cwd()) {
  const outPath = join(targetDir, 'panduan.html');
  writeFileSync(outPath, renderPanduanHtml(), 'utf8');
  return outPath;
}

const isCliEntry =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliEntry) {
  const out = generatePanduan();
  console.log(`✓ panduan.html generated → ${out.replace(process.cwd(), '.')}`);
}