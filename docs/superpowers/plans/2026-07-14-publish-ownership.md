# Publish Ownership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mencegah overwrite slug dan perubahan domain oleh request yang tidak memiliki capability proyek.

**Architecture:** Browser membuat token acak dan menyimpannya bersama metadata publish. Server menyimpan hash token di KV, melakukan claim atomik untuk slug baru, dan memigrasikan slug lama hanya dengan bukti `previousPublishedAt`.

**Tech Stack:** Vanilla JavaScript, Node crypto, Upstash Redis REST, Vitest.

## Global Constraints

- Publish anonim tetap didukung.
- Token mentah tidak boleh masuk KV, log, analytics, atau response.
- URL publish existing tidak berubah.
- Legacy claim wajib cocok dengan metadata `publishedAt`.

---

### Task 1: Capability primitives dan atomic KV claim

**Files:**
- Create: `lib/publish-owner.js`
- Modify: `lib/kv.js`
- Create: `test/publish-owner.test.mjs`

**Interfaces:**
- Produces: `ownerTokenValid(token)`, `hashOwnerToken(token)`, `ownerMatches(token, hash)`, `kvSetNx(key, value)`.

- [ ] **Step 1: Tulis failing tests** untuk token hex 64 karakter, hash SHA-256 deterministik, perbandingan false untuk token salah, dan `kvSetNx` yang membedakan result `OK` dengan `null`.
- [ ] **Step 2: Jalankan** `npm test -- test/publish-owner.test.mjs`; expected FAIL karena module/function belum ada.
- [ ] **Step 3: Implementasikan primitives minimal** memakai `crypto.createHash('sha256')` dan `crypto.timingSafeEqual`; `kvSetNx` mengirim `['SET', key, value, 'NX']`.
- [ ] **Step 4: Jalankan test khusus** sampai seluruh assertion PASS.

### Task 2: Ownership gate sebelum mutasi publish

**Files:**
- Modify: `api/publish.js`
- Modify: `test/publish-owner.test.mjs`

**Interfaces:**
- Consumes: owner helpers dan KV keys `karsa:pub:<slug>:owner|html|meta`.
- Produces: HTTP 400 token malformed, 409 ownership conflict, atau ownership verified sebelum write.

- [ ] **Step 1: Tambahkan source-contract failing test** yang memastikan `authorizePublishOwner()` dipanggil sebelum `kvSet(...:html)` dan previous domain hanya dihapus setelah `kvGet` membuktikan mapping sama dengan slug.
- [ ] **Step 2: Jalankan test** dan pastikan gagal pada source contract.
- [ ] **Step 3: Implementasikan gate**: new slug memakai `SET NX`; owned slug memakai hash compare; legacy slug membaca meta dan mencocokkan `previousPublishedAt` sebelum claim.
- [ ] **Step 4: Pindahkan seluruh validasi domain sebelum write**, dan cek mapping previous domain sebelum `kvDel`.
- [ ] **Step 5: Jalankan test khusus dan seluruh unit test.**

### Task 3: Client capability persistence

**Files:**
- Modify: `js/publish.js`
- Modify: `test/publish-owner.test.mjs`

**Interfaces:**
- Produces: `ensureOwnerToken(project)` menggunakan `crypto.getRandomValues(new Uint8Array(32))` dan body fields `ownerToken`, `previousPublishedAt`.

- [ ] **Step 1: Tambahkan failing source test** untuk token generation, request fields, dan persistence `ownerToken: data.ownerToken || ownerToken`.
- [ ] **Step 2: Jalankan test** dan pastikan gagal.
- [ ] **Step 3: Implementasikan token generation serta persistence** tanpa mengubah dialog publish.
- [ ] **Step 4: Jalankan seluruh test dan `npm run e2e`.**

