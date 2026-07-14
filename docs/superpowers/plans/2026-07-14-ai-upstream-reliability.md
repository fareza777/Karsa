# AI Upstream Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghentikan koneksi upstream AI yang macet secara deterministik tanpa kehilangan output parsial.

**Architecture:** Timeout koneksi dan idle reader diekstrak ke helper server yang dapat diuji. Proxy mempertahankan fallback model serta client abort yang sudah ada, tetapi setiap kandidat dan setiap read mempunyai batas waktu sendiri.

**Tech Stack:** Node Fetch/Streams, AbortController, Vitest, SSE.

## Global Constraints

- Connect timeout 25 detik per kandidat model.
- Stream idle timeout 75 detik dari byte upstream terakhir.
- Client disconnect selalu membatalkan upstream.
- Output SSE parsial tidak boleh dibuang.

---

### Task 1: Timeout helpers

**Files:**
- Create: `lib/ai-upstream.js`
- Create: `test/ai-upstream.test.mjs`

**Interfaces:**
- Produces: `fetchWithTimeout(fetchImpl, url, options, timeoutMs, parentSignal)` dan `readWithIdleTimeout(reader, timeoutMs)`.

- [ ] **Step 1: Tulis failing tests** untuk fetch sukses, timeout menghasilkan error code `AI_CONNECT_TIMEOUT`, parent abort menghasilkan `AbortError`, read sukses, dan idle menghasilkan `AI_STREAM_IDLE`.
- [ ] **Step 2: Jalankan** `npm test -- test/ai-upstream.test.mjs`; expected FAIL karena module belum ada.
- [ ] **Step 3: Implementasikan helper minimal** dengan child AbortController, timer yang selalu dibersihkan, listener parent `{ once:true }`, dan `Promise.race` untuk reader.
- [ ] **Step 4: Jalankan test khusus** sampai PASS tanpa timer terbuka.

### Task 2: Integrasi proxy dan final SSE buffer

**Files:**
- Modify: `api/chat.js`
- Modify: `test/ai-upstream.test.mjs`

**Interfaces:**
- Consumes: timeout helpers.
- Produces: fallback pada connect timeout, HTTP 504 setelah kandidat terakhir, structured SSE error saat idle, dan parsing buffer terakhir.

- [ ] **Step 1: Tambahkan source-contract failing tests** untuk penggunaan `fetchWithTimeout`, `readWithIdleTimeout`, guard `upstream.body`, serta `decoder.decode()` flush.
- [ ] **Step 2: Jalankan test** dan pastikan gagal.
- [ ] **Step 3: Ganti fetch kandidat** dengan timeout 25 detik dan bedakan timeout dari disconnect.
- [ ] **Step 4: Ganti `reader.read()`** dengan idle helper 75 detik; saat idle batalkan reader dan upstream, lalu kirim error SSE generik bila response masih writable.
- [ ] **Step 5: Flush decoder dan proses buffer akhir** memakai fungsi parser lokal yang sama dengan baris normal.
- [ ] **Step 6: Jalankan test khusus, syntax check, dan seluruh unit test.**

