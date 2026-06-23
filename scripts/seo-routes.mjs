/** Single source of truth for KARSA marketing SEO routes and metadata. */
export const SITE = 'https://karsa.work';

/** @type {string[]} */
export const ARTICLE_PATHS = [
  '/artikel/pembuat-aplikasi-tanpa-coding',
  '/artikel/vibecoding-untuk-umkm',
  '/artikel/cara-publish-website-karsa',
];

/** @type {Record<string, object>} */
export const SEO_ROUTES = {
  '/': {
    ogType: 'website',
    title: 'KARSA — Pembuat Aplikasi & Website dengan AI (Bahasa Indonesia)',
    description:
      'Bikin aplikasi web, landing page UMKM, dan prototype mobile dari browser. AI vibecoding bahasa Indonesia, live preview, publish ke karsa.work. Gratis mulai hari ini.',
    canonical: `${SITE}/`,
    keywords:
      'pembuat aplikasi, vibecoding, no code Indonesia, bikin website UMKM, AI coding bahasa Indonesia, karsa, pembuat website gratis',
    ogTitle: 'KARSA — Dari Ide, Jadi Aplikasi',
    ogDescription: 'Pembuat aplikasi di browser untuk Indonesia. AI, preview langsung, publish satu klik.',
    ogImage: `${SITE}/og.svg`,
    ogImageAlt: 'KARSA — pembuat aplikasi dan website dengan AI vibecoding bahasa Indonesia',
    dateModified: '2026-06-01',
  },
  '/artikel/pembuat-aplikasi-tanpa-coding': {
    ogType: 'article',
    title: 'Pembuat Aplikasi Tanpa Coding untuk Pemula — KARSA',
    description:
      'Panduan pembuat aplikasi tanpa coding: apa itu vibecoding, siapa cocok pakai KARSA, batasan no-code AI, dan kapan perlu developer.',
    canonical: `${SITE}/artikel/pembuat-aplikasi-tanpa-coding`,
    keywords:
      'pembuat aplikasi tanpa coding, no code Indonesia, vibecoding pemula, bikin aplikasi tanpa programming, KARSA',
    headline: 'Pembuat aplikasi tanpa coding: panduan pemula di 2026',
    ogTitle: 'Pembuat Aplikasi Tanpa Coding untuk Pemula',
    ogDescription:
      'Panduan vibecoding untuk pemula: siapa cocok pakai KARSA, batasan AI no-code, dan kapan perlu developer.',
    ogImage: `${SITE}/og/pembuat-aplikasi-tanpa-coding.svg`,
    ogImageAlt: 'Panduan pembuat aplikasi tanpa coding dengan KARSA',
    datePublished: '2026-03-15',
    dateModified: '2026-06-01',
    category: 'Panduan',
    readMinutes: 8,
  },
  '/artikel/vibecoding-untuk-umkm': {
    ogType: 'article',
    title: 'Vibecoding untuk UMKM Indonesia — KARSA',
    description:
      'Cara UMKM pakai vibecoding: katalog online, form pesan, landing page promo, tanpa bayar developer dari nol. Contoh prompt bahasa Indonesia.',
    canonical: `${SITE}/artikel/vibecoding-untuk-umkm`,
    keywords:
      'vibecoding UMKM, katalog online UMKM, landing page warung, bikin website bisnis kecil, AI untuk UMKM Indonesia',
    headline: 'Vibecoding untuk UMKM: dari warung sampai katalog online',
    ogTitle: 'Vibecoding untuk UMKM Indonesia',
    ogDescription:
      'Katalog online, form booking, dan landing page promo untuk UMKM — tanpa bayar developer dari nol.',
    ogImage: `${SITE}/og/vibecoding-untuk-umkm.svg`,
    ogImageAlt: 'Panduan vibecoding untuk UMKM Indonesia dengan KARSA',
    datePublished: '2026-04-02',
    dateModified: '2026-06-01',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/cara-publish-website-karsa': {
    ogType: 'article',
    title: 'Cara Publish Website dari KARSA — Panduan',
    description:
      'Cara publish situs dari KARSA ke subdomain karsa.work atau custom domain. Tips SEO dasar setelah go live.',
    canonical: `${SITE}/artikel/cara-publish-website-karsa`,
    keywords:
      'cara publish website, subdomain gratis, custom domain KARSA, SEO website UMKM, publish karsa.work',
    headline: 'Cara publish website dari KARSA',
    ogTitle: 'Cara Publish Website dari KARSA',
    ogDescription:
      'Publish ke subdomain karsa.work atau domain sendiri, plus tips SEO dasar setelah go live.',
    ogImage: `${SITE}/og/cara-publish-website-karsa.svg`,
    ogImageAlt: 'Panduan publish website dari KARSA ke internet',
    datePublished: '2026-05-10',
    dateModified: '2026-06-01',
    category: 'Publish',
    readMinutes: 5,
  },
};

/** @type {Record<string, string[]>} */
export const RELATED_ARTICLES = {
  '/artikel/pembuat-aplikasi-tanpa-coding': [
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/cara-publish-website-karsa',
  ],
  '/artikel/vibecoding-untuk-umkm': [
    '/artikel/pembuat-aplikasi-tanpa-coding',
    '/artikel/cara-publish-website-karsa',
  ],
  '/artikel/cara-publish-website-karsa': [
    '/artikel/pembuat-aplikasi-tanpa-coding',
    '/artikel/vibecoding-untuk-umkm',
  ],
};

export function articleJsonLd(path) {
  const route = SEO_ROUTES[path];
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: route.headline,
    description: route.description,
    image: route.ogImage,
    datePublished: route.datePublished,
    dateModified: route.dateModified,
    author: { '@type': 'Organization', name: 'KARSA', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'KARSA',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': route.canonical },
    inLanguage: 'id-ID',
    keywords: route.keywords,
  };
}

export function formatIdDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}