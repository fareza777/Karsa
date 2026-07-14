# KARSA Security, Reliability, and Performance Design

## Objective

Menutup overwrite publish tanpa izin, membuat proxy AI berhenti secara terkendali saat upstream macet, dan mempercepat bootstrap aplikasi tanpa mengubah arsitektur vanilla JavaScript atau mewajibkan login.

## Scope and Order

Pekerjaan dibagi menjadi tiga fase yang dapat diuji dan ditolak secara independen:

1. Publish ownership dan konsistensi domain.
2. Timeout serta parsing stream AI.
3. Bootstrap script dan regression timing.

Urutan ini mendahulukan integritas data pengguna, kemudian availability layanan berbiaya, lalu waktu interaksi UI.

## Approaches Considered

### Selected: backward-compatible capability ownership

Setiap proyek membuat owner token acak 256-bit. Browser menyimpan token mentah di `project.publish`; server hanya menyimpan hash SHA-256. Publish pertama mengklaim slug secara atomik. Publish berikutnya harus membuktikan token yang sama.

Kelebihan pendekatan ini adalah publish anonim tetap berfungsi dan tidak membutuhkan tabel akun baru. Kekurangannya adalah token harus tetap ikut saat proyek diekspor atau disinkronkan agar pemilik dapat memperbarui slug dari perangkat lain.

### Rejected: require login for every publish

Kepemilikan dapat memakai Supabase user ID dan implementasinya lebih sederhana, tetapi ini mematahkan janji aplikasi tanpa akun serta membuat proyek tamu lama tidak dapat diperbarui.

### Rejected: platform/bundler rewrite

Memindahkan aplikasi ke framework dan bundler memungkinkan code splitting dan middleware terpusat. Risiko migrasi terhadap editor, preview sandbox, template, serta ekspor terlalu besar untuk putaran stabilisasi ini.

## Publish Ownership

### New slug

Browser menghasilkan token dengan Web Crypto sebelum request pertama. Server memvalidasi semua input, lalu memakai Redis `SET ... NX` untuk mengklaim `karsa:pub:<slug>:owner` dengan hash token. Hanya pemenang klaim yang boleh menulis HTML, metadata, dan domain.

### Existing owned slug

Server membandingkan hash token menggunakan perbandingan konstan. Token mentah tidak ditulis ke KV, log, respons, atau analytics.

### Legacy slug migration

Proyek lama sudah menyimpan `publishedAt` dari respons publish. Jika slug memiliki HTML tetapi belum memiliki owner hash, server hanya mengizinkan klaim bila `previousPublishedAt` sama persis dengan metadata KV. Request tanpa bukti menerima HTTP 409 dan diarahkan memilih slug baru atau memakai proyek asli.

### Domain safety

Semua domain divalidasi sebelum mutasi. Previous domain hanya dihapus bila mapping KV masih menunjuk ke slug yang sedang di-update. Perubahan domain dan HTML dijalankan setelah ownership lolos.

### Client persistence

`ownerToken` dan `publishedAt` disimpan di `project.publish`, sehingga ikut mekanisme storage, cloud sync, JSON export, dan import yang sudah menyimpan object publish.

## AI Upstream Reliability

Helper server baru menyediakan dua operasi yang dapat diuji:

- fetch upstream dengan timeout koneksi per kandidat model;
- reader dengan idle timeout yang membatalkan upstream.

Timeout koneksi adalah 25 detik per model. Idle stream adalah 75 detik sejak byte upstream terakhir. Client disconnect tetap menjadi sinyal pembatalan utama. Heartbeat ke browser tidak memperpanjang idle upstream.

Jika upstream selesai tanpa newline terakhir, decoder dan buffer akhir tetap diproses. Respons sukses tanpa body diperlakukan sebagai upstream error. Error publik tidak menyertakan stack, key, atau body upstream penuh.

Mekanisme retry client, fallback model, truncation detection, dan continuation yang sudah ada tetap dipertahankan.

## Bootstrap Performance

Semua `<script src>` pada `app.html` memakai `defer`. Browser dapat mengunduh CodeMirror, addon, JSZip, Supabase, dan sumber lokal secara paralel sambil mempertahankan urutan eksekusi dokumen. `DOMContentLoaded` tetap menjadi batas aman inisialisasi.

Preconnect ditambahkan untuk CDN yang dipakai. Browser E2E mencatat waktu dari navigation start sampai `data-karsa-ready=true`, memastikan tombol utama tidak aktif sebelum siap, dan menetapkan budget lokal 10 detik agar regresi besar gagal di CI.

Perubahan ini tidak mengubah fallback editor ketika CDN gagal dan tidak menambah bundler atau build runtime.

## Error Handling

- Ownership gagal: HTTP 409 tanpa mutasi publish.
- Token malformed: HTTP 400.
- KV gagal: HTTP 502 dan tidak menganggap ownership berhasil.
- Upstream connect timeout: kandidat model berikutnya dicoba; kandidat terakhir menghasilkan 504.
- Stream idle setelah output parsial: stream ditutup dengan error SSE terstruktur agar client menawarkan continuation.
- Stream idle tanpa output: error ramah untuk retry.

## Testing

- Unit test token generation format, hashing, constant-time verification, legacy claim, dan `SET NX`.
- Handler/source regression memastikan ownership dicek sebelum write dan previous domain tidak dihapus secara buta.
- Unit test connect timeout, idle timeout, abort propagation, serta final SSE buffer.
- HTML regression memastikan semua script source memakai `defer`.
- Browser E2E mempertahankan 19 alur existing dan menambah budget bootstrap.
- Gate akhir: `npm ci`, `npm audit`, `npm run build`, dan `npm run verify`.

## Compatibility and Rollout

Tidak ada perubahan URL publik atau format file proyek selain field tambahan `ownerToken`. Slug baru langsung terlindungi. Slug lama diklaim saat publish berikutnya dari proyek asli. Bila project state lama tidak memiliki `publishedAt`, pengguna harus memilih slug baru; server tidak melakukan migrasi permisif yang dapat direbut penyerang.
