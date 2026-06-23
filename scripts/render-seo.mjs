import {
  ARTICLE_PATHS,
  RELATED_ARTICLES,
  SEO_ROUTES,
  SITE,
  articleJsonLd,
  formatIdDate,
} from './seo-routes.mjs';

export function breadcrumbJsonLd(path) {
  const route = SEO_ROUTES[path];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Panduan', item: `${SITE}/panduan` },
      { '@type': 'ListItem', position: 3, name: route.headline, item: route.canonical },
    ],
  };
}

export function renderBreadcrumbNav(path) {
  const route = SEO_ROUTES[path];
  return `<nav class="lp-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Beranda</a><span aria-hidden="true">/</span>
      <a href="/panduan">Panduan</a><span aria-hidden="true">/</span>
      <span aria-current="page">${route.headline}</span>
    </nav>`;
}

export function renderArticleHead(path) {
  const route = SEO_ROUTES[path];
  const jsonLd = articleJsonLd(path);
  const breadcrumb = breadcrumbJsonLd(path);

  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${route.title}</title>
  <meta name="description" content="${route.description}">
  <meta name="keywords" content="${route.keywords}">
  <meta name="author" content="KARSA">
  <link rel="canonical" href="${route.canonical}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${route.canonical}">
  <meta property="og:title" content="${route.ogTitle}">
  <meta property="og:description" content="${route.ogDescription}">
  <meta property="og:image" content="${route.ogImage}">
  <meta property="og:image:secure_url" content="${route.ogImage}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${route.ogImageAlt}">
  <meta property="og:locale" content="id_ID">
  <meta property="article:published_time" content="${route.datePublished}">
  <meta property="article:modified_time" content="${route.dateModified}">
  <meta property="article:section" content="${route.category}">
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
  ${JSON.stringify(jsonLd, null, 2).split('\n').map((line) => `  ${line}`).join('\n').trim()}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumb, null, 2).split('\n').map((line) => `  ${line}`).join('\n').trim()}
  </script>`;
}

export function renderRelatedArticles(path) {
  const related = RELATED_ARTICLES[path] || [];
  if (!related.length) return '';
  const items = related
    .map((rel) => {
      const route = SEO_ROUTES[rel];
      return `        <li><a href="${rel}">${route.cardTitle || route.headline}</a></li>`;
    })
    .join('\n');

  return `    <aside class="lp-article-related" aria-label="Artikel terkait">
      <h2>Baca juga</h2>
      <ul>
${items}
      </ul>
    </aside>`;
}

export function renderArticlePage(path, bodyHtml) {
  const route = SEO_ROUTES[path];
  return `<!DOCTYPE html>
<html lang="id">
<head>
${renderArticleHead(path)}
</head>
<body class="lp">
  <header class="lp-nav is-scrolled">
    <div class="lp-wrap lp-nav-inner">
      <a href="/" class="lp-brand"><span class="lp-brand-mark"></span>KARSA</a>
      <a href="/app" class="lp-btn lp-btn-primary">Mulai gratis</a>
    </div>
  </header>
  <article class="lp-wrap lp-article-page">
${renderBreadcrumbNav(path)}
    <h1>${route.headline}</h1>
    <p class="lp-article-meta">${route.category} · <time datetime="${route.datePublished}">${formatIdDate(route.datePublished)}</time> · ${route.readMinutes} min baca · KARSA</p>
    <div class="lp-prose">
${bodyHtml}
    </div>
${renderRelatedArticles(path)}
    <p style="margin-top:40px"><a href="/panduan" class="lp-article-link">← Semua panduan</a></p>
  </article>
</body>
</html>
`;
}

export function itemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Panduan KARSA',
    itemListElement: ARTICLE_PATHS.map((path, index) => {
      const route = SEO_ROUTES[path];
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: route.canonical,
        name: route.headline,
      };
    }),
  };
}