# Hermes — Cron Artikel SEO KARSA

> **Dokumen ini adalah instruksi operasional untuk agen Hermes.**
> Baca seluruh file sebelum setiap run. Jangan improvise di luar aturan di sini.

---

## 1. Misi

Buat **1 artikel SEO baru** per run cron, dalam Bahasa Indonesia, terintegrasi ke pipeline SEO KARSA, lalu commit & push ke `main`.

| Item | Nilai |
|------|-------|
| Produk | [KARSA](https://karsa.work) — pembuat aplikasi/website di browser, AI vibecoding Bahasa Indonesia |
| Repo | `https://github.com/fareza777/Karsa` |
| Path lokal | `E:\agents\Karsa` |
| Live domain | `https://karsa.work` |
| Stack | Static HTML + generator Node.js (bukan Next.js/React) |

---

## 2. Jadwal cron

| Setting | Nilai |
|---------|-------|
| Frekuensi | **3 artikel per minggu** |
| Hari | **Senin, Rabu, Jumat** |
| Jam | **10:00 WIB** |
| Cron (WIB) | `0 10 * * 1,3,5` |
| Cron (UTC) | `0 3 * * 1,3,5` |
| Output per run | Tepat **1 artikel baru** |

### Guard: jangan double publish

Sebelum mulai, cek apakah hari ini sudah ada artikel:

```bash
cd E:\agents\Karsa
git pull origin main
git log --oneline --since="20 hours ago" --grep="feat(artikel)"
```

Jika ada hasil → **STOP**. Laporkan: *"Artikel hari ini sudah dipublish."*

---

## 3. Artikel yang sudah ada

Baca `scripts/seo-routes.mjs` → array `ARTICLE_PATHS` adalah sumber kebenaran terbaru.

Per 23 Juni 2026, artikel existing:

| # | Slug | Judul |
|---|------|-------|
| 1 | `pembuat-aplikasi-tanpa-coding` | Pembuat aplikasi tanpa coding untuk pemula |
| 2 | `vibecoding-untuk-umkm` | Vibecoding untuk UMKM Indonesia |
| 3 | `cara-publish-website-karsa` | Cara publish website dari KARSA |
| 4 | `apa-itu-vibecoding` | Apa itu vibecoding? |
| 5 | `bikin-landing-page-dengan-ai` | Cara bikin landing page dengan AI |

**Jangan duplikat** slug, judul, atau keyword utama yang sudah dipakai.

---

## 4. Backlog topik

Ambil **item pertama** yang belum ada di `ARTICLE_PATHS`. Tandai selesai setelah publish.

### Fase 1 — Backlog utama

| Prioritas | Slug | Keyword utama | Kategori |
|-----------|------|---------------|----------|
| 1 | `katalog-produk-online-umkm` | katalog produk online UMKM | UMKM |
| 2 | `contoh-prompt-karsa-umkm` | contoh prompt KARSA | Tutorial |
| 3 | `karsa-vs-website-builder` | KARSA vs Wix WordPress | Panduan |
| 4 | `daftar-google-search-console` | daftar Google Search Console | Tutorial |
| 5 | `website-warung-makan` | website warung makan | UMKM |
| 6 | `form-booking-online-umkm` | form booking online UMKM | UMKM |
| 7 | `custom-domain-karsa` | custom domain KARSA | Publish |
| 8 | `prototype-aplikasi-startup` | prototype aplikasi startup | Panduan |
| 9 | `seo-website-umkm` | SEO website UMKM | Tutorial |
| 10 | `prompt-landing-page-konversi` | prompt landing page konversi | Tutorial |
| 11 | `website-toko-pakaian-thrift` | website toko thrift | UMKM |
| 12 | `katalog-menu-restoran-online` | katalog menu restoran online | UMKM |
| 13 | `landing-page-jasa-freelance` | landing page jasa freelance | Tutorial |
| 14 | `website-salon-kecantikan` | website salon kecantikan | UMKM |
| 15 | `katalog-kerajinan-tangan` | katalog kerajinan tangan | UMKM |
| 16 | `website-rental-mobil` | website rental mobil | UMKM |
| 17 | `landing-page-event` | landing page event | Tutorial |
| 18 | `form-pendaftaran-seminar` | form pendaftaran seminar | Tutorial |
| 19 | `website-komunitas-hobi` | website komunitas | Panduan |
| 20 | `katalog-buku-bekas` | katalog buku bekas | UMKM |
| 21 | `landing-page-produk-digital` | landing page produk digital | Tutorial |
| 22 | `website-jasa-konsultan` | website jasa konsultan | UMKM |
| 23 | `katalog-perlengkapan-bayi` | katalog perlengkapan bayi | UMKM |
| 24 | `website-toko-oleh-oleh` | website toko oleh-oleh | UMKM |
| 25 | `landing-page-preorder` | landing page preorder | Tutorial |
| 26 | `katalog-furniture-minimalis` | katalog furniture online | UMKM |
| 27 | `website-jasa-fotografi` | website jasa fotografi | UMKM |
| 28 | `form-survey-pelanggan` | form survey pelanggan | Tutorial |
| 29 | `website-portfolio-mahasiswa` | website portfolio mahasiswa | Panduan |
| 30 | `landing-page-produk-herbal` | landing page produk herbal | UMKM |

### Fase 2 — Auto-generate (setelah fase 1 habis)

Formula topik baru:

```
{jenis bisnis UMKM Indonesia} + {fitur KARSA}
```

Contoh:
- `website-toko-kue-tradisional`
- `katalog-produk-petani-lokal`
- `form-reservasi-klinik-kecil`

Validasi sebelum tulis:
- [ ] Relevan dengan fitur KARSA (vibecoding, publish, UMKM, no-code)
- [ ] Keyword masuk akal untuk pencarian Google Indonesia
- [ ] Slug belum ada di `ARTICLE_PATHS`
- [ ] Keyword utama tidak overlap >50% dengan 15 artikel terakhir

---

## 5. Standar konten

| Kriteria | Wajib |
|----------|-------|
| Bahasa | Indonesia, ramah UMKM & pemula |
| Panjang | **650–900 kata** (hitung teks, bukan HTML tags) |
| Struktur | Intro + **minimal 4× `<h2>`** + list jika relevan |
| Contoh prompt | **Minimal 1** prompt KARSA dalam `<em>"..."</em>` |
| CTA | 1× link `/app` + **2×** internal link ke artikel lain |
| Tone | Edukatif, bukan salesy |
| Slug | lowercase, hyphen, tanpa angka: `nama-slug` |
| Kategori | Salah satu: `Panduan` · `UMKM` · `Tutorial` · `Konsep` · `Publish` |
| readMinutes | 5–8 (sesuaikan panjang) |

### Rotasi kategori (bergiliran)

Gunakan kategori yang **paling jarang** muncul di 5 artikel terakhir. Prioritas: variasi, bukan random.

### Yang dilarang

- Artikel di bawah 500 kata
- Keyword stuffing / clickbait
- Topik tidak relevan (crypto, politik, agama, dll.)
- Duplikat slug atau topik
- Edit file `artikel/*.html` secara manual
- Push jika test gagal
- Hardcode secret / API key

---

## 6. Workflow teknis

### Langkah 0 — Sync

```bash
cd E:\agents\Karsa
git pull origin main
```

### Langkah 1 — Pilih topik

1. Baca `scripts/seo-routes.mjs` → `ARTICLE_PATHS`
2. Ambil topik pertama dari backlog yang belum ada
3. Catat: slug, keyword utama, kategori

### Langkah 2 — Edit `scripts/seo-routes.mjs`

**a) Tambahkan slug ke `ARTICLE_PATHS`:**

```js
export const ARTICLE_PATHS = [
  // ... existing ...
  '/artikel/{slug-baru}',
];
```

**b) Tambahkan entry di `SEO_ROUTES`:**

```js
'/artikel/{slug}': {
  ogType: 'article',
  title: '{Title Lengkap} — KARSA',
  description: '{meta description 140–160 karakter, mengandung keyword utama}',
  canonical: `${SITE}/artikel/{slug}`,
  keywords: '{keyword1, keyword2, keyword3, KARSA}',
  headline: '{H1 — tanpa suffix KARSA}',
  cardTitle: '{judul pendek untuk kartu}',
  cardExcerpt: '{1 kalimat ringkas}',
  ogTitle: '{judul untuk share sosmed}',
  ogDescription: '{deskripsi share 1–2 kalimat}',
  ogImage: `${SITE}/og/{slug}.png`,
  ogImageAlt: '{deskripsi gambar OG}',
  datePublished: '{YYYY-MM-DD hari ini}',
  dateModified: '{YYYY-MM-DD hari ini}',
  category: '{Panduan|UMKM|Tutorial|Konsep|Publish}',
  readMinutes: {5-8},
},
```

**c) Update `RELATED_ARTICLES`:**

- Tambahkan entry untuk artikel baru (3 link ke artikel terkait)
- Opsional: update artikel lama agar link balik ke artikel baru

### Langkah 3 — Edit `scripts/article-content.mjs`

Tambahkan body HTML di `ARTICLE_BODY`:

```js
'{slug}': `
      <p>{hook — masalah pembaca}</p>
      <h2>{subtopik 1}</h2>
      <p>...</p>
      <h2>{subtopik 2}</h2>
      <p><em>"{contoh prompt KARSA bahasa Indonesia}"</em></p>
      <h2>{subtopik 3}</h2>
      <ul><li>...</li></ul>
      <h2>{subtopik 4}</h2>
      <p>...</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>... <a href="/artikel/{slug-terkait}">...</a></p>`,
```

**Penting:** Hanya inner prose — tanpa `<html>`, `<head>`, `<h1>`, `<article>`. File `artikel/*.html` di-generate otomatis.

### Langkah 4 — Generate & test

```bash
npm install
npm run generate-seo
npm test
```

`npm run generate-seo` menjalankan:
- OG images (SVG + PNG)
- Generate `artikel/*.html`
- Generate `panduan.html`
- Update `sitemap.xml`, `feed.xml`, `llms.txt`

**Semua test harus pass.** Jika gagal → perbaiki, jangan push.

### Langkah 5 — Quality gate (cek manual)

- [ ] Body ≥ 650 kata
- [ ] ≥ 4 `<h2>`
- [ ] ≥ 1 contoh prompt dalam `<em>`
- [ ] Link `/app` + 2 internal link
- [ ] Keyword unik vs 15 artikel terakhir
- [ ] `npm test` 100% pass
- [ ] `og/{slug}.png` ada di disk

Jika satu saja gagal → **abort, jangan push**.

### Langkah 6 — Commit & push

```bash
git add -A
git commit -m "feat(artikel): {judul singkat artikel}"
git push origin main
```

Format commit: `feat(artikel): ...` — wajib prefix ini agar guard harian berfungsi.

---

## 7. Struktur file repo (referensi)

```
Karsa/
├── docs/
│   └── hermes-cron-artikel.md    ← file ini
├── scripts/
│   ├── seo-routes.mjs            ← metadata + daftar artikel (EDIT)
│   ├── article-content.mjs       ← body artikel (EDIT)
│   ├── generate-articles.mjs     ← generator HTML (jangan edit)
│   ├── generate-og-images.mjs
│   ├── generate-panduan.mjs
│   ├── generate-sitemap.mjs
│   ├── generate-feed.mjs
│   └── generate-llms.mjs
├── artikel/
│   └── {slug}.html               ← AUTO-GENERATED, jangan edit manual
├── panduan.html                  ← AUTO-GENERATED
├── sitemap.xml                   ← AUTO-GENERATED
├── feed.xml                      ← AUTO-GENERATED
├── llms.txt                      ← AUTO-GENERATED
└── og/
    └── {slug}.png                ← AUTO-GENERATED
```

---

## 8. Konteks produk (untuk akurasi tulisan)

Gunakan fakta ini — jangan mengarang fitur:

| Fitur | Detail |
|-------|--------|
| Core | Pembuat aplikasi/website di browser, AI vibecoding Bahasa Indonesia |
| Preview | Live preview langsung di browser |
| Publish | Ke `{slug}.karsa.work` atau custom domain |
| Gratis | 30 prompt AI/hari, proyek unlimited |
| Pro | AI tanpa limit, publish tanpa watermark |
| Stack output | HTML, CSS, JavaScript sungguhan (bisa diedit & export) |
| Noindex | `/app`, `/admin`, `/api/` — jangan link sebagai konten SEO |
| Hub artikel | `https://karsa.work/panduan` |

---

## 9. Template laporan (wajib output ke user)

Setelah setiap run sukses, kirim laporan:

```
📅 {tanggal} ({Senin|Rabu|Jumat})
✅ Artikel baru: https://karsa.work/artikel/{slug}
📝 Judul: {headline}
🔑 Keyword: {keyword utama}
📊 {N} kata | {readMinutes} min baca | Kategori: {category}
🔗 Related: {slug1}, {slug2}, {slug3}
🧪 Tests: {N}/{N} pass
📦 Commit: {hash}
📚 Sisa backlog fase 1: {N} topik
🗺️ Sitemap: {total URL} URL
```

Jika abort:

```
⛔ Run dibatalkan — {tanggal}
❌ Alasan: {test gagal / duplikat / quality gate / dll.}
📋 Topik yang direncanakan: {slug}
🔧 Tindakan: {apa yang perlu diperbaiki}
```

---

## 10. Success criteria

Semua harus ✅ sebelum run dianggap sukses:

- [ ] 1 artikel baru di `ARTICLE_PATHS`
- [ ] Body di `article-content.mjs`
- [ ] `npm run generate-seo` tanpa error
- [ ] `npm test` 100% pass
- [ ] `og/{slug}.png` ter-generate
- [ ] `sitemap.xml` bertambah 1 URL
- [ ] `feed.xml` & `llms.txt` ter-update
- [ ] Committed & pushed ke `main`
- [ ] Laporan terkirim ke user

---

## 11. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `npm test` gagal | Baca error, perbaiki `seo-routes.mjs` atau `article-content.mjs`, re-run |
| Slug duplikat | Pilih topik backlog berikutnya |
| Artikel terlalu pendek | Tambah `<h2>` + contoh + tips praktis |
| `sharp` gagal install | `npm install sharp --force`, retry generate |
| Git push rejected | `git pull --rebase origin main`, resolve conflict, push lagi |
| Backlog habis | Aktifkan fase 2 auto-generate (bagian 4) |

---

## 12. Override manual

Jika user memberi topik spesifik, abaikan backlog dan pakai topik user:

> "Jalankan cron artikel KARSA. Topik: `website-toko-kue`"

Validasi tetap berlaku (slug unik, quality gate, test pass).

---

*Terakhir diperbarui: 23 Juni 2026 — frekuensi 3×/minggu (Sen, Rab, Jum).*