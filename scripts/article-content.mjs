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
      <h2>Strruktur katalog yang efektif</h2>
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
  'karsa-vs-website-builder': `
      <p>Kalau kamu baru mulai bikin website untuk bisnis, pasti pernah bingung: pakai KARSA, Wix, atau WordPress? Ketiganya sama-sama menghasilkan website yang bisa dibuka di internet, tapi cara kerja, biaya, dan batasannya beda jauh. Artikel ini membandingkan ketiganya dari sudut UMKM dan kreator Indonesia supaya kamu tidak salah pilih di awal.</p>
      <h2>Apa itu masing-masing platform?</h2>
      <p><strong>WordPress</strong> adalah sistem manajemen konten (CMS) open source yang sudah ada sejak 2003. Kamu perlu sewa hosting, pasang domain, lalu install WordPress di server. Ribuan tema dan plugin tersedia untuk memperluas fungsi. WordPress menguasai lebih dari 40 persen website di dunia, tapi butuh kemauan belajar yang lumayan.</p>
      <p><strong>Wix</strong> adalah website builder drag-and-drop asal Israel. Kamu daftar, pilih template, lalu susun halaman dengan menggeser-geser elemen visual. Tidak perlu coding, tapi kalau sudah salah pilih template di awal, ganti template berarti mulai dari nol.</p>
      <p><strong>KARSA</strong> adalah <a href="/artikel/apa-itu-vibecoding">vibecoding</a> builder: kamu menulis prompt bahasa Indonesia, AI menghasilkan kode HTML, CSS, dan JavaScript sungguhan, lalu kamu preview langsung di browser. Hasilnya adalah file kode asli yang bisa diedit atau diekspor, bukan halaman terkunci di dalam platform.</p>
      <h2>Tabel perbandingan singkat</h2>
      <ul>
        <li><strong>Cara bikin</strong> — KARSA pakai prompt AI, Wix drag-and-drop, WordPress install manual dan kelola hosting.</li>
        <li><strong>Butuh coding?</strong> — KARSA opsional (bisa edit kode bila perlu), Wix tidak sama sekali, WordPress sangat disarankan untuk tema/plugin custom.</li>
        <li><strong>Biaya awal</strong> — KARSA gratis 30 prompt/hari, Wix gratis dengan watermark Wix, WordPress gratis tapi hosting mulai Rp 150.000 per bulan.</li>
        <li><strong>Kecepatan jadi</strong> — KARSA hitungan menit, Wix hitungan jam, WordPress hitungan hari sampai minggu.</li>
        <li><strong>SEO dasar</strong> — KARSA otomatis (title, meta, schema, sitemap), Wix cukup lengkap, WordPress paling fleksibel tapi perlu setup plugin.</li>
        <li><strong>Kepemilikan kode</strong> — KARSA bisa diekspor, Wix terkunci, WordPress milik kamu (asalkan host sendiri).</li>
      </ul>
      <h2>Biaya total yang jarang dihitung</h2>
      <p>Wix sering dipromosikan gratis, tapi untuk pakai domain sendiri dan menghilangkan iklan Wix, kamu perlu paket Combo atau Unlimited mulai USD 11 per bulan. WordPress lebih murah di software, tapi hosting managed, tema premium, dan plugin SEO berbayar bisa menumpuk jadi USD 10–30 per bulan. KARSA punya paket gratis yang sudah termasuk subdomain <code>nama.karsa.work</code>, 30 prompt AI per hari, dan unlimited proyek. Paket Pro membuka AI tanpa limit dan publish tanpa watermark KARSA.</p>
      <p>Untuk UMKM yang baru tumbuh, biaya bukan cuma uang. Waktu belajar dan waktu maintain juga mahal. WordPress menuntut update tema dan plugin rutin; Wix membatasi kontrol tapi juga meminimalkan kerja pemeliharaan. KARSA ada di tengah: kamu fokus ke iterasi ide dan desain, sementara infrastruktur otomatis dijaga.</p>
      <h2>Kapan pilih yang mana?</h2>
      <p><strong>Pilih WordPress</strong> kalau kamu butuh blog skala besar, toko online kompleks (WooCommerce), atau sudah nyaman dengan hosting, tema, dan plugin. Cocok untuk media, korporat, dan publisher besar.</p>
      <p><strong>Pilih Wix</strong> kalau kamu mau halaman statis yang cantik dalam sehari, tidak akan sering ubah struktur, dan tidak keberatan dengan ekosistem Wix (domain, pembayaran, app internal Wix). Cocok untuk wedding invitation, portofolio sekali jadi, atau toko kecil dengan katalog statis.</p>
      <p><strong>Pilih KARSA</strong> kalau kamu ingin prototipe cepat, prompt bahasa Indonesia, dan kode yang bisa kamu bawa. Cocok untuk <a href="/artikel/vibecoding-untuk-umkm">UMKM</a>, freelancer yang sering iterasi desain, founder startup yang mau landing page MVP dalam hitungan jam, atau siapa pun yang ingin AI membantu menulis kode tanpa kehilangan kontrol.</p>
      <p>Kalau masih di fase eksplorasi, KARSA juga paling ramah untuk pemula. Tidak perlu pilih template dulu — cukup tulis ide, lihat preview, minta revisi, dan putuskan setelah melihat hasilnya.</p>
      <h2>Contoh prompt KARSA untuk eksplorasi</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek baru, lalu coba prompt pembanding: <em>"landing page peluncuran buku fiksi ilmiah 'Rimba Nada', hero gelap dengan ilustrasi bintang, section sinopsis 3 paragraf, daftar 5 tokoh utama, testimoni pembaca, dan tombol preorder ke WhatsApp"</em>. Hasilnya langsung jadi di preview. Coba juga minta versi Wix-style atau WordPress-style: <em>"buat versi yang lebih editorial seperti layout majalah"</em>. Lihat bagaimana AI menafsirkan brief yang sama dengan gaya berbeda — biasanya ini membantu kamu memahami kekuatan dan batasan setiap pendekatan tanpa harus install apa pun.</p>
      <p>Kuncinya: KARSA bukan untuk menggantikan Wix atau WordPress untuk semua kasus. Ini alat ketiga yang melengkapi toolbox, terutama saat kamu perlu kecepatan dan eksperimentasi.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, coba bandingkan tiga versi website dengan brief yang sama, lalu putuskan platform mana yang paling cocok untuk kebutuhan bisnismu. Untuk pemula yang baru pertama kali bikin website, pelajari juga <a href="/artikel/pembuat-aplikasi-tanpa-coding">panduan pembuat aplikasi tanpa coding</a> agar fondasi vibecoding-mu lebih kuat sebelum memutuskan platform.</p>`,
  'daftar-google-search-console': `
      <p>Website kamu sudah publish — bagus. Tapi selama belum didaftarkan ke Google Search Console, Google tidak punya cara resmi untuk tahu halamanmu ada, pantas diindeks, atau layak ditampilkan di hasil pencarian. <strong>Daftar Google Search Console</strong> adalah langkah wajib setelah go live, terutama untuk UMKM yang mengandalkan trafik organik dari pelanggan yang mencari nama usaha atau kategori bisnis di Google.</p>
      <h2>Kenapa Search Console wajib untuk website UMKM</h2>
      <p>Search Console adalah alat gratis dari Google yang menunjukkan bagaimana situs kamu terlihat di mesin pencari. Kamu bisa melihat halaman mana yang sudah diindeks, kata kunci apa yang membawa pengunjung, dan masalah teknis yang mencegah halaman muncul di pencarian. Untuk UMKM yang baru tumbuh, data ini sering lebih berguna daripada SEO plugin berbayar: kamu tahu persis apa yang dilihat Google, tanpa tebak-tebakan.</p>
      <p>Yang paling terasa: ketika kamu publish halaman baru, Search Console menyediakan fitur "Inspect any URL" yang meminta Google merayapi halaman itu dalam hitungan menit — bukan menunggu berminggu-minggu. Ini krusial untuk pemilik bisnis yang mengandalkan promo musiman, launch produk, atau update menu. Kalau kamu pernah mengalami "website sudah online tapi di Google tidak ada", biasanya masalahnya bukan konten, melainkan tidak ada sinyal resmi ke Google bahwa halaman itu ada.</p>
      <h2>Syarat sebelum daftar</h2>
      <p>Sebelum mulai, pastikan tiga hal ini sudah siap. Pertama, akun Google aktif (Gmail) — bisa akun pribadi atau akun kantor, keduanya sama saja. Kedua, akses ke DNS domain — kalau kamu pakai <a href="/artikel/cara-publish-website-karsa">subdomain gratis dari KARSA</a>, beberapa metode verifikasi tetap bisa dipakai; kalau pakai domain sendiri, kamu perlu login ke panel registrar (Niagahoster, Rumahweb, Cloudflare, Namecheap, dll).</p>
      <p>Ketiga, keputusan verifikasi: pilih <strong>Domain</strong> (lebih menyeluruh, butuh tambah record DNS) atau <strong>URL Prefix</strong> (lebih cepat, verifikasi via file HTML atau meta tag). Untuk UMKM, URL Prefix lebih praktis karena tidak perlu utak-atik DNS. Catat juga URL lengkap situsmu, termasuk https:// di depan, karena akan diminta saat pendaftaran.</p>
      <h2>Langkah daftar dan verifikasi</h2>
      <p>Buka <a href="https://search.google.com/search-console" target="_blank" rel="noopener">search.google.com/search-console</a>, login dengan akun Google kamu, lalu klik "Add Property". Pilih metode URL Prefix, masukkan URL situs KARSA kamu (mis. <code>https://namabisnis.karsa.work</code> atau <code>https://www.tokoku.com</code>). Google akan menawarkan beberapa cara verifikasi — pilih "HTML tag" karena paling cepat.</p>
      <p>Salin meta tag yang diberikan Google, lalu kembali ke <a href="/app">KARSA</a>, buka proyek situsmu, dan minta AI menambahkan tag itu ke bagian <code>&lt;head&gt;</code>. Cukup prompt sederhana: <em>"tambahkan meta tag verifikasi Google Search Console berikut di head: (paste tag di sini)"</em>. Publish ulang, tunggu satu-dua menit sampai preview live, lalu klik tombol "Verify" di dashboard Search Console. Kalau DNS atau file HTML sudah benar, status langsung berubah jadi "Verified".</p>
      <h2>Submit sitemap dan pantau performa</h2>
      <p>Setelah verifikasi, masuk ke menu "Sitemaps" di sidebar Search Console. KARSA sudah otomatis membuat <code>sitemap.xml</code> untuk situsmu — ketik <code>sitemap.xml</code> di kolom yang tersedia, klik Submit. Google akan menjadwalkan perayapan pertama dalam beberapa jam sampai satu hari. Untuk <a href="/artikel/katalog-produk-online-umkm">katalog produk</a> yang sering ganti barang, submit ulang sitemap setiap kali ada halaman baru.</p>
      <p>Setelah satu-dua minggu, buka menu "Performance" untuk melihat data pencarian: query apa yang memicu situsmu muncul, halaman mana yang paling banyak di-klik, dan CTR (click-through rate) rata-rata. Kalau CTR di bawah 2 persen, biasanya judul dan meta description perlu ditulis lebih menarik — minta KARSA buatkan variasi meta description, lalu publish ulang. Menu "Pages" dan "Coverage" membantu mendeteksi error seperti 404, redirect berantai, atau halaman yang diblokir <code>noindex</code> secara tidak sengaja.</p>
      <h2>Kebiasaan Search Console yang berguna</h2>
      <p>Jadikan inspeksi URL sebagai rutinitas setiap kali publish halaman baru: buka Search Console, ketik URL halaman, klik "Request Indexing". Cara ini memotong waktu tunggu dari hitungan minggu menjadi hitungan jam. Untuk UMKM yang mengandalkan promo dadakan, perbedaan ini signifikan — pelanggan yang cari produk hari ini tidak mau menunggu sampai akhir bulan.</p>
      <p>Jangan panik kalau di minggu pertama hanya ada "0 impressions". Data performa butuh waktu untuk akumulasi, dan Search Console baru menampilkan data setelah Google berhasil merayapi dan menampilkan situsmu di hasil pencarian. Yang penting: status verifikasi tetap "Verified", tidak ada error di menu "Coverage", dan sitemap sudah di-submit. Itu sudah cukup sebagai fondasi SEO untuk tahap awal.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a> dan pastikan situs kamu sudah publish — kalau belum, ikuti <a href="/artikel/cara-publish-website-karsa">panduan publish dari KARSA</a> terlebih dahulu. Setelah URL aktif, daftar ke Google Search Console, verifikasi via meta tag dengan bantuan prompt di KARSA, dan submit sitemap. Butuh waktu kurang dari 30 menit untuk tahap verifikasi, dan kamu sudah punya alat gratis seumur hidup untuk memantau performa situs. Setelah data masuk, bandingkan dengan pemilik website lain di komunitas, atau pelajari <a href="/artikel/karsa-vs-website-builder">perbandingan platform website</a> untuk memastikan fondasi teknologimu sudah tepat.</p>`,
 'website-warung-makan': `
      <p>Warung makan di Indonesia biasanya punya pelanggan tetap yang datang karena lokasi dan rasa. Tapi di luar radius satu kilometer, warung kamu hampir tidak terlihat. <strong>Website warung makan sederhana</strong> adalah cara termurah untuk membuat pelanggan baru menemukan warung lewat Google, Maps, atau link yang dishare di WhatsApp grup — tanpa harus sewa designer atau developer.</p>
      <h2>Isi minimum website warung makan</h2>
      <p>Tidak perlu toko online lengkap. Pelanggan warung makan biasanya mau tahu tiga hal: <strong>menu hari ini</strong>, <strong>jam buka</strong>, dan <strong>cara pesan</strong>. Sisanya tinggal visual pendukung: foto menu, alamat dengan pin Maps, dan nomor WhatsApp yang bisa diklik langsung dari HP.</p>
      <ul>
        <li><strong>Nama warung dan tagline singkat</strong> — mis. "Soto Ayam Bu Ning — buka sejak 1998".</li>
        <li><strong>Daftar menu</strong> — nama, harga, dan label pedas/ringan bila perlu.</li>
        <li><strong>Foto makanan</strong> — cukup 3–6 foto terbaik, pencahayaan alami.</li>
        <li><strong>Jam buka dan alamat</strong> — jelaskan juga apakah buka setiap hari atau hanya weekday.</li>
        <li><strong>Tombol WhatsApp</strong> — floating atau inline, supaya pelanggan langsung chat untuk order.</li>
        <li><strong>Link Google Maps</strong> — bantu pelanggan yang mau datang langsung.</li>
      </ul>
      <p>Versi paling sederhana pun sudah berguna: banyak pelanggan yang tidak akan telepon tapi akan chat dulu untuk memastikan menu favoritnya ada hari ini. Website yang memuat informasi itu — bahkan tanpa fitur preorder — sudah menghemat banyak chat bolak-balik.</p>
      <h2>Contoh prompt untuk KARSA</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu coba prompt di bawah. Ganti teks dalam kurung dengan detail warungmu sendiri.</p>
      <p><em>"Buat website sederhana untuk warung 'Soto Bu Ning' di Jakarta Pusat. Header dengan logo teks oranye tua dan tagline 'Buka sejak 1998, resep keluarga'. Section menu berisi 8 item (Soto Ayam, Soto Daging, Soto Campur, Nasi Uduk, Emping, Kerupuk, Es Teh, Jeruk Panas) lengkap dengan harga Rp 15.000–Rp 30.000. Section foto grid 2x3 dengan placeholder gambar soto. Alamat: Jl. Kesehatan Raya No.12, buka setiap hari 07.00–21.00. Floating button WhatsApp ke 081234567890 dengan teks 'Pesan / Tanya Menu'. Footer berisi tautan Google Maps dan Instagram. Palet warna krem dan oranye, font hangat."</em></p>
      <p>Setelah preview muncul, minta revisi seperlunya: <em>"tambah section testimoni pelanggan"</em>, <em>"ganti palet ke hijau tua dan putih"</em>, atau <em>"buat bagian menu khusus sarapan Rp 12.000"</em>. Tiap iterasi cukup satu kalimat.</p>
      <h2>Mengapa warung makan perlu website, bukan cuma Google Maps</h2>
      <p>Google Maps gratis dan berguna untuk pelanggan yang sudah mencari. Tapi Maps tidak menampilkan foto menu, tidak menjelaskan konsep warung, dan tidak bisa menerima pesanan via WhatsApp. Website adalah etalase yang kamu kontrol penuh: ganti menu mingguan, tampilkan promo musiman (berbuka puasa, menu baru), dan bagikan link di story Instagram tanpa harus repot edit caption.</p>
      <p>Untuk warung yang juga menerima pesanan nasi kotak, snack box, atau catering, website bahkan lebih penting. Pelanggan korporat yang cari vendor makan siang kantor hampir selalu cek website dulu sebelum telepon — kalau tidak ada, mereka pindah ke kompetitor yang terlihat lebih profesional, meskipun rasa makanannya sebanding.</p>
      <h2>Foto yang bikin warung terlihat menggugah selera</h2>
      <p>Kamera HP sudah cukup. Cukup tiga aturan: cahaya alami dari samping (bukan dari atas), angle 45 derajat untuk makanan berkuah, dan background meja kayu atau kain polos. Foto di luar jam sibuk ketika mangkuk masih penuh dan uap masih naik — momen itu yang bikin pelanggan lapar.</p>
      <p>Tidak perlu foto setiap menu. Pilih 3–6 hidangan signature yang paling laris atau paling fotogenik. Foto sisanya cukup nama dan harga. Terlalu banyak foto justru membuat loading lambat di HP pelanggan yang masih di jaringan 4G.</p>
      <h2>Cara menyebar link website warung</h2>
      <p>Setelah preview KARSA sesuai, klik Publish. Warungmu live di subdomain gratis seperti <code>soto-bu-ning.karsa.work</code> — tanpa setup hosting, tanpa biaya bulanan. Untuk domain sendiri seperti <code>sotobuning.com</code>, tambahkan di modal publish dan ikuti instruksi DNS yang diberikan KARSA. Panduan lengkap soal ini ada di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>.</p>
      <p>Lalu sebarkan link itu: taruh di bio Instagram warung, deskripsi TikTok, header WhatsApp Business, name tag GoFood/GrabFood (kalau kamu juga pakai marketplace), dan group WhatsApp komunitas sekitar. Untuk pelanggan yang masih awam, QR code yang dicetak dan ditempel di meja juga efektif — mereka tinggal scan, dan website terbuka di HP. Trik yang sering dilupakan: simpan link website di kolom "Website" pada Google Business Profile warung, supaya Maps menampilkan link langsung ke etalase digitalmu.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama warung, nomor WhatsApp, dan menu sesuai kondisi kamu, lalu lihat preview-nya. Paket gratis sudah termasuk 30 prompt AI per hari, cukup untuk eksplorasi awal tanpa keluar biaya. Untuk variasi lain, pelajari juga <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> dan <a href="/artikel/bikin-landing-page-dengan-ai">cara bikin landing page dengan AI</a> — pola yang sama bisa dipakai untuk landing promo, halaman catering, atau form reservasi meja.</p>`,
};
