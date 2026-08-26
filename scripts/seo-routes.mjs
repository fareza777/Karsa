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
  '/artikel/daftar-google-search-console',
  '/artikel/website-warung-makan',
  '/artikel/form-booking-online-umkm',
  '/artikel/custom-domain-karsa',
  '/artikel/prototype-aplikasi-startup',
  '/artikel/seo-website-umkm',
  '/artikel/prompt-landing-page-konversi',
  '/artikel/website-toko-pakaian-thrift',
  '/artikel/katalog-menu-restoran-online',
  '/artikel/landing-page-jasa-freelance',
  '/artikel/website-salon-kecantik',
  '/artikel/katalog-kerajinan-tangan',
  '/artikel/website-rental-mobil',
  '/artikel/landing-page-event',
  '/artikel/form-pendaftaran-seminar',
  '/artikel/website-komunitas-hobi',
  '/artikel/katalog-buku-bekas',
  '/artikel/landing-page-produk-digital',
  '/artikel/website-jasa-konsultan',
  '/artikel/katalog-perlengkapan-bayi',
  '/artikel/website-toko-oleh-oleh',
  '/artikel/website-laundry-sepatu',
  '/artikel/landing-page-preorder',
  '/artikel/katalog-furniture-minimalis',
  '/artikel/website-jasa-fotografi',
  '/artikel/form-survey-pelanggan',
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
  '/artikel/daftar-google-search-console': {
    ogType: 'article',
    title: 'Cara Daftar Google Search Console untuk Website KARSA — Panduan',
    description:
      'Panduan daftar Google Search Console untuk website KARSA: syarat, verifikasi domain, submit sitemap, dan cara pantau performa halaman UMKM di Google.',
    canonical: `${SITE}/artikel/daftar-google-search-console`,
    keywords:
      'daftar Google Search Console, verifikasi Search Console, submit sitemap Google, SEO website UMKM, KARSA',
    headline: 'Cara daftar Google Search Console untuk website KARSA',
    cardTitle: 'Daftar Google Search Console',
    cardExcerpt: 'Syarat, verifikasi domain, submit sitemap, dan cara membaca laporan performa.',
    ogTitle: 'Cara Daftar Google Search Console untuk Website KARSA',
    ogDescription:
      'Step-by-step daftar dan verifikasi Google Search Console untuk website KARSA — cocok untuk UMKM baru go live.',
    ogImage: `${SITE}/og/daftar-google-search-console.png`,
    ogImageAlt: 'Panduan daftar Google Search Console untuk website UMKM dengan KARSA',
    datePublished: '2026-06-29',
    dateModified: '2026-06-29',
    category: 'Tutorial',
    readMinutes: 6,
  },
  '/artikel/website-warung-makan': {
    ogType: 'article',
    title: 'Cara Bikin Website Warung Makan Sederhana dengan AI — KARSA',
    description:
      'Panduan bikin website warung makan sederhana: menu, foto, jam buka, alamat, dan tombol pesan via WhatsApp. Contoh prompt KARSA bahasa Indonesia untuk UMKM.',
    canonical: `${SITE}/artikel/website-warung-makan`,
    keywords:
      'website warung makan, website UMKM kuliner, menu online warung, website resto sederhana, KARSA contoh warung',
    headline: 'Website warung makan sederhana: dari pelanggan lewat jadi pelanggan balik',
    cardTitle: 'Website warung makan sederhana',
    cardExcerpt: 'Menu, foto, jam buka, alamat, tombol WhatsApp — warung kamu punya link permanen.',
    ogTitle: 'Website Warung Makan Sederhana dengan AI',
    ogDescription:
      'Buat website warung makan dalam hitungan menit: menu, foto, alamat, dan tombol pesan via WhatsApp.',
    ogImage: `${SITE}/og/website-warung-makan.png`,
    ogImageAlt: 'Panduan bikin website warung makan sederhana dengan KARSA',
    datePublished: '2026-07-01',
    dateModified: '2026-07-01',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/form-booking-online-umkm': {
    ogType: 'article',
    title: 'Cara Bikin Form Booking Online untuk UMKM dengan AI — KARSA',
    description:
      'Panduan bikin form booking online untuk UMKM: pilih layanan, tanggal, jam, kirim ke WhatsApp owner. Contoh prompt KARSA bahasa Indonesia untuk salon dan rental.',
    canonical: `${SITE}/artikel/form-booking-online-umkm`,
    keywords:
      'form booking online UMKM, form reservasi online, booking salon, form booking rental, form pemesanan jasa, KARSA',
    headline: 'Form booking online untuk UMKM: dari chat berulang jadi link siap kirim',
    cardTitle: 'Form booking online UMKM',
    cardExcerpt: 'Pilih layanan, tanggal, jam — pelanggan isi sendiri, owner terima rapi di WhatsApp.',
    ogTitle: 'Form Booking Online untuk UMKM',
    ogDescription:
      'Bikin form booking dalam hitungan menit: layanan, tanggal, jam, dan notifikasi WhatsApp otomatis ke owner.',
    ogImage: `${SITE}/og/form-booking-online-umkm.png`,
    ogImageAlt: 'Panduan bikin form booking online untuk UMKM dengan KARSA',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/custom-domain-karsa': {
    ogType: 'article',
    title: 'Cara Pasang Custom Domain di KARSA — Panduan UMKM',
    description:
      'Panduan pasang custom domain di KARSA: syarat, catatan DNS, propagasi, dan tips biar situs UMKM tetap cepat diindeks Google.',
    canonical: `${SITE}/artikel/custom-domain-karsa`,
    keywords:
      'custom domain KARSA, pasang domain sendiri, DNS CNAME karsa.work, domain UMKM, KARSA custom domain',
    headline: 'Custom domain di KARSA: pakai nama domain sendiri untuk UMKM',
    cardTitle: 'Custom domain KARSA',
    cardExcerpt: 'Syarat, catatan DNS, dan tips biar situs UMKM pakai domain pribadi tampil profesional.',
    ogTitle: 'Cara Pasang Custom Domain di KARSA',
    ogDescription:
      'Pakai domain sendiri untuk situs KARSA — syarat, langkah DNS, dan tips SEO UMKM Indonesia.',
    ogImage: `${SITE}/og/custom-domain-karsa.png`,
    ogImageAlt: 'Panduan pasang custom domain di KARSA untuk UMKM Indonesia',
    datePublished: '2026-07-06',
    dateModified: '2026-07-06',
    category: 'Publish',
    readMinutes: 6,
  },
  '/artikel/prototype-aplikasi-startup': {
    ogType: 'article',
    title: 'Cara Bikin Prototype Aplikasi Startup dengan AI — KARSA',
    description:
      'Panduan bikin prototype aplikasi startup dengan vibecoding: contoh prompt KARSA, validasi ke pengguna, dan pitch ke investor tanpa keluar biaya besar.',
    canonical: `${SITE}/artikel/prototype-aplikasi-startup`,
    keywords:
      'prototype aplikasi startup, MVP startup Indonesia, vibecoding startup, contoh prompt prototype, validasi ide startup, KARSA founder',
    headline: 'Prototype aplikasi startup: dari ide jadi versi klik-able dalam satu sore',
    cardTitle: 'Prototype aplikasi startup dengan AI',
    cardExcerpt: 'Bikin prototype klik-able, validasi ke pengguna, pitch ke investor — tanpa keluar biaya besar.',
    ogTitle: 'Prototype Aplikasi Startup dengan AI',
    ogDescription:
      'Vibecoding untuk founder: prototype aplikasi startup dalam satu sore, contoh prompt KARSA bahasa Indonesia.',
    ogImage: `${SITE}/og/prototype-aplikasi-startup.png`,
    ogImageAlt: 'Panduan bikin prototype aplikasi startup dengan KARSA vibecoding',
    datePublished: '2026-07-08',
    dateModified: '2026-07-08',
    category: 'Panduan',
    readMinutes: 7,
  },
  '/artikel/seo-website-umkm': {
    ogType: 'article',
    title: 'Panduan SEO Website UMKM untuk Pemula — KARSA',
    description:
      'Panduan SEO website UMKM untuk pemula: riset kata kunci, optimasi judul & meta, kecepatan situs, SEO lokal, sampai submit sitemap ke Google.',
    canonical: `${SITE}/artikel/seo-website-umkm`,
    keywords:
      'SEO website UMKM, optimasi website UMKM, riset kata kunci UMKM, SEO lokal Indonesia, SEO untuk pemula, KARSA',
    headline: 'SEO website UMKM: cara supaya bisnismu ketemu di Google',
    cardTitle: 'SEO website UMKM untuk pemula',
    cardExcerpt: 'Riset kata kunci, optimasi judul & meta, kecepatan situs, sampai submit sitemap ke Google.',
    ogTitle: 'SEO Website UMKM untuk Pemula',
    ogDescription:
      'Supaya website UMKM muncul di Google: riset kata kunci, optimasi judul, kecepatan, dan submit sitemap.',
    ogImage: `${SITE}/og/seo-website-umkm.png`,
    ogImageAlt: 'Panduan SEO website UMKM untuk pemula dengan KARSA',
    datePublished: '2026-07-10',
    dateModified: '2026-07-10',
    category: 'Tutorial',
    readMinutes: 7,
  },
  '/artikel/prompt-landing-page-konversi': {
    ogType: 'article',
    title: 'Prompt Landing Page Konversi Tinggi untuk UMKM — KARSA',
    description:
      'Kumpulan prompt landing page konversi untuk UMKM: struktur hero-hook-CTA terbukti menghasilkan klik, contoh prompt bahasa Indonesia, dan iterasi di KARSA.',
    canonical: `${SITE}/artikel/prompt-landing-page-konversi`,
    keywords:
      'prompt landing page konversi, landing page UMKM, contoh prompt KARSA, prompt landing page, bikin landing page konversi, KARSA',
    headline: 'Prompt landing page konversi: struktur hero-hook-CTA yang menghasilkan klik',
    cardTitle: 'Prompt landing page konversi tinggi',
    cardExcerpt: 'Struktur hero-hook-CTA, contoh prompt bahasa Indonesia, dan iterasi cepat di KARSA sampai klik datang.',
    ogTitle: 'Prompt Landing Page Konversi Tinggi',
    ogDescription:
      'Buat landing page UMKM yang menghasilkan klik: struktur terbukti, contoh prompt bahasa Indonesia, dan iterasi cepat.',
    ogImage: `${SITE}/og/prompt-landing-page-konversi.png`,
    ogImageAlt: 'Panduan prompt landing page konversi tinggi untuk UMKM dengan KARSA',
    datePublished: '2026-07-13',
    dateModified: '2026-07-13',
    category: 'Panduan',
    readMinutes: 7,
  },
  '/artikel/website-toko-pakaian-thrift': {
    ogType: 'article',
    title: 'Cara Bikin Website Toko Pakaian Thrift dengan AI — KARSA',
    description:
      'Panduan bikin website toko pakaian thrift: katalog produk, filter ukuran, harga, dan tombol chat WhatsApp. Contoh prompt KARSA bahasa Indonesia untuk UMKM.',
    canonical: `${SITE}/artikel/website-toko-pakaian-thrift`,
    keywords:
      'website toko thrift, toko pakaian thrift online, katalog thrift shop, jualan thrift online, website baju bekas, KARSA thrift',
    headline: 'Website toko pakaian thrift: dari jualan chat jadi etalase digital',
    cardTitle: 'Website toko pakaian thrift',
    cardExcerpt: 'Katalog thrift, filter ukuran, harga, dan tombol WhatsApp — link permanen untuk jualan baju thrift.',
    ogTitle: 'Website Toko Pakaian Thrift dengan AI',
    ogDescription:
      'Bikin website toko thrift lengkap: katalog, filter ukuran, harga, dan tombol WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/website-toko-pakaian-thrift.png`,
    ogImageAlt: 'Panduan bikin website toko pakaian thrift dengan KARSA',
    datePublished: '2026-07-15',
    dateModified: '2026-07-15',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/katalog-menu-restoran-online': {
    ogType: 'article',
    title: 'Cara Bikin Katalog Menu Restoran Online dengan AI — KARSA',
    description:
      'Panduan bikin katalog menu restoran online: daftar hidangan, foto, harga, tombol pesan via WhatsApp, dan contoh prompt KARSA bahasa Indonesia untuk UMKM kuliner.',
    canonical: `${SITE}/artikel/katalog-menu-restoran-online`,
    keywords:
      'katalog menu restoran online, menu restoran digital, katalog kuliner UMKM, menu online WhatsApp, daftar menu restoran, KARSA resto',
    headline: 'Katalog menu restoran online: dari daftar PDF jadi etalase yang bisa diklik',
    cardTitle: 'Katalog menu restoran online',
    cardExcerpt: 'Daftar hidangan, foto, harga, dan tombol pesan via WhatsApp — link permanen untuk resto dan kafe.',
    ogTitle: 'Katalog Menu Restoran Online dengan AI',
    ogDescription:
      'Ubah daftar menu PDF atau pajangan dinding jadi katalog online rapi dengan KARSA — prompt bahasa Indonesia, publish gratis.',
    ogImage: `${SITE}/og/katalog-menu-restoran-online.png`,
    ogImageAlt: 'Panduan bikin katalog menu restoran online dengan KARSA untuk UMKM kuliner',
    datePublished: '2026-07-17',
    dateModified: '2026-07-17',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/landing-page-jasa-freelance': {
    ogType: 'article',
    title: 'Cara Bikin Landing Page Jasa Freelance dengan AI — KARSA',
    description:
      'Panduan bikin landing page jasa freelance yang meyakinkan: susun portofolio, paket layanan, testimoni, CTA WhatsApp, dan contoh prompt KARSA.',
    canonical: `${SITE}/artikel/landing-page-jasa-freelance`,
    keywords:
      'landing page jasa freelance, website freelancer, portofolio jasa online, landing page freelancer, promosi jasa freelance, KARSA',
    headline: 'Landing page jasa freelance: ubah portofolio jadi mesin pencari klien',
    cardTitle: 'Landing page jasa freelance',
    cardExcerpt: 'Susun portofolio, paket layanan, testimoni, dan CTA WhatsApp dalam satu halaman yang meyakinkan.',
    ogTitle: 'Landing Page Jasa Freelance dengan AI',
    ogDescription:
      'Buat landing page freelance yang menjelaskan keahlian, bukti kerja, paket layanan, dan cara menghubungi kamu.',
    ogImage: `${SITE}/og/landing-page-jasa-freelance.png`,
    ogImageAlt: 'Panduan bikin landing page jasa freelance dengan KARSA',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    category: 'Tutorial',
    readMinutes: 6,
  },
  '/artikel/website-salon-kecantik': {
    ogType: 'article',
    title: 'Cara Bikin Website Salon Kecantikan dengan AI — KARSA',
    description:
      'Panduan bikin website salon kecantikan: layanan, harga, galeri hasil, jam buka, dan tombol booking via WhatsApp. Contoh prompt KARSA untuk UMKM.',
    canonical: `${SITE}/artikel/website-salon-kecantik`,
    keywords:
      'website salon kecantikan, website salon UMKM, booking salon online, katalog layanan salon, galeri salon, KARSA',
    headline: 'Website salon kecantikan: dari pelanggan lewat jadi pelanggan setia',
    cardTitle: 'Website salon kecantikan',
    cardExcerpt: 'Layanan, harga, galeri hasil, dan tombol booking — link permanen untuk salon dan barbershop kecil.',
    ogTitle: 'Website Salon Kecantikan dengan AI',
    ogDescription:
      'Bikin website salon lengkap: layanan, harga, galeri hasil, dan tombol booking via WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/website-salon-kecantik.png`,
    ogImageAlt: 'Panduan bikin website salon kecantikan dengan KARSA untuk UMKM Indonesia',
    datePublished: '2026-07-22',
    dateModified: '2026-07-22',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/katalog-kerajinan-tangan': {
    ogType: 'article',
    title: 'Cara Bikin Katalog Kerajinan Tangan Online dengan AI — KARSA',
    description:
      'Panduan bikin katalog kerajinan tangan online: susun koleksi, cerita produk, harga, opsi custom, foto, dan tombol WhatsApp dengan bantuan KARSA.',
    canonical: `${SITE}/artikel/katalog-kerajinan-tangan`,
    keywords:
      'katalog kerajinan tangan, katalog produk handmade, jual kerajinan online, website produk handmade, katalog UMKM kreatif, KARSA',
    headline: 'Katalog kerajinan tangan online: tampilkan karya dan cerita di satu tempat',
    cardTitle: 'Katalog kerajinan tangan online',
    cardExcerpt: 'Susun koleksi, cerita produk, opsi custom, dan tombol WhatsApp dalam etalase digital yang rapi.',
    ogTitle: 'Katalog Kerajinan Tangan Online dengan AI',
    ogDescription:
      'Buat katalog produk handmade yang menampilkan karya, cerita pembuat, harga, opsi custom, dan cara pesan.',
    ogImage: `${SITE}/og/katalog-kerajinan-tangan.png`,
    ogImageAlt: 'Panduan membuat katalog kerajinan tangan online dengan KARSA untuk UMKM kreatif',
    datePublished: '2026-07-24',
    dateModified: '2026-07-24',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/website-rental-mobil': {
    ogType: 'article',
    title: 'Cara Bikin Website Rental Mobil dengan AI — KARSA',
    description:
      'Panduan bikin website rental mobil: katalog armada, harga harian, syarat sewa, cek ketersediaan, dan tombol booking WhatsApp. Contoh prompt KARSA untuk UMKM.',
    canonical: `${SITE}/artikel/website-rental-mobil`,
    keywords:
      'website rental mobil, rental mobil online, sewa mobil UMKM, booking rental mobil, katalog mobil sewa, KARSA',
    headline: 'Website rental mobil: dari WhatsApp manual jadi sistem booking yang rapi',
    cardTitle: 'Website rental mobil dengan AI',
    cardExcerpt: 'Katalog armada, harga harian, syarat sewa, dan tombol booking WhatsApp untuk rental kecil.',
    ogTitle: 'Website Rental Mobil dengan AI',
    ogDescription:
      'Bikin website rental mobil lengkap: katalog armada, tarif harian, syarat sewa, dan booking WhatsApp otomatis.',
    ogImage: `${SITE}/og/website-rental-mobil.png`,
    ogImageAlt: 'Panduan bikin website rental mobil dengan KARSA untuk UMKM Indonesia',
    datePublished: '2026-07-27',
    dateModified: '2026-07-27',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/landing-page-event': {
    ogType: 'article',
    title: 'Cara Bikin Landing Page Event dengan AI — KARSA',
    description:
      'Panduan bikin landing page event yang menarik peserta: jadwal, pembicara, harga tiket, dan form daftar. Contoh prompt KARSA bahasa Indonesia untuk EO dan komunitas.',
    canonical: `${SITE}/artikel/landing-page-event`,
    keywords:
      'landing page event, landing page acara, halaman pendaftaran event, landing page webinar, landing page seminar, KARSA event',
    headline: 'Landing page event: dari broadcast chat jadi halaman pendaftaran yang rapi',
    cardTitle: 'Landing page event dengan AI',
    cardExcerpt: 'Jadwal, pembicara, harga tiket, dan form daftar dalam satu halaman yang shareable.',
    ogTitle: 'Landing Page Event dengan AI',
    ogDescription:
      'Bikin landing page event lengkap: jadwal, pembicara, harga tiket, form daftar, dan tombol WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/landing-page-event.png`,
    ogImageAlt: 'Panduan bikin landing page event dengan KARSA untuk EO dan komunitas Indonesia',
    datePublished: '2026-07-29',
    dateModified: '2026-07-29',
    category: 'Tutorial',
    readMinutes: 6,
  },
  '/artikel/form-pendaftaran-seminar': {
    ogType: 'article',
    title: 'Cara Bikin Form Pendaftaran Seminar dengan AI — KARSA',
    description:
      'Panduan bikin form pendaftaran seminar dan webinar online: nama, email, nomor WhatsApp, pilih sesi, sampai kirim bukti bayar. Contoh prompt KARSA untuk EO.',
    canonical: `${SITE}/artikel/form-pendaftaran-seminar`,
    keywords:
      'form pendaftaran seminar, form seminar online, form pendaftaran webinar, form EO, halaman seminar, form daftar acara, KARSA',
    headline: 'Form pendaftaran seminar: dari grup WhatsApp jadi halaman daftar yang rapi',
    cardTitle: 'Form pendaftaran seminar dengan AI',
    cardExcerpt: 'Nama, email, pilih sesi, kirim bukti bayar — panitia terima data peserta dalam spreadsheet rapi.',
    ogTitle: 'Form Pendaftaran Seminar dengan AI',
    ogDescription:
      'Bikin form daftar seminar online lengkap: data peserta, pilih sesi, dan notifikasi WhatsApp ke panitia.',
    ogImage: `${SITE}/og/form-pendaftaran-seminar.png`,
    ogImageAlt: 'Panduan bikin form pendaftaran seminar online dengan KARSA untuk EO dan komunitas',
    datePublished: '2026-07-31',
    dateModified: '2026-07-31',
    category: 'Tutorial',
    readMinutes: 6,
  },
  '/artikel/website-komunitas-hobi': {
    ogType: 'article',
    title: 'Cara Bikin Website Komunitas Hobi dengan AI — KARSA',
    description:
      'Panduan bikin website komunitas hobi: halaman anggota, jadwal kopdar, galeri kegiatan, dan form daftar anggota baru. Contoh prompt KARSA bahasa Indonesia.',
    canonical: `${SITE}/artikel/website-komunitas-hobi`,
    keywords:
      'website komunitas, website komunitas hobi, website komunitas Indonesia, komunitas online, buat website komunitas, KARSA komunitas',
    headline: 'Website komunitas hobi: dari grup chat jadi rumah digital bersama',
    cardTitle: 'Website komunitas hobi dengan AI',
    cardExcerpt: 'Halaman anggota, jadwal kopdar, galeri kegiatan, dan form daftar anggota baru dalam satu tempat.',
    ogTitle: 'Website Komunitas Hobi dengan AI',
    ogDescription:
      'Bikin website komunitas lengkap: profil anggota, jadwal kopdar, galeri kegiatan, dan form daftar anggota baru dalam hitungan menit.',
    ogImage: `${SITE}/og/website-komunitas-hobi.png`,
    ogImageAlt: 'Panduan bikin website komunitas hobi dengan KARSA untuk komunitas Indonesia',
    datePublished: '2026-08-03',
    dateModified: '2026-08-03',
    category: 'Panduan',
    readMinutes: 6,
  },
  '/artikel/katalog-buku-bekas': {
    ogType: 'article',
    title: 'Cara Bikin Katalog Buku Bekas Online dengan AI — KARSA',
    description:
      'Panduan bikin katalog buku bekas online untuk seller UMKM: judul, penulis, kondisi, harga, foto cover, dan tombol chat WhatsApp. Contoh prompt KARSA bahasa Indonesia.',
    canonical: `${SITE}/artikel/katalog-buku-bekas`,
    keywords:
      'katalog buku bekas, jual buku bekas online, etalase buku second, toko buku bekas UMKM, katalog online buku, KARSA',
    headline: 'Katalog buku bekas online: dari rak berdebu jadi etalase digital yang laris',
    cardTitle: 'Katalog buku bekas online',
    cardExcerpt: 'Judul, penulis, kondisi, harga, foto cover, dan tombol WhatsApp — link permanen untuk seller buku bekas.',
    ogTitle: 'Katalog Buku Bekas Online dengan AI',
    ogDescription:
      'Bikin katalog buku bekas lengkap: judul, penulis, kondisi, harga, foto cover, dan tombol pesan via WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/katalog-buku-bekas.png`,
    ogImageAlt: 'Panduan bikin katalog buku bekas online untuk UMKM dengan KARSA',
    datePublished: '2026-08-05',
    dateModified: '2026-08-05',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/landing-page-produk-digital': {
    ogType: 'article',
    title: 'Cara Bikin Landing Page Produk Digital dengan AI — KARSA',
    description:
      'Panduan bikin landing page produk digital: ebook, template, course, membership. Struktur yang konversi, contoh prompt KARSA, dan publish cepat untuk kreator Indonesia.',
    canonical: `${SITE}/artikel/landing-page-produk-digital`,
    keywords:
      'landing page produk digital, jual ebook online, jual template digital, halaman jual course, kreator Indonesia digital, KARSA',
    headline: 'Landing page produk digital: dari link chat panjang jadi halaman yang closing',
    cardTitle: 'Landing page produk digital',
    cardExcerpt: 'Ebook, template, course, membership — halaman jual yang jelas, mobile-friendly, dan bisa publish hari ini juga.',
    ogTitle: 'Landing Page Produk Digital dengan AI',
    ogDescription:
      'Bikin landing page untuk ebook, template, course, atau membership dalam hitungan menit — contoh prompt KARSA bahasa Indonesia.',
    ogImage: `${SITE}/og/landing-page-produk-digital.png`,
    ogImageAlt: 'Panduan bikin landing page produk digital dengan KARSA untuk kreator Indonesia',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    category: 'Tutorial',
    readMinutes: 6,
  },
  '/artikel/website-jasa-konsultan': {
    ogType: 'article',
    title: 'Cara Bikin Website Jasa Konsultan dengan AI — KARSA',
    description:
      'Panduan bikin website jasa konsultan profesional: layanan, keahlian, jam konsultasi, CTA booking, dan contoh prompt KARSA bahasa Indonesia untuk UMKM.',
    canonical: `${SITE}/artikel/website-jasa-konsultan`,
    keywords:
      'website jasa konsultan, konsultan profesional Indonesia, landing page konsultan, jasa konsultasi UMKM, website konsultasi bisnis, KARSA konsultan',
    headline: 'Website jasa konsultan: tampilkan keahlian, jadwal, dan cara booking dalam satu halaman',
    cardTitle: 'Website jasa konsultan',
    cardExcerpt: 'Layanan, keahlian, jam konsultasi, dan tombol booking — link permanen untuk konsultan profesional.',
    ogTitle: 'Website Jasa Konsultan dengan AI',
    ogDescription:
      'Bikin website jasa konsultan lengkap: profil ahli, layanan, jam konsultasi, dan tombol booking dalam hitungan menit.',
    ogImage: `${SITE}/og/website-jasa-konsultan.png`,
    ogImageAlt: 'Panduan bikin website jasa konsultan profesional dengan KARSA untuk UMKM Indonesia',
    datePublished: '2026-08-10',
    dateModified: '2026-08-10',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/katalog-perlengkapan-bayi': {
    ogType: 'article',
    title: 'Cara Bikin Katalog Perlengkapan Bayi Online dengan AI — KARSA',
    description:
      'Panduan bikin katalog perlengkapan bayi online untuk UMKM: kategori produk, foto, harga, stok, dan tombol chat WhatsApp. Contoh prompt KARSA bahasa Indonesia.',
    canonical: `${SITE}/artikel/katalog-perlengkapan-bayi`,
    keywords:
      'katalog perlengkapan bayi, etalase produk bayi, toko bayi online, katalog stroller, katalog baju bayi, KARSA baby shop',
    headline: 'Katalog perlengkapan bayi online: dari kiriman chat jadi etalase yang tenang dilihat orang tua',
    cardTitle: 'Katalog perlengkapan bayi online',
    cardExcerpt: 'Kategori produk, foto, harga, stok, dan tombol WhatsApp — link permanen untuk toko bayi dan Mom & Baby shop.',
    ogTitle: 'Katalog Perlengkapan Bayi Online dengan AI',
    ogDescription:
      'Bikin katalog produk bayi lengkap: kategori, foto, harga, stok, dan tombol pesan via WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/katalog-perlengkapan-bayi.png`,
    ogImageAlt: 'Panduan bikin katalog perlengkapan bayi online dengan KARSA untuk UMKM Indonesia',
    datePublished: '2026-08-12',
    dateModified: '2026-08-12',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/website-toko-oleh-oleh': {
    ogType: 'article',
    title: 'Cara Bikin Website Toko Oleh-Oleh dengan AI — KARSA',
    description:
      'Panduan bikin website toko oleh-oleh khas daerah: etalase produk, kategori, harga, dan tombol pesan via WhatsApp. Contoh prompt KARSA bahasa Indonesia untuk UMKM.',
    canonical: `${SITE}/artikel/website-toko-oleh-oleh`,
    keywords:
      'website toko oleh-oleh, oleh-oleh khas daerah, UMKM oleh-oleh, toko oleh-oleh online, katalog oleh-oleh, KARSA UMKM',
    headline: 'Website toko oleh-oleh: dari etalase etalase jadi link permanen untuk pelancong',
    cardTitle: 'Website toko oleh-oleh',
    cardExcerpt: 'Etalase produk khas daerah, kategori, harga, dan tombol WhatsApp untuk traveler dan kirim luar kota.',
    ogTitle: 'Website Toko Oleh-Oleh dengan AI',
    ogDescription:
      'Bikin website toko oleh-oleh lengkap: etalase produk khas, kategori, harga, dan tombol pesan via WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/website-toko-oleh-oleh.png`,
    ogImageAlt: 'Panduan bikin website toko oleh-oleh khas daerah dengan KARSA untuk UMKM Indonesia',
    datePublished: '2026-08-14',
    dateModified: '2026-08-14',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/website-laundry-sepatu': {
    ogType: 'article',
    title: 'Cara Bikin Website Laundry Sepatu dengan AI — KARSA',
    description:
      'Panduan bikin website laundry sepatu: layanan, harga per jenis, cek status cucian, form serah terima, dan tombol WhatsApp. Contoh prompt KARSA UMKM Indonesia.',
    canonical: `${SITE}/artikel/website-laundry-sepatu`,
    keywords:
      'website laundry sepatu, laundry sepatu online, cuci sepatu UMKM, website jasa laundry, website sneaker care, KARSA UMKM',
    headline: 'Website laundry sepatu: dari antrian chat jadi link booking yang rapi',
    cardTitle: 'Website laundry sepatu',
    cardExcerpt: 'Layanan, harga per jenis, status cucian, dan form booking — link permanen untuk bisnis sneaker care.',
    ogTitle: 'Website Laundry Sepatu dengan AI',
    ogDescription:
      'Bikin website laundry sepatu lengkap: layanan, tarif, tracking status, dan tombol booking WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/website-laundry-sepatu.png`,
    ogImageAlt: 'Panduan bikin website laundry sepatu dengan KARSA untuk UMKM Indonesia',
    datePublished: '2026-08-17',
    dateModified: '2026-08-17',
    category: 'Tutorial',
    readMinutes: 6,
  },
  '/artikel/landing-page-preorder': {
    ogType: 'article',
    title: 'Cara Bikin Landing Page Preorder dengan AI — KARSA',
    description:
      'Panduan landing page preorder UMKM: countdown, slot terbatas, harga early bird, dan tips biar pembeli commit checkout. Contoh prompt KARSA bahasa Indonesia.',
    canonical: `${SITE}/artikel/landing-page-preorder`,
    keywords:
      'landing page preorder, preorder UMKM, countdown preorder, halaman pre-order, tips preorder laris, KARSA',
    headline: 'Landing page preorder: dari link chat jadi halaman yang bikin orang commit checkout',
    cardTitle: 'Landing page preorder',
    cardExcerpt: 'Countdown, slot terbatas, harga early bird, dan form pre-order — link permanen untuk jualan pre-order.',
    ogTitle: 'Landing Page Preorder dengan AI',
    ogDescription:
      'Bikin halaman pre-order yang bikin pembeli komitmen: countdown, slot, harga early bird, dan form rapi dalam hitungan menit.',
    ogImage: `${SITE}/og/landing-page-preorder.png`,
    ogImageAlt: 'Panduan bikin landing page preorder dengan KARSA untuk UMKM Indonesia',
    datePublished: '2026-08-19',
    dateModified: '2026-08-19',
    category: 'Tutorial',
    readMinutes: 6,
  },
  '/artikel/katalog-furniture-minimalis': {
    ogType: 'article',
    title: 'Cara Bikin Katalog Furniture Minimalis Online dengan AI — KARSA',
    description:
      'Panduan bikin katalog furniture minimalis online untuk UMKM: foto produk, dimensi, material, harga, dan tombol pesan WhatsApp. Contoh prompt KARSA bahasa Indonesia.',
    canonical: `${SITE}/artikel/katalog-furniture-minimalis`,
    keywords:
      'katalog furniture online, katalog furniture minimalis, jual furniture UMKM, katalog mebel online, etalase furniture, KARSA furniture',
    headline: 'Katalog furniture minimalis online: dari showroom kota jadi etalase yang dicari Google',
    cardTitle: 'Katalog furniture minimalis online',
    cardExcerpt: 'Foto produk, dimensi, material, harga, dan tombol WhatsApp — link permanen untuk UMKM mebel.',
    ogTitle: 'Katalog Furniture Minimalis Online dengan AI',
    ogDescription:
      'Bikin katalog furniture lengkap: foto, dimensi, material, harga, dan tombol pesan WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/katalog-furniture-minimalis.png`,
    ogImageAlt: 'Panduan bikin katalog furniture minimalis online untuk UMKM dengan KARSA',
    datePublished: '2026-08-21',
    dateModified: '2026-08-21',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/website-jasa-fotografi': {
    ogType: 'article',
    title: 'Cara Bikin Website Jasa Fotografi dengan AI — KARSA',
    description:
      'Panduan bikin website jasa fotografi: portofolio, paket layanan, harga, galeri klien, dan tombol booking. Contoh prompt KARSA bahasa Indonesia untuk UMKM.',
    canonical: `${SITE}/artikel/website-jasa-fotografi`,
    keywords:
      'website jasa fotografi, portofolio fotografer, landing page fotografer, jasa foto UMKM, booking fotografer, KARSA fotografer',
    headline: 'Website jasa fotografi: tampilkan portofolio dan cara booking dalam satu halaman',
    cardTitle: 'Website jasa fotografi',
    cardExcerpt: 'Portofolio, paket layanan, harga, dan tombol booking — link permanen untuk fotografer UMKM.',
    ogTitle: 'Website Jasa Fotografi dengan AI',
    ogDescription:
      'Bikin website jasa fotografi lengkap: portofolio, paket layanan, harga, dan tombol booking WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/website-jasa-fotografi.png`,
    ogImageAlt: 'Panduan bikin website jasa fotografi dengan KARSA untuk UMKM Indonesia',
    datePublished: '2026-08-24',
    dateModified: '2026-08-24',
    category: 'UMKM',
    readMinutes: 6,
  },
  '/artikel/form-survey-pelanggan': {
    ogType: 'article',
    title: 'Cara Bikin Form Survey Pelanggan dengan AI — KARSA',
    description:
      'Panduan bikin form survey pelanggan online untuk UMKM: kepuasan, NPS, masukan produk. Contoh prompt KARSA bahasa Indonesia, hasil langsung di spreadsheet.',
    canonical: `${SITE}/artikel/form-survey-pelanggan`,
    keywords:
      'form survey pelanggan, survey kepuasan pelanggan, form NPS UMKM, survey online gratis, kuesioner pelanggan, KARSA form',
    headline: 'Form survey pelanggan: dengar suara pembeli tanpa harus telepon satu-satu',
    cardTitle: 'Form survey pelanggan dengan AI',
    cardExcerpt: 'Kepuasan, NPS, masukan produk — link sekali kirim, hasil langsung rapi untuk UMKM.',
    ogTitle: 'Form Survey Pelanggan dengan AI',
    ogDescription:
      'Bikin form survey kepuasan pelanggan lengkap: skala, pilihan ganda, dan textarea, kirim link via WhatsApp dalam hitungan menit.',
    ogImage: `${SITE}/og/form-survey-pelanggan.png`,
    ogImageAlt: 'Panduan bikin form survey pelanggan untuk UMKM dengan KARSA',
    datePublished: '2026-08-26',
    dateModified: '2026-08-26',
    category: 'Tutorial',
    readMinutes: 6,
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
    '/artikel/daftar-google-search-console',
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
  '/artikel/daftar-google-search-console': [
    '/artikel/cara-publish-website-karsa',
    '/artikel/katalog-produk-online-umkm',
    '/artikel/karsa-vs-website-builder',
  ],
  '/artikel/website-warung-makan': [
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/katalog-produk-online-umkm',
  ],
  '/artikel/form-booking-online-umkm': [
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/contoh-prompt-karsa-umkm',
    '/artikel/website-warung-makan',
  ],
  '/artikel/custom-domain-karsa': [
    '/artikel/cara-publish-website-karsa',
    '/artikel/daftar-google-search-console',
    '/artikel/karsa-vs-website-builder',
  ],
  '/artikel/prototype-aplikasi-startup': [
    '/artikel/apa-itu-vibecoding',
    '/artikel/pembuat-aplikasi-tanpa-coding',
    '/artikel/bikin-landing-page-dengan-ai',
  ],
  '/artikel/seo-website-umkm': [
    '/artikel/daftar-google-search-console',
    '/artikel/cara-publish-website-karsa',
    '/artikel/vibecoding-untuk-umkm',
  ],
  '/artikel/prompt-landing-page-konversi': [
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/contoh-prompt-karsa-umkm',
    '/artikel/seo-website-umkm',
  ],
  '/artikel/website-toko-pakaian-thrift': [
    '/artikel/katalog-produk-online-umkm',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
  ],
  '/artikel/katalog-menu-restoran-online': [
    '/artikel/website-warung-makan',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/katalog-produk-online-umkm',
  ],
  '/artikel/landing-page-jasa-freelance': [
    '/artikel/prompt-landing-page-konversi',
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/seo-website-umkm',
  ],
  '/artikel/website-salon-kecantik': [
    '/artikel/form-booking-online-umkm',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/katalog-produk-online-umkm',
  ],
  '/artikel/katalog-kerajinan-tangan': [
    '/artikel/katalog-produk-online-umkm',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/cara-publish-website-karsa',
  ],
  '/artikel/website-rental-mobil': [
    '/artikel/form-booking-online-umkm',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/katalog-produk-online-umkm',
  ],
  '/artikel/landing-page-event': [
    '/artikel/prompt-landing-page-konversi',
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/form-booking-online-umkm',
  ],
  '/artikel/form-pendaftaran-seminar': [
    '/artikel/landing-page-event',
    '/artikel/prompt-landing-page-konversi',
    '/artikel/form-booking-online-umkm',
  ],
  '/artikel/website-komunitas-hobi': [
    '/artikel/landing-page-event',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/pembuat-aplikasi-tanpa-coding',
  ],
  '/artikel/katalog-buku-bekas': [
    '/artikel/katalog-produk-online-umkm',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/cara-publish-website-karsa',
  ],
  '/artikel/landing-page-produk-digital': [
    '/artikel/prompt-landing-page-konversi',
    '/artikel/bikin-landing-page-dengan-ai',
    '/artikel/landing-page-jasa-freelance',
  ],
  '/artikel/website-jasa-konsultan': [
    '/artikel/landing-page-jasa-freelance',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
  ],
  '/artikel/katalog-perlengkapan-bayi': [
    '/artikel/katalog-produk-online-umkm',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
  ],
  '/artikel/website-toko-oleh-oleh': [
    '/artikel/katalog-produk-online-umkm',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/katalog-kerajinan-tangan',
  ],
  '/artikel/website-laundry-sepatu': [
    '/artikel/form-booking-online-umkm',
    '/artikel/landing-page-jasa-freelance',
    '/artikel/katalog-menu-restoran-online',
  ],
  '/artikel/landing-page-preorder': [
    '/artikel/landing-page-event',
    '/artikel/landing-page-produk-digital',
    '/artikel/prompt-landing-page-konversi',
  ],
  '/artikel/katalog-furniture-minimalis': [
    '/artikel/katalog-produk-online-umkm',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
  ],
  '/artikel/website-jasa-fotografi': [
    '/artikel/landing-page-jasa-freelance',
    '/artikel/vibecoding-untuk-umkm',
    '/artikel/bikin-landing-page-dengan-ai',
  ],
  '/artikel/form-survey-pelanggan': [
    '/artikel/form-pendaftaran-seminar',
    '/artikel/form-booking-online-umkm',
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