# KARSA Full Workflow Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat workflow KARSA benar-benar menguji alur browser, menutup celah autentikasi endpoint sensitif, dan memastikan dependency serta build dapat direproduksi dari checkout bersih.

**Architecture:** Gunakan satu helper autentikasi server yang memverifikasi Bearer token Supabase dan mengembalikan identitas tepercaya. Klien mengambil access token dari sesi Supabase dan mengirimkannya lewat header; CI memasang Chromium lalu menjalankan browser E2E sebagai tahap wajib.

**Tech Stack:** Vanilla JavaScript, Vercel Functions, Supabase Auth REST API, Vitest, Playwright, GitHub Actions Node.js 20.

## Global Constraints

- Pertahankan kompatibilitas aplikasi statis tanpa build framework.
- Jangan mempercayai `email` atau `userId` dari request body untuk otorisasi.
- Jangan mengubah 13 alur template dan format proyek yang sudah lulus baseline.
- Workflow browser harus gagal, bukan skip sukses, ketika dependency/browser tidak tersedia di CI.

---

### Task 1: Regression guard untuk workflow browser

**Files:**
- Create: `test/workflow-config.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `scripts/browser-e2e.mjs`

**Interfaces:**
- Consumes: script `npm run e2e:browser` yang sudah ada.
- Produces: dependency Playwright terkunci dan job CI yang menginstal Chromium serta menjalankan E2E browser.

- [ ] **Step 1: Tulis test yang mensyaratkan dependency Playwright, `npm ci`, instalasi Chromium, dan eksekusi `e2e:browser` di CI.**
- [ ] **Step 2: Jalankan `npm test -- test/workflow-config.test.mjs` dan pastikan gagal karena kontrak tersebut belum dipenuhi.**
- [ ] **Step 3: Tambahkan Playwright, perbarui workflow CI, dan buat skip browser menjadi error ketika `CI=true`.**
- [ ] **Step 4: Jalankan test khusus hingga lulus.**

### Task 2: Autentikasi server untuk endpoint sensitif

**Files:**
- Create: `lib/supabase-auth.js`
- Create: `test/supabase-auth.test.mjs`
- Modify: `api/admin-analytics.js`
- Modify: `api/superuser-sync.js`
- Modify: `api/verify-license.js`
- Modify: `api/publish.js`

**Interfaces:**
- Produces: `bearerToken(req)`, `userFromRequest(req)`, dan `requireUser(req, res)`; identitas berasal dari `/auth/v1/user` Supabase.
- Consumes: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, dan header `Authorization: Bearer <token>`.

- [ ] **Step 1: Tulis test helper untuk token kosong, skema salah, token valid, dan respons Supabase gagal.**
- [ ] **Step 2: Jalankan test dan pastikan gagal karena helper belum ada.**
- [ ] **Step 3: Implementasikan helper minimal dan jalankan test hingga lulus.**
- [ ] **Step 4: Ganti otorisasi email/userId body pada endpoint sensitif dengan identitas hasil verifikasi token.**
- [ ] **Step 5: Pastikan aktivasi lisensi hanya mengubah user yang memiliki token dan pengecualian watermark superuser memakai email terverifikasi.**

### Task 3: Propagasi sesi dari browser

**Files:**
- Modify: `js/auth.js`
- Modify: `js/admin.js`
- Modify: `js/plan.js`
- Modify: `js/publish.js`

**Interfaces:**
- Produces: `Auth.getAccessToken()` dan `Auth.authHeaders()`.
- Consumes: sesi aktif dari `client.auth.getSession()`.

- [ ] **Step 1: Perbarui test kontrak sumber agar semua panggilan endpoint sensitif mengirim Bearer token dan tidak mengirim identitas otorisasi dari body.**
- [ ] **Step 2: Jalankan test kontrak dan pastikan gagal.**
- [ ] **Step 3: Implementasikan helper header di `Auth` dan gunakan pada admin, superuser, lisensi, serta publish.**
- [ ] **Step 4: Jalankan test khusus dan seluruh unit test.**

### Task 4: Dependency dan verifikasi end-to-end

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: seluruh script npm resmi.
- Produces: dependency audit tanpa advisory yang diketahui dan dokumentasi workflow lengkap.

- [ ] **Step 1: Naikkan Vitest ke versi aman yang kompatibel dan install Chromium Playwright.**
- [ ] **Step 2: Jalankan `npm ci`, `npm audit`, `npm run generate-seo`, `npm run check`, `npm test`, `npm run e2e`, `npm run smoke`, dan `npm run e2e:browser`.**
- [ ] **Step 3: Jalankan `npm run build` dengan commit SHA deterministik lalu pastikan worktree hanya berisi perubahan yang disengaja.**
- [ ] **Step 4: Dokumentasikan perintah workflow dan batasan environment/secrets di README.**

## Self-Review

- Cakupan: baseline, dependency, security, unit, synthetic E2E, smoke HTTP, browser E2E, build, dan dokumentasi tercakup.
- Placeholder: tidak ada langkah TBD/TODO.
- Konsistensi: browser memakai `Auth.authHeaders()`; server selalu memperoleh identitas dari `userFromRequest()`.
