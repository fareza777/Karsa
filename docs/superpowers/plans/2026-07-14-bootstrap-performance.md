# Bootstrap Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memparalelkan download script dan menjadikan waktu readiness sebagai regression gate.

**Architecture:** Semua ordered script memakai `defer`, sehingga parsing HTML tidak diblokir dan urutan dependency tetap terjaga. Browser test mengukur readiness aktual, bukan sleep arbitrer.

**Tech Stack:** HTML script loading, Performance API, Playwright/Vitest.

## Global Constraints

- Tidak menambah bundler atau runtime framework.
- Urutan CodeMirror core, modes, addons, dan app scripts tetap sama.
- Offline fallback editor tetap berfungsi.
- Budget readiness lokal maksimum 10.000 ms.

---

### Task 1: Script defer contract

**Files:**
- Modify: `test/workflow-config.test.mjs`
- Modify: `app.html`

**Interfaces:**
- Produces: setiap `<script src="...">` memiliki atribut `defer`; preconnect untuk `cdnjs.cloudflare.com` dan `cdn.jsdelivr.net`.

- [ ] **Step 1: Tulis failing HTML test** yang mengambil semua script source, memastikan jumlahnya lebih dari 20, dan setiap tag mengandung `defer`.
- [ ] **Step 2: Jalankan** `npm test -- test/workflow-config.test.mjs`; expected FAIL pada script pertama tanpa defer.
- [ ] **Step 3: Tambahkan `defer`** ke seluruh ordered external/local scripts tanpa mengubah urutannya, serta dua preconnect di `<head>`.
- [ ] **Step 4: Jalankan test khusus dan syntax check.**

### Task 2: Browser readiness budget

**Files:**
- Modify: `scripts/browser-e2e.mjs`
- Modify: `test/workflow-config.test.mjs`

**Interfaces:**
- Produces: diagnostic `readyMs` dan assertion `readyMs < 10000`.

- [ ] **Step 1: Tambahkan failing source-contract test** yang mensyaratkan `performance.now()`, label `bootstrap siap`, dan budget `10000`.
- [ ] **Step 2: Jalankan test** dan pastikan gagal.
- [ ] **Step 3: Catat waktu sebelum `goto`**, hitung setelah selector readiness, dan panggil `ok(readyMs < 10000, ...)`.
- [ ] **Step 4: Jalankan browser E2E tiga kali** memakai `KARSA_CHROMIUM` dan `CI=true`; seluruh run wajib 20 cek lulus.
- [ ] **Step 5: Jalankan `npm run build` dan `npm run verify`.**

