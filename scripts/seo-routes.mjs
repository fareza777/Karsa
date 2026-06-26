/** Single source of truth for KARSA marketing SEO routes and metadata. */
export const SITE = 'https://karsa.work';

/** @type {string[]} */
export const ARTICLE_PATHS = [
  '/artikel/pembuat-aplikasi-tanpa-coding',
  '/artikel/vibecoding-untuk-umkm',
  '/artikel/cara-publish-website-karsa',
  '/artikel/apa-itu-vibecoding',
  '/artikel/bikin-landing-page-dengan-ai',
  '/artikel/katalog-produk-online-umkm',
  '/artikel/contoh-prompt-karsa-umkm',
  '/artikel/karsa-vs-website-builder',
];

/** @type {string[]} */
export const HUB_PATHS = ['/panduan'];

/** @type {string[]} */
export const INDEXABLE_PATHS = ['/', ...HUB_PATHS, ...ARTICLE_PATHS];

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
    ogImage: `${SITE}/og/home.png`,
    ogImageAlt: 'KARSA — pembuat aplikasi dan website dengan AI vibecoding bahasa Indonesia',
    dateModified: '2026-06-23',
  },
  '/panduan': {
    ogType: 'website',
    title: 'Panduan KARSA — Artikel Vibecoding & No-Code Indonesia',
    description:
      'Kumpulan panduan KARSA: apa itu vibecoding, pembuat aplikasi tanpa coding, landing page UMKM, dan cara publish website ke internet.',
    canonical: `${SITE}/panduan`,
    keywords:
      'panduan vibecoding, artikel no code Indonesia, tutorial KARSA, bikin website UMKM, pembuat aplikasi AI',
    ogTitle: 'Panduan KARSA — Vibecoding & No-Code',
    ogDescription: 'Artikel dan tutorial untuk mulai vibecoding, bangun landing page, dan publish dengan KARSA.',
    ogImage: `${SITE}/og/panduan.png`,
    ogImageAlt: 'Panduan vibecoding dan no-code dari KARSA',
    dateModified: '2026-06-23',
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
    cardTitle: 'Pembuat aplikasi tanpa coding untuk pemula',
    cardExcerpt: 'Siapa cocok pakai vibecoding, batasannya apa, dan kapan perlu developer sungguhan.',
    ogTitle: 'Pembuat Aplikasi Tanpa Coding untuk Pemula',
    ogDescription:
      'Panduan vibecoding untuk pemula: siapa cocok pakai KARSA, batasan AI no-code, dan kapan perlu developer.',
    ogImage: `${SITE}/og/pembuat-aplikasi-tanpa-coding.png`,
    ogImageAlt: 'Panduan pembuat aplikasi tanpa coding dengan KARSA',
    datePublished: '2026-03-15',
    dateModified: '2026-06-23',
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
    cardTitle: 'Vibecoding untuk UMKM Indonesia',
    cardExcerpt: 'Katalog online, form booking, dan landing page — tanpa bayar developer dari nol.',
    ogTitle: 'Vibecoding untuk UMKM Indonesia',
    ogDescription:
      'Katalog online, form booking, dan landing page promo untuk UMKM — tanpa bayar developer dari nol.',
    ogImage: `${SITE}/og/vibecoding-untuk-umkm.png`,
    ogImageAlt: 'Panduan vibecoding untuk UMKM Indonesia dengan KARSA',
    datePublished: '2026-04-02',
    dateModified: '2026-06-23',
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
    cardTitle: 'Cara publish website dari KARSA',
    cardExcerpt: 'Subdomain gratis, custom domain, dan tips biar situs cepat diindeks Google.',
    ogTitle: 'Cara Publish Website dari KARSA',
    ogDescription:
      'Publish ke subdomain karsa.work atau domain sendiri, plus tips SEO dasar setelah go live.',
    ogImage: `${SITE}/og/cara-publish-website-karsa.png`,
    ogImageAlt: 'Panduan publish website dari KARSA ke internet',
    datePublished: '2026-05-10',
    dateModified: '2026-06-23',
    category: 'Publish',
    readMinutes: 5,
  },
  '/artikel/apa-itu-vibecoding': {
    ogType: 'article',
    title: 'Apa Itu Vibecoding? Penjelasan untuk Pemula — KARSA',
    description:
      'Apa itu vibecoding, bedanya dengan coding biasa dan no-code, kapan cocok dipakai, dan cara mulai dengan KARSA di browser.',
    canonical: `${SITE}/artikel/apa-itu-vibecoding`,
    keywords:
      'apa itu vibecoding, vibecoding adalah, AI coding Indonesia, prompt ke kode, KARSA vibecoding',
    headline: 'Apa itu vibecoding? Penjelasan singkat untuk pemula',
    cardTitle: 'Apa itu vibecoding?',
    cardExcerpt: 'Definisi, perbedaan dengan coding & no-code, dan kapan vibecoding paling cocok.',
    ogTitle: 'Apa Itu Vibecoding? Penjelasan untuk Pemula',
    ogDescription:
      'Pahami vibecoding: deskripsikan ide, AI tulis kode, kamu preview dan iterasi — tanpa install apa pun.',
    ogImage: `${SITE}/og/apa-itu-vibecoding.png`,
    ogImageAlt: 'Penjelasan vibecoding untuk pemula dengan KARSA',
    datePublished: '2026-05-28',
    dateModified: '2026-06-23',
    category: 'Konsep',
    readMinutes: 5,
  },
  '/artikel/bikin-landing-page-dengan-ai': {
    ogType: 'article',
    title: 'Cara Bikin Landing Page dengan AI Tanpa Coding — KARSA',
    description:
      'Cara bikin landing page dengan AI: struktur yang konversi, contoh prompt bahasa Indonesia, iterasi cepat, dan publish ke internet.',
    canonical: `${SITE}/artikel/bikin-landing-page-dengan-ai`,
    keywords:
      'bikin landing page dengan AI, landing page UMKM, prompt landing page, website AI Indonesia, KARSA',
    headline: 'Cara bikin landing page dengan AI tanpa coding',
    cardTitle: 'Bikin landing page dengan AI',
    cardExcerpt: 'Struktur halaman yang konversi, contoh prompt, dan publish satu klik.',
    ogTitle: 'Cara Bikin Landing Page dengan AI',
    ogDescription:
      'Struktur landing page, contoh prompt, iterasi cepat di KARSA, lalu publish ke karsa.work.',
    ogImage: `${SITE}/og/bikin-landing-page-dengan-ai.png`,
    ogImageAlt: 'Panduan bikin landing page dengan AI menggunakan KARSA',
    datePublished: '2026-06-15',
    dateModified: '2026-06-23',
    category: 'Tutorial',
    readMinutes: 7,
  },
  '/artikel/katalog-produk-online-umkm': {
    ogType: 'article',
    title: 'Cara Bikin Katalog Produk Online untuk UMKM — KARSA',
    description:
      'Panduan bikin katalog produk online untuk UMKM: struktur halaman, foto, harga, tombol chat WhatsApp, dan contoh prompt KARSA bahasa Indonesia.',
    canonical: `${SITE}/artikel/katalog-produk-online-umkm`,
    keywords:
      'katalog produk online UMKM, katalog online gratis, katalog WhatsApp, etalase digital UMKM, bikin katalog tanpa coding, KARSA',
    headline: 'Katalog produk online untuk UMKM: dari foto WhatsApp jadi etalase digital',
    cardTitle: 'Katalog produk online UMKM',
    cardExcerpt: 'Struktur katalog, foto, harga, tombol WhatsApp — tanpa bayar developer.',
    ogTitle: 'Katalog Produk Online untuk UMKM',
    ogDescription:
      'Ubah galeri foto WhatsApp jadi katalog online rapi dengan KARSA — prompt bahasa Indonesia, publish gratis.',
    ogImage: `${SITE}/og/katalog-produk-online-umkm.png`,
    ogImageAlt: 'Panduan bikin katalog produk online untuk UMKM dengan KARSA',
    datePublished: '2026-06-23',
    dateModified: '2026-06-23',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/contoh-prompt-karsa-umkm': {
    ogType: 'article',
    title: 'Contoh Prompt KARSA untuk UMKM yang Langsung Jadi Website — KARSA',
    description:
      'Kumpulan contoh prompt KARSA untuk UMKM: katalog, landing promo, form booking, dan toko online. Tinggal salin, ganti detail usahamu, lalu publish.',
    canonical: `${SITE}/artikel/contoh-prompt-karsa-umkm`,
    keywords:
      'contoh prompt KARSA, prompt UMKM Indonesia, prompt vibecoding, prompt bikin website, KARSA contoh prompt',
    headline: 'Contoh prompt KARSA untuk UMKM: tinggal salin, edit, jadi website',
    cardTitle: 'Contoh prompt KARSA untuk UMKM',
    cardExcerpt: 'Lima prompt siap pakai untuk katalog, landing promo, form booking, toko online, dan testimoni.',
    ogTitle: 'Contoh Prompt KARSA untuk UMKM',
    ogDescription:
      'Salin prompt bahasa Indonesia untuk katalog, landing, dan form UMKM — langsung jadi preview di KARSA.',
    ogImage: `${SITE}/og/contoh-prompt-karsa-umkm.png`,
    ogImageAlt: 'Contoh prompt KARSA bahasa Indonesia untuk UMKM',
    datePublished: '2026-06-24',
    dateModified: '2026-06-24',
    category: 'Tutorial',
    readMinutes: 7,
  },
  '/artikel/karsa-vs-website-builder': {
    ogType: 'article',
    title: 'KARSA vs Wix vs WordPress: Pilih yang Tepat untuk Bisnis Kamu — KARSA',
    description:
      'Perbandingan KARSA vs Wix vs WordPress: kemudahan pakai, biaya, fleksibilitas SEO, dan kapan masing-masing paling pas untuk UMKM dan kreator Indonesia.',
    canonical: `${SITE}/artikel/karsa-vs-website-builder`,
    keywords:
      'KARSA vs Wix WordPress, perbandingan website builder, Wix vs WordPress, pembuat website AI, KARSA WordPress Wix',
    headline: 'KARSA vs Wix vs WordPress: mana yang tepat untuk kamu?',
    cardTitle: 'KARSA vs Wix vs WordPress',
    cardExcerpt: 'Bandingkan kemudahan, biaya, dan fleksibilitas SEO tiga platform website populer.',
    ogTitle: 'KARSA vs Wix vs WordPress',
    ogDescription:
      'Tabel perbandingan tiga platform website populer — pilih yang paling pas untuk UMKM atau kreator Indonesia.',
    ogImage: `${SITE}/og/karsa-vs-website-builder.png`,
    ogImageAlt: 'Perbandingan KARSA, Wix, dan WordPress untuk UMKM Indonesia',
    datePublished: '2026-06-26',
    dateModified: '2026-06-26',
    category: 'Panduan',
    readMinutes: 7,
  },
};

/** @type {Record<string, string[]>} */
export const RELATED_ARTICLES = {
  '/artikel/pembuat-aplikasi-tanpa-coding': [
    '/artikel/apa-itu-vibecoding',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
  ],
  '/artikel/vibecoding-untuk-umkm': [
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/pembuat-aplikasi-tanpa-coding',
    '/artikel/cara-publish-website-karsa',
  ],
  '/artikel/cara-publish-website-karsa': [
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/pembuat-aplikasi-tanpa-coding',
  ],
  '/artikel/apa-itu-vibecoding': [
    '/artikel/pembuat-aplikasi-tanpa-coding',
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/vibecoding-untuk-umkm',
  ],
  '/artikel/bikin-landing-page-dengan-ai': [
    '/artikel/cara-publish-website-karsa',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/apa-itu-vibecoding',
  ],
  '/artikel/katalog-produk-online-umkm': [
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/cara-publish-website-karsa',
  ],
  '/artikel/contoh-prompt-karsa-umkm': [
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/katalog-produk-online-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
  ],
  '/artikel/karsa-vs-website-builder': [
    '/artikel/pembuat-aplikasi-tanpa-coding',
    '/artikel/apa-itu-vibecoding',
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
    articleSection: route.category,
  };
}

export function formatIdDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function sortedArticlePaths() {
  return [...ARTICLE_PATHS].sort(
    (a, b) =>
      new Date(SEO_ROUTES[b].datePublished).getTime() -
      new Date(SEO_ROUTES[a].datePublished).getTime()
  );
}