/** Article body HTML (prose inner content only). */
export const ARTICLE_BODY = {
  'pembuat-aplikasi-tanpa-coding': `
      <p>Banyak orang ingin punya aplikasi atau website untuk bisnis, tapi terhenti di coding. Pembuat aplikasi tanpa coding — atau <em>vibecoding</em> dengan AI — mengisi celah itu: kamu menjelaskan ide, mesin menulis kode, kamu menguji hasilnya.</p>
      <h2>Apa bedanya dengan website builder biasa?</h2>
      <p>Website builder drag-and-drop (Wix, dll.) bagus untuk halaman statis. KARSA cocok kalau kamu butuh logika: keranjang sederhana, form booking, kalkulator, dashboard kecil. AI menghasilkan kode sungguhan (HTML, CSS, JavaScript) yang bisa kamu edit dan export.</p>
      <h2>Siapa yang cocok?</h2>
      <ul>
        <li>UMKM yang mau katalog atau landing page cepat</li>
        <li>Mahasiswa atau pelajar yang belajar produk digital</li>
        <li>Founder yang mau prototype sebelum hire developer</li>
        <li>Freelancer yang sering bikin mockup interaktif untuk klien</li>
      </ul>
      <h2>Batasan yang perlu kamu tahu</h2>
      <p>AI belum menggantikan arsitek sistem untuk aplikasi besar (ribuan user, payment kompleks, compliance ketat). Untuk MVP dan tools internal, vibecoding sudah sangat produktif. Review kode penting untuk keamanan jika menangani data sensitif.</p>
      <h2>Mulai dari mana?</h2>
      <p>Baca <a href="/artikel/apa-itu-vibecoding">apa itu vibecoding</a> kalau istilahnya masih asing. Lalu buka <a href="/app">KARSA</a>, buat proyek web, dan coba prompt: <em>"landing page warung makan dengan menu dan tombol WhatsApp"</em>. Lihat preview, minta revisi, lalu <a href="/artikel/cara-publish-website-karsa">publish</a>.</p>`,
  'vibecoding-untuk-umkm': `
      <p>UMKM di Indonesia sering mengandalkan WhatsApp dan Instagram. Langkah berikutnya adalah aset digital yang kamu kontrol: website dengan domain atau link tetap, bukan hanya story yang hilang setelah 24 jam.</p>
      <h2>Use case yang paling sering</h2>
      <ul>
        <li><strong>Katalog produk</strong> — foto, harga, tombol chat</li>
        <li><strong>Landing promo</strong> — diskon Lebaran, menu baru</li>
        <li><strong>Form booking</strong> — salon, rental, jasa</li>
        <li><strong>Kasir sederhana</strong> — prototype sebelum app sungguhan</li>
      </ul>
      <h2>Contoh prompt yang works</h2>
      <p>Gunakan bahasa Indonesia konkret: nama bisnis, warna, dan fitur wajib. Misalnya: <em>"Buat katalog thrift shop dengan grid produk, filter ukuran, dan floating button WhatsApp ke 0812xxx"</em>.</p>
      <h2>Budget vs hire developer</h2>
      <p>Developer freelance untuk landing custom bisa Rp 2–15 juta. Vibecoding di KARSA gratis untuk mulai; kamu bayar waktu sendiri dan (opsional) Pro kalau butuh AI lebih banyak. Untuk validasi ide, ini paling efisien.</p>
      <h2>Langkah publish</h2>
      <p>Setelah puas dengan preview, publish ke <code>namabisnis.karsa.work</code> atau domain sendiri. Panduan lengkap ada di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>.</p>
      <p><a href="/app">Coba KARSA gratis →</a></p>`,
  'cara-publish-website-karsa': `
      <p>Setelah proyek web siap di preview, KARSA bisa mempublikasikannya ke internet tanpa upload manual ke hosting.</p>
      <h2>Publish ke subdomain KARSA</h2>
      <ol style="margin:0 0 1.25em 1.25em">
        <li>Buka proyek di <a href="/app">app KARSA</a></li>
        <li>Klik tombol Publish di toolbar</li>
        <li>Pilih slug unik, misalnya <code>warung-bu-ani</code></li>
        <li>Situs live di <code>warung-bu-ani.karsa.work</code></li>
      </ol>
      <h2>Custom domain</h2>
      <p>Di modal publish, tambahkan domain kamu (mis. <code>www.tokoku.com</code>). KARSA memberi instruksi DNS CNAME. Setelah propagate, situs sama bisa diakses dari domain sendiri.</p>
      <h2>SEO setelah publish</h2>
      <ul>
        <li>Pastikan setiap halaman punya <code>&lt;title&gt;</code> dan meta description</li>
        <li>Daftarkan URL ke Google Search Console</li>
        <li>Bagikan link di media sosial untuk sinyal awal</li>
        <li>Paket gratis menampilkan footer KARSA — hilangkan dengan Pro</li>
      </ul>
      <h2>Update konten</h2>
      <p>Edit di KARSA, publish ulang dengan slug yang sama. Konten di KV akan diganti — tidak perlu FTP atau cPanel.</p>`,
  'apa-itu-vibecoding': `
      <p><em>Vibecoding</em> adalah cara membangun aplikasi dengan mendeskripsikan apa yang kamu mau — dalam bahasa manusia — lalu AI menulis kodenya. Kamu fokus pada ide dan hasil; mesin yang mengetik HTML, CSS, dan JavaScript.</p>
      <h2>Dari mana istilah ini?</h2>
      <p>Konsep dipopulerkan developer yang menemukan produktivitas meledak saat "ngobrol" dengan AI untuk menghasilkan kode. Di Indonesia, istilah ini merujuk pada alur serupa: jelaskan vibe produk, dapatkan prototype cepat, iterasi sampai pas.</p>
      <h2>Bedanya dengan coding biasa</h2>
      <ul>
        <li><strong>Coding tradisional</strong> — kamu menulis setiap baris, paham syntax &amp; framework</li>
        <li><strong>No-code drag-drop</strong> — template visual, minim kustomisasi logika</li>
        <li><strong>Vibecoding</strong> — prompt + preview + edit kode sungguhan bila perlu</li>
      </ul>
      <h2>Kapan vibecoding cocok?</h2>
      <p>Landing page, katalog UMKM, form booking, dashboard internal, prototype startup — semua ini bisa selesai dalam hitungan jam. Untuk sistem enterprise dengan compliance ketat, tetap butuh tim engineering.</p>
      <h2>Coba di KARSA</h2>
      <p>KARSA dirancang untuk vibecoding bahasa Indonesia: buka <a href="/app">workspace</a>, ketik ide, lihat preview langsung. Lanjut baca <a href="/artikel/pembuat-aplikasi-tanpa-coding">panduan pemula tanpa coding</a> atau <a href="/artikel/bikin-landing-page-dengan-ai">cara bikin landing page dengan AI</a>.</p>`,
  'bikin-landing-page-dengan-ai': `
      <p>Landing page adalah halaman tunggal yang menjelaskan produk/jasa dan mengajak pengunjung bertindak — pesan, daftar, atau chat. Dengan AI, kamu bisa punya versi pertama dalam menit, bukan minggu.</p>
      <h2>Struktur landing page yang konversi</h2>
      <ol style="margin:0 0 1.25em 1.25em">
        <li><strong>Hero</strong> — judul jelas + manfaat utama + tombol CTA</li>
        <li><strong>Fitur / manfaat</strong> — 3–6 poin singkat</li>
        <li><strong>Bukti sosial</strong> — testimoni atau angka (jika ada)</li>
        <li><strong>CTA akhir</strong> — ulangi ajakan bertindak</li>
      </ol>
      <h2>Contoh prompt untuk KARSA</h2>
      <p>Buat prompt spesifik: nama bisnis, warna, tone, dan CTA. Contoh:</p>
      <p><em>"Landing page kopi literasi dengan hero gelap, 3 kartu manfaat, section testimoni placeholder, tombol 'Pesan Sekarang' ke WhatsApp 0812xxx, font modern."</em></p>
      <h2>Iterasi cepat</h2>
      <p>Setelah preview muncul, minta revisi: <em>"buat hero lebih besar"</em>, <em>"tambah section FAQ"</em>, <em>"ganti palet ke hijau sage"</em>. Setiap putaran hanya butuh satu kalimat.</p>
      <h2>Publish &amp; SEO</h2>
      <p>Saat sudah puas, <a href="/artikel/cara-publish-website-karsa">publish ke karsa.work</a> atau domain sendiri. Pastikan title dan meta description terisi — KARSA bisa bantu lewat prompt: <em>"tambahkan meta description untuk SEO"</em>.</p>
      <p><a href="/app">Bikin landing page sekarang →</a></p>`,
  'katalog-produk-online-umkm': `
      <p>Sebagian besar UMKM Indonesia sudah jago kirim foto produk lewat WhatsApp. Masalahnya, foto itu cepat hilang di antara ribuan chat. <strong>Katalog produk online</strong> adalah versi rapi dari galeri itu: pelanggan buka link, pilih barang, lalu chat untuk order.</p>
      <h2>Kenapa katalog online layak dimiliki</h2>
      <p>Link katalog bisa dikirim ke pelanggan mana saja — lewat broadcast, Instagram, TikTok, atau marketplace. Tidak hilang setelah 24 jam seperti story. Kamu juga punya kontrol penuh: ganti harga, tambah varian, tampilkan stok, tanpa harus repost ulang. Untuk bisnis yang baru tumbuh, etalase digital sering lebih berguna daripada akun marketplace karena tidak ada biaya komisi dan brandingnya milik sendiri.</p>
      <h2>Struktur katalog yang efektif</h2>
      <ul>
        <li><strong>Header</strong> — nama usaha, tagline singkat, tombol WhatsApp melayang</li>
        <li><strong>Grid produk</strong> — foto, nama, harga, label stok atau varian</li>
        <li><strong>Filter sederhana</strong> — kategori atau rentang harga</li>
        <li><strong>Detail produk</strong> — foto besar, deskripsi, tombol chat untuk varian</li>
        <li><strong>Footer</strong> — alamat, jam buka, kontak, link media sosial</li>
      </ul>
      <p>Tidak perlu keranjang belanja untuk tahap awal. Pelanggan klik produk, tertarik, lalu langsung WhatsApp untuk nego atau tanya stok. Konversi tinggi karena prosesnya tetap manusiawi.</p>
      <h2>Contoh prompt untuk KARSA</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt spesifik. Semakin lengkap konteks yang kamu berikan, semakin akurat hasilnya. Contoh untuk toko thrift:</p>
      <p><em>"Buat katalog online untuk thrift shop 'Second Merta' dengan header navy dan logo teks, grid 3 kolom berisi 9 produk fashion (kaos, celana, jaket) lengkap dengan nama, harga, dan label ukuran S/M/L, tombol WhatsApp melayang ke 081234567890, section filter berdasarkan kategori, footer berisi alamat Jakarta dan link Instagram. Pakai foto placeholder dari Unsplash dengan tema fashion kasual."</em></p>
      <p>Dalam hitungan detik, preview muncul di KARSA. Minta revisi: <em>"ganti palet ke earth tone"</em>, <em>"tambah badge Diskon 20% di pojok kiri"</em>, atau <em>"buat section testimoni pelanggan"</em>. Setiap iterasi cukup satu kalimat.</p>
      <h2>Foto produk yang konsisten</h2>
      <p>Tidak perlu DSLR. Cukup tiga aturan: background polos (kain putih atau meja kayu), cahaya alami di dekat jendela, dan angle yang sama untuk semua produk. Edit dengan Snapseed atau Lightroom Mobile — gratis. Foto seragam membuat katalog terlihat jauh lebih profesional, meskipun kamera kamu cuma HP tiga jutaan. Resolusi ideal antara 800–1200 piksel di sisi panjang: cukup tajam di layar HP, tidak membebani loading di jaringan pelanggan yang masih 4G.</p>
      <h2>Kesalahan yang sering terjadi</h2>
      <ul>
        <li><strong>Terlalu banyak produk sekaligus</strong> — tampilkan 9–12 item terbaik, sisanya bisa ditambah kemudian</li>
        <li><strong>Harga tidak konsisten</strong> — pakai format sama (Rp 150.000 atau 150K), jangan campur "nego" tanpa batas</li>
        <li><strong>Tidak ada CTA WhatsApp</strong> — tombol chat harus terlihat tanpa scroll, idealnya floating di pojok</li>
        <li><strong>Foto produk yang tidak update</strong> — jika barang kosong, ganti label "habis" daripada hapus supaya tetap ada bukti stok pernah ada</li>
      </ul>
      <p>Kuncinya adalah katalog yang terasa hidup dan dijaga: pelanggan akan datang kembali kalau barangnya berubah, harga sesuai, dan respons chat cepat.</p>
      <h2>Publish dan bagikan</h2>
      <p>Setelah preview KARSA sesuai, klik Publish. Katalog kamu live di <code>second-merta.karsa.work</code> — gratis, tanpa setup hosting. Untuk nama domain sendiri seperti <code>secondmerta.com</code>, tambahkan di modal publish dan ikuti instruksi DNS yang diberikan KARSA. Setelah online, bagikan ke pelanggan dengan template chat: <em>"Hai kak, ini katalog terbaru kami ya, bisa dipilih dulu, nanti chat lagi kalau tertarik 😊"</em>. Lihat panduan lengkap di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>.</p>
      <p>Langkah penting setelah publish: daftarkan URL katalog ke Google Search Console supaya pelanggan yang mencari nama usahamu di Google bisa langsung menemukan katalognya. Tambahkan link di bio Instagram, deskripsi TikTok, dan pinned message WhatsApp Business. Trik yang sering dilupakan: saat mengirim katalog ke pelanggan baru, tunggu respons, lalu follow-up dengan <em>"kalau ada yang cocok, balas pesan ini kak, nanti saya bantu detailnya"</em>. Respons yang hangat tetap pembeda utama melawan marketplace.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama usaha dan nomor WhatsApp kamu, lalu lihat preview-nya. Pelajari juga <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> untuk use case lain seperti form booking dan landing promo. Katalog online adalah langkah pertama paling sederhana untuk go digital: dari sini, kamu bisa tambah halaman promo, testimoni, atau bahkan sistem preorder tanpa pindah platform.</p>`,
  'contoh-prompt-karsa-umkm': `
      <p>Banyak UMKM tahu soal AI untuk bikin website, tapi bingung mulai dari mana. Kuncinya adalah <strong>prompt</strong>: kalimat pesanan ke AI yang menentukan hasil akhir. Di KARSA, prompt ditulis bahasa Indonesia biasa — tidak perlu hafal syntax atau framework. Artikel ini mengumpulkan contoh prompt KARSA untuk UMKM yang tinggal kamu salin, ganti nama usaha, lalu publish.</p>
      <h2>Struktur prompt yang menghasilkan output bagus</h2>
      <p>Prompt yang efektif punya empat unsur: <strong>jenis halaman</strong> (katalog, landing, form), <strong>detail bisnis</strong> (nama, warna, tone), <strong>fitur wajib</strong> (tombol WhatsApp, harga, galeri), dan <strong>CTA</strong> (apa yang harus dilakukan pengunjung). Semakin lengkap konteksnya, semakin sedikit revisi yang kamu butuhkan.</p>
      <ul>
        <li><strong>Jenis halaman</strong> — sebutkan format yang kamu mau, mis. "katalog grid 3 kolom" atau "landing page satu layar".</li>
        <li><strong>Detail bisnis</strong> — nama usaha, kota, nomor WhatsApp aktif, palet warna, gaya bahasa.</li>
        <li><strong>Fitur wajib</strong> — tombol chat, section testimoni, badge promo, atau filter.</li>
        <li><strong>CTA akhir</strong> — apa yang harus pengunjung lakukan setelahnya.</li>
      </ul>
      <h2>Contoh prompt untuk KARSA</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu coba prompt di bawah. Ganti teks dalam kurung dengan detail usahamu.</p>
      <p><em>"Buat katalog online untuk [nama usaha], misalnya 'Kopi Pojok 27'. Header hitam dengan logo teks putih, grid 3 kolom berisi 9 produk kopi (arabika, robusta, blend) lengkap dengan nama, harga mulai Rp 25.000, dan label ukuran 250g/500g. Floating button WhatsApp ke 081234567890. Section filter berdasarkan jenis kopi. Footer berisi alamat Jakarta Selatan dan jam buka. Pakai foto placeholder Unsplash tema kopi."</em></p>
      <p>Setelah preview muncul, minta iterasi: <em>"ganti palet ke earth tone"</em>, <em>"tambah section testimoni pelanggan"</em>, atau <em>"buat badge Diskon 20% di pojok kiri"</em>. Tiap revisi cukup satu kalimat.</p>
      <h2>Lima prompt siap pakai untuk UMKM</h2>
      <ol style="margin:0 0 1.25em 1.25em">
        <li><strong>Landing promo Lebaran</strong> — hero diskon, countdown sederhana, CTA WhatsApp.</li>
        <li><strong>Form booking salon</strong> — pilih layanan, tanggal, jam, lalu kirim ke WhatsApp owner.</li>
        <li><strong>Toko online thrift</strong> — grid produk, filter ukuran, badge "stok terbatas".</li>
        <li><strong>Halaman jasa les privat</strong> — profil tutor, daftar paket harga, form daftar.</li>
        <li><strong>Preorder kue kering</strong> — countdown tutup order, varian rasa, form pemesanan.</li>
      </ol>
      <p>Semua prompt di atas bisa kamu adaptasi dengan mengganti nama usaha, nomor WhatsApp, palet warna, dan foto produk. Kalau bingung mulai dari yang mana, pilih yang paling dekat dengan kondisi bisnismu sekarang.</p>
      <h2>Iterasi dan revisi</h2>
      <p>Hasil pertama AI jarang sempurna — itu normal. Setelah preview muncul di KARSA, kamu bisa minta revisi kecil: ganti warna, tambah section, atau ubah ukuran tombol. Bahasa yang dipakai tetap bahasa Indonesia santai, sama seperti ngobrol dengan desainer. Untuk revisi yang lebih besar, mis. ubah struktur dari katalog jadi landing, lebih efisien bikin proyek baru daripada revisi menumpuk.</p>
      <p>Trik yang sering dipakai UMKM: screenshot preview KARSA, kirim ke teman atau keluarga, tanya "kalau kamu jadi pelanggan, bagian mana yang membingungkan?". Masukan itu jadi dasar revisi berikutnya.</p>
      <h2>Prompt yang perlu dihindari</h2>
      <p>Hindari prompt yang terlalu umum, seperti "bikin website bagus" — AI tidak punya konteks. Semakin sempit dan spesifik permintaannya, semakin akurat hasilnya. Jangan minta AI menambahkan informasi bisnis yang tidak kamu verifikasi (alamat, harga, jam buka) karena bisa salah ketik. Selalu cek ulang sebelum publish.</p>
      <h2>Setelah puas: publish dan SEO</h2>
      <p>Kalau preview sudah sesuai, klik Publish di toolbar. Situs langsung live di <code>namabisnis.karsa.work</code> — gratis, tanpa setup hosting. Untuk domain sendiri, tambahkan di modal publish dan ikuti instruksi DNS. Setelah online, daftarkan URL ke Google Search Console supaya pelanggan yang mencari nama usahamu bisa langsung menemukannya. Panduan lengkap ada di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>.</p>
      <p>Untuk konten yang fokus ke UMKM, pelajari juga <a href="/artikel/katalog-produk-online-umkm">panduan katalog produk online</a> — struktur dan contoh prompt untuk etalase digital sudah dibahas lengkap di sana.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin salah satu prompt di atas, ganti detail usahamu, dan lihat preview dalam hitungan detik. Paket gratis sudah termasuk 30 prompt AI per hari — cukup untuk eksplorasi awal tanpa bayar. Kalau sudah yakin dengan alurnya, Pro membuka AI tanpa limit dan publish tanpa watermark. Pelajari juga <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> untuk use case lain yang bisa kamu bangun dari prompt sederhana.</p>`,
};