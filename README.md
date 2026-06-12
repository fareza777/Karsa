# ✦ KARSA — Dari Ide, Jadi Aplikasi

**KARSA** (dari bahasa Sanskerta: *kehendak mencipta*) adalah aplikasi pembuat aplikasi
ala Replit yang berjalan **sepenuhnya di browser** — tanpa instalasi, tanpa server,
tanpa akun. Tulis kode HTML/CSS/JavaScript dan lihat hasilnya langsung di panel
live preview.

![KARSA](https://img.shields.io/badge/KARSA-Dari%20Ide%2C%20Jadi%20Aplikasi-7c5cff)

## ✨ Fitur

| Fitur | Keterangan |
|---|---|
| ✨ **KARSA AI (vibecoding)** | Jelaskan idemu dalam bahasa natural — AI menulis file HTML/CSS/JS lengkap, klik **Terapkan** dan preview langsung jalan. Mode ⚡ Cepat / 🧠 Cermat |
| 🖼 **AI bisa melihat gambar** | Tempel (Ctrl+V) screenshot atau lampirkan gambar & file lewat 📎 — dianalisis MiniMax-M3 (vision) |
| 📸 **Screenshot preview** | Tangkap satu layar penuh atau seret untuk area tertentu — unduh PNG atau langsung lampirkan ke chat AI |
| 📁 **Impor folder** | Impor seluruh folder proyek dari komputer (struktur subfolder dipertahankan), selain impor JSON KARSA |
| 🗂️ **Multi-proyek** | Kelola banyak proyek sekaligus — buat, duplikat, ganti nama, hapus |
| 🧩 **8 Template siap pakai** | Landing page, Todo, Kalkulator, Game Ular, Kuis, Portofolio, Dashboard Statistik, atau kosong |
| 📝 **Editor kode profesional** | CodeMirror: syntax highlighting, autocomplete (`Ctrl+Space`), cari dalam file (`Ctrl+F`), toggle komentar (`Ctrl+/`), auto-close bracket & tag, ukuran font bisa diatur |
| 🌲 **File explorer** | Folder bersarang, tab editor, menu klik kanan (rename/duplikat/hapus/unduh) |
| ⚡ **Live preview** | Hasil kode langsung terlihat, auto-refresh saat mengetik, mode layar penuh |
| 📱 **Mode device** | Pratinjau desktop, tablet (768×1024), dan ponsel Android modern (412×915) — frame menskala otomatis agar selalu utuh |
| ⌨ **Console + REPL** | `console.log`, warning, error tampil real-time — plus ketik JavaScript langsung ke preview dengan riwayat perintah |
| 🔗 **Bagikan tautan** | Proyek ter-encode di URL — penerima langsung mendapat salinan lengkap |
| 💾 **Auto-save** | Semua perubahan tersimpan otomatis di browser (localStorage) |
| ⬇️ **Ekspor fleksibel** | ZIP, HTML mandiri satu file, atau JSON (bisa diimpor kembali) |
| 🌙 **Tema gelap & terang** | Satu klik untuk berganti suasana |
| ↔️ **Panel resizable** | Atur lebar sidebar & preview sesuka hati |

## 🚀 Cara Menjalankan

Cukup buka `index.html` di browser modern (Chrome, Edge, Firefox). Selesai!

> Koneksi internet diperlukan untuk memuat editor CodeMirror & JSZip dari CDN.
> Tanpa internet, KARSA tetap berjalan dengan editor sederhana (fallback otomatis).

Atau jalankan lewat server lokal:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

lalu buka `http://localhost:8080`.

## ☁️ Deploy ke Vercel

Repo ini sudah siap deploy — `vercel.json` berisi konfigurasi cache & header keamanan.

```bash
npm i -g vercel
vercel          # deploy preview
vercel --prod   # deploy produksi
```

Atau impor repo GitHub ini langsung di [vercel.com/new](https://vercel.com/new) —
tanpa build command, tanpa output directory (situs statis murni).

## ✨ KARSA AI (Vibecoding)

Panel **✨ AI** di sidebar IDE terhubung ke **MiniMax-M3** lewat fungsi serverless
[`api/chat.js`](api/chat.js). AI menerima seluruh konteks file proyekmu, lalu
membalas dengan file utuh dalam blok kode — satu klik **⚡ Terapkan** menulis
file ke proyek dan memuat ulang preview.

Konfigurasi yang dibutuhkan (sekali saja):

```bash
vercel env add MINIMAX_API_KEY production   # tempel API key MiniMax kamu
vercel deploy --prod
```

> 🔒 API key **tidak pernah** dikirim ke browser — semua permintaan AI melewati
> proxy serverless. Untuk penggunaan lokal tanpa server (file:// atau
> `python -m http.server`), buka ⚙ di panel AI dan isi API key — mode langsung
> ini hanya untuk mesinmu sendiri, jangan dipakai di situs publik.

## ⌨ Shortcut

| Tombol | Aksi |
|---|---|
| `Ctrl + Enter` | Jalankan / muat ulang preview |
| `Ctrl + S` | Simpan (otomatis) + muat ulang preview |
| `Ctrl + Space` | Autocomplete kode |
| `Ctrl + F` | Cari di dalam file |
| `Ctrl + /` | Komentari / batalkan komentar baris |
| `Esc` | Tutup modal / menu / pencarian |
| `↑` / `↓` di console | Riwayat perintah REPL |
| Klik kanan pada file | Menu konteks (rename, duplikat, unduh, hapus) |

## 🏗️ Arsitektur

Vanilla HTML/CSS/JS murni — tanpa framework, tanpa build step.

```
index.html          — kerangka UI (dashboard + IDE)
css/
  base.css          — design tokens, tema gelap/terang
  components.css    — tombol, modal, toast, menu konteks
  dashboard.css     — beranda & galeri template
  ide.css           — layout IDE, editor, preview, console
js/
  utils.js          — helper umum
  storage.js        — persistensi localStorage
  templates.js      — 6 template proyek bawaan
  state.js          — state aplikasi (pola immutable)
  components.js     — toast, modal, menu konteks
  console.js        — panel console (jembatan postMessage)
  preview.js        — bundler in-memory → iframe sandbox
  editor.js         — CodeMirror + fallback textarea
  tabs.js           — bilah tab editor
  filetree.js       — file explorer
  dashboard.js      — beranda & manajemen proyek
  app.js            — bootstrap & event global
```

**Keamanan:** preview berjalan dalam `<iframe sandbox>` tanpa `allow-same-origin`,
sehingga kode pengguna terisolasi dari data KARSA.

## 📄 Lisensi

MIT — bebas digunakan, dimodifikasi, dan disebarkan.

---

Dibuat dengan ❤️ — *KARSA: Dari ide, jadi aplikasi.*
