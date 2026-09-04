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
  'form-booking-online-umkm': `
      <p>Salon, barbershop, klinik kecil, tukang pangkas, rental mobil, atau jasa les privat — hampir semua UMKM jasa menghadapi masalah yang sama: <strong>booking</strong> yang masuk lewat chat acak. Kadang pelanggan lupa kasih tanggal, kadang lupa jam, kadang cuma kirim emoji. Form booking online adalah link yang meminta data itu rapi, lalu mengirimnya ke WhatsApp owner sebagai pesan terstruktur.</p>
      <h2>Kenapa form booking lebih baik dari chat manual</h2>
      <p>Chat manual memang fleksibel, tapi setelah order ketiga, owner sudah mulai lelah mengulang pertanyaan yang sama: layanan apa, tanggal berapa, jam berapa, nama siapa, alamat mana. Form booking membuat pelanggan menjawab sendiri sebelum chat pertama — owner tinggal konfirmasi. Untuk usaha dengan 5–20 booking per hari, perbedaan ini berarti satu jam waktu admin per hari yang bisa dipakai untuk melayani pelanggan di tempat.</p>
      <p>Form juga berfungsi sebagai etalase ketersediaan. Pelanggan bisa melihat slot kosong sebelum memesan, sehingga tidak ada lagi drama "kok penuh ya?". Untuk jasa dengan kapasitas terbatas seperti barbershop atau klinik, menampilkan slot yang tersisa secara transparan menurunkan no-show rate — pelanggan yang sudah dapat slot tertentu lebih serius datang.</p>
      <h2>Isi minimum form booking</h2>
      <ul>
        <li><strong>Nama pelanggan</strong> — teks biasa, wajib diisi</li>
        <li><strong>Nomor WhatsApp</strong> — agar owner bisa konfirmasi balik</li>
        <li><strong>Layanan yang dipilih</strong> — dropdown dari daftar layanan (gunting rambut, creambath, pijat, dst.)</li>
        <li><strong>Tanggal dan jam</strong> — input tanggal dan pilihan slot waktu</li>
        <li><strong>Catatan tambahan</strong> — kolom teks bebas untuk permintaan khusus</li>
        <li><strong>Tombol submit</strong> yang mengirim ringkasan ke WhatsApp owner</li>
      </ul>
      <p>Untuk jasa dengan banyak cabang, tambah field <strong>lokasi</strong>. Untuk jasa yang butuh alamat jemput (laundry, massage home service), tambah field <strong>alamat</strong>. Hindari field yang tidak benar-benar dipakai — form yang terlalu panjang membuat pelanggan batalkan di tengah jalan.</p>
      <h2>Contoh prompt untuk KARSA</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu coba prompt di bawah. Ganti detail sesuai jenis usaha dan nomor WhatsApp owner.</p>
      <p><em>"Buat form booking online untuk barbershop 'Razor Studio' di Bandung. Header hitam dengan logo teks emas. Tampilkan 3 layanan utama (Potong Rambut Rp 50.000, Creambath Rp 75.000, Hair Color Rp 150.000) sebagai kartu pilihan. Form input berisi nama, nomor WhatsApp, pilih tanggal (date picker), pilih slot jam (10.00, 12.00, 14.00, 16.00, 19.00), dan catatan tambahan. Tombol submit membuka chat WhatsApp ke 081234567890 dengan pesan terformat: 'Halo Razor Studio, saya mau booking — Nama: [nama], Layanan: [layanan], Tanggal: [tanggal], Jam: [slot], Catatan: [catatan]'. Section bawah berisi alamat, jam buka, dan tautan Instagram. Palet hitam-emas, font tegas modern."</em></p>
      <p>Setelah preview muncul, minta iterasi yang umum: <em>"tambah konfirmasi popup setelah submit"</em>, <em>"ganti palet ke putih dan biru laut"</em>, <em>"tampilkan jumlah slot tersisa per jam"</em>, atau <em>"buat versi mobile yang tombolnya lebih besar"</em>. Tiap revisi cukup satu kalimat.</p>
      <h2>Notifikasi WhatsApp yang rapi</h2>
      <p>Trik terpenting: pesan WhatsApp yang diterima owner harus sudah terformat, bukan cuma string kosong. Format seperti <em>"Booking baru — Layanan: Hair Color, Tanggal: 8 Juli, Jam: 14.00, Nama: Rina, No: 08123xxx, Catatan: rambut diwarnai coklat"</em> membuat owner bisa langsung balas dengan <em>"Siap kak Rina, jam 14.00 tersedia ya, total Rp 150.000, terima kasih!"</em> tanpa harus decode pesan.</p>
      <p>Pakai template <code>https://wa.me/</code> dengan parameter <code>text=</code> yang sudah di-encode. KARSA bisa bantu generate template itu lewat prompt: <em>"buat agar submit form langsung membuka WhatsApp dengan pesan terformat sesuai input"</em>. Untuk usaha dengan volume tinggi, pertimbangkan menyimpan data form ke spreadsheet otomatis — tapi untuk tahap awal, pesan WhatsApp sudah lebih dari cukup.</p>
      <h2>Kesalahan umum yang perlu dihindari</h2>
      <ul>
        <li><strong>Slot waktu yang tidak konsisten</strong> — kalau salon buka 10.00–21.00, slot 11.30 terlihat tidak natural; pakai kelipatan 30 atau 60 menit.</li>
        <li><strong>Tidak ada konfirmasi</strong> — pelanggan submit form, tidak ada respons dari owner. Pastikan ada auto-reply, setidaknya: <em>"Terima kasih, kami akan konfirmasi dalam 1 jam"</em>.</li>
        <li><strong>Form tanpa info lokasi</strong> — pelanggan jadi tidak tahu harus datang ke mana; tampilkan alamat dan Google Maps di bawah form.</li>
        <li><strong>Layanan yang tidak ter-update</strong> — kalau ada layanan baru atau harga berubah, update form sekaligus. Outdated form lebih buruk daripada tidak ada form.</li>
        <li><strong>Tidak ada versi mobile</strong> — 90 persen pelanggan booking dari HP. Form yang di-desain untuk desktop akan membuat field kecil dan sulit diklik.</li>
      </ul>
      <h2>Cara menyebar link form</h2>
      <p>Setelah preview KARSA sesuai, klik Publish. Form kamu live di subdomain gratis seperti <code>razor-studio.karsa.work/book</code> — tanpa setup hosting. Untuk domain sendiri seperti <code>razorstudio.id</code>, tambahkan di modal publish dan ikuti instruksi DNS. Lalu sebarkan link itu: bio Instagram usaha, header WhatsApp Business, pinned message grup pelanggan, dan QR code yang dicetak di meja kasir atau di etalase toko. Panduan publish lengkap ada di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>.</p>
      <p>Untuk usaha yang baru buka, cara paling efektif adalah menempel QR code di meja dan menjelaskan ke pelanggan: <em>"Kak, kalau mau booking nanti bisa scan barcode ini aja, langsung masuk antrian kami, nggak perlu chat lagi"</em>. Dalam dua minggu, pola booking biasanya sudah bergeser dari chat manual ke form — dan waktu admin yang semula habis untuk klarifikasi bisa dialihkan ke pelayanan.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama usaha, daftar layanan, harga, dan nomor WhatsApp owner, lalu lihat preview-nya. Untuk variasi prompt yang lebih lengkap, pelajari juga <a href="/artikel/contoh-prompt-karsa-umkm">contoh prompt KARSA untuk UMKM</a> — lima prompt siap pakai di sana bisa kamu adaptasi untuk booking, katalog, dan landing promo. Kalau usaha kamu masih tahap awal dan bingung antara website, katalog, atau form dulu, cek juga <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> untuk peta use case yang lebih luas.</p>`,
'custom-domain-karsa': `
      <p>Subdomain gratis dari KARSA seperti <code>tokoku.karsa.work</code> sudah cukup untuk mulai. Tapi kalau bisnismu sudah punya nama usaha tetap, domain sendiri — seperti <code>tokoku.com</code> — terasa jauh lebih profesional di kartu nama, kemasan produk, dan iklan berbayar. Artikel ini menjelaskan cara pasang custom domain di KARSA untuk UMKM: syarat, langkah DNS, jebakan umum, dan tips biar domain baru tetap cepat ditemukan Google.</p>
      <h2>Kenapa UMKM perlu custom domain</h2>
      <p>Domain sendiri adalah aset digital yang bertahan lama — tidak bergantung pada platform manapun. Kalau suatu saat kamu pindah builder, domain tetap di tanganmu. Pelanggan juga lebih mudah mengingat <code>tokoku.com</code> dibanding <code>tokoku.karsa.work</code>, apalagi dicetak di stiker, kemasan, atau iklan TV. Untuk SEO, domain singkat dengan kata kunci merek membantu click-through rate di Google: pelanggan lebih percaya klik link yang terlihat rapi.</p>
      <p>Yang sering tidak disadari: domain sendiri melatih pelanggan mengetik langsung ke address bar. Setelah beberapa kali interaksi, mereka akan ketik <code>tokoibu.com</code> tanpa perlu search — loyalty yang tidak bisa dibangun oleh subdomain generik. Untuk bisnis lokal yang melayani repeat customer, efeknya terasa di bulan ketiga atau keempat.</p>
      <h2>Syarat sebelum pasang custom domain di KARSA</h2>
      <p>Pastikan tiga hal ini siap. Pertama, kamu sudah punya akun di platform registrasi domain — Niagahoster, Rumahweb, Cloudflare, Namecheap, Exabytes, atau registrar lain. Kalau belum, daftarkan dulu; biaya domain <code>.com</code> mulai sekitar Rp 150.000 per tahun, <code>.id</code> mulai Rp 250.000 per tahun.</p>
      <ul>
        <li><strong>Domain aktif</strong> — sudah dibayar minimal satu tahun dan tidak dalam masa redemption</li>
        <li><strong>Akses panel DNS</strong> — bisa login ke registrar tempat kamu membeli domain</li>
        <li><strong>Proyek KARSA sudah publish</strong> — minimal sudah live di subdomain gratis sebagai fallback</li>
      </ul>
      <h2>Contoh prompt untuk KARSA</h2>
      <p>Buka <a href="/app">KARSA</a>, buka proyek yang ingin di-custom domain, lalu klik Publish. Di modal yang muncul, pilih opsi "Custom Domain" dan masukkan domain kamu, mis. <code>tokoibu.com</code>. KARSA akan menampilkan instruksi DNS yang perlu ditambahkan di panel registrar. Untuk memastikan domain diarahkan dengan benar, minta AI menambahkan catatan di footer:</p>
      <p><em>"Tambahkan catatan di footer halaman: 'Situs ini adalah properti resmi Toko Ibu, domain tokoibu.com dikelola melalui KARSA'. Pakai font kecil warna abu-abu, posisi tengah."</em></p>
      <p>Setelah preview muncul dan footer ter-update, publish ulang supaya live site ikut berubah. Cek juga apakah ada section tentang toko yang perlu menyebut domain baru — pelanggan yang menemukan subdomain lama tetap perlu diarahkan ke domain utama.</p>
      <h2>Langkah pasang DNS</h2>
      <p>Berikut alur umum yang berlaku untuk hampir semua registrar domain. Login ke panel domain kamu, buka menu DNS Management atau Zone Editor. KARSA meminta dua record: <strong>CNAME</strong> untuk subdomain <code>www</code> ke <code>host.karsa.work</code>, dan <strong>ALIAS atau ANAME</strong> (atau redirect 301) untuk root domain <code>tokoibu.com</code>.</p>
      <ol style="margin:0 0 1.25em 1.25em">
        <li>Buka panel DNS registrar domain kamu.</li>
        <li>Tambahkan record CNAME: host <code>www</code>, target <code>host.karsa.work</code>.</li>
        <li>Tambahkan record ALIAS/ANAME untuk root domain <code>@</code> ke <code>host.karsa.work</code> — atau redirect URL 301.</li>
        <li>Simpan perubahan, tunggu propagasi 5 menit sampai 24 jam.</li>
        <li>Kembali ke KARSA, klik "Verify" di modal custom domain.</li>
      </ol>
      <p>Setelah status berubah menjadi "Connected", domain baru siap dipakai. SSL otomatis diurus KARSA — pelanggan tidak melihat peringatan "not secure" di browser. Untuk memastikan semuanya bekerja, buka domain dari HP dan browser berbeda (Chrome di laptop, Safari di iPhone). Kalau di salah satu device masih error, biasanya propagasi DNS belum selesai di ISP tertentu — tunggu beberapa jam.</p>
      <h2>Kesalahan umum saat pasang custom domain</h2>
      <ul>
        <li><strong>Lupa propagasi</strong> — DNS butuh waktu. Cek dengan <code>whatsmydns.net</code> untuk lihat apakah record sudah tersebar global.</li>
        <li><strong>Record bentrok</strong> — kalau domain masih diarahkan ke website lain (mis. Blogspot), hapus dulu record lama.</li>
        <li><strong>Typo di CNAME</strong> — satu karakter salah menyebabkan error. Selalu copy-paste dari instruksi KARSA.</li>
        <li><strong>Lupa SSL</strong> — setelah domain terhubung, sertifikat HTTPS butuh waktu 10–30 menit untuk diterbitkan.</li>
        <li><strong>Tidak redirect www</strong> — pastikan <code>www.tokoibu.com</code> dan <code>tokoibu.com</code> keduanya mengarah ke situs KARSA.</li>
      </ul>
      <p>Trik UMKM: setelah domain baru live, jangan hapus subdomain <code>karsa.work</code> langsung. Biarkan satu atau dua minggu supaya pelanggan lama yang masih ingat link subdomain tidak kecewa. Setelah yakin semua sudah pindah, baru deprecate subdomain lama.</p>
      <h2>SEO setelah domain baru live</h2>
      <p>Domain baru dimulai dari nol di mata Google — tidak ada backlink, tidak ada history. Langkah pertama setelah domain aktif: daftarkan ke <a href="/artikel/daftar-google-search-console">Google Search Console</a> dengan metode Domain (bukan URL Prefix) supaya data lebih lengkap. Submit sitemap dan request indexing untuk halaman utama.</p>
      <p>Kalau sebelumnya UMKM sudah punya situs lama di domain lain (Blogspot, WordPress.com, dll.), pasang redirect 301 dari domain lama ke domain baru. Tanpa redirect, backlink yang sudah terkumpul hilang dan ranking lama ikut reset. Untuk detail publish dan SEO dasar, lihat juga <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>.</p>
      <h2>Memilih registrar domain untuk UMKM Indonesia</h2>
      <p>Registrar lokal seperti Niagahoster dan Rumahweb punya dukungan bahasa Indonesia dan menerima pembayaran via transfer bank, GoPay, atau e-wallet — lebih praktis untuk UMKM tanpa kartu kredit. Cloudflare menonjolkan harga modal dan WHOIS privacy gratis, tapi pembelian via dashboard bahasa Inggris. Namecheap dan Porkbun punya harga kompetitif tapi bayar pakai PayPal/kartu kredit. Untuk <code>.id</code>, daftarkan lewat PANDI atau registrar resmi. Domain <code>.id</code> memberi kesan lokal yang kuat dan kadang lebih dipercaya pelanggan Indonesia.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, klik Publish di proyek kamu, dan pilih opsi Custom Domain. Ikuti instruksi DNS, tambahkan record di panel registrar, tunggu propagasi, lalu klik Verify. Proses biasanya selesai kurang dari satu jam — setelah itu domain baru langsung live dengan SSL otomatis. Pelajari juga <a href="/artikel/karsa-vs-website-builder">perbandingan KARSA dengan Wix dan WordPress</a>, dan <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> untuk use case lain yang bisa kamu bangun dengan domain baru.</p>`,
  'prototype-aplikasi-startup': `
      <p>Setiap founder pernah menghadapi momen yang sama: ide produk sudah matang di kepala, tapi belum bisa diuji ke calon pengguna karena butuh waktu berminggu-minggu hire developer, atau puluhan juta untuk MVP. <strong>Prototype aplikasi startup</strong> dengan vibecoding menutup celah itu — kamu bisa punya versi klik-able dari produk dalam satu sore, lalu memvalidasinya sebelum keluar biaya besar.</p>
      <h2>Kenapa founder perlu prototype cepat</h2>
      <p>Riset startup modern berpindah dari produk pertama yang sempurna menuju produk pertama yang cukup untuk diuji. Alasannya: setiap iterasi mahal, tapi informasi dari percakapan dengan calon pengguna jauh lebih berharga daripada polishing UI sendirian. Prototype yang bisa diklik memberi tiga hal sekaligus — narasi visual untuk pitch deck, demo interaktif untuk user interview, dan eksperimen onboarding yang bisa diukur (waktu klik, drop-off, dan lain-lain).</p>
      <p>Prototype juga melatih cara berpikir produk: memecah ide besar jadi layar-layar kecil, menentukan CTA utama tiap layar, menulis copy yang menjelaskan nilai tanpa jargon. Semua lebih cepat di prototype HTML dibanding di dokumen PRD yang panjang.</p>
      <h2>Bedanya prototype dengan MVP</h2>
      <p><strong>Prototype</strong> adalah versi klik-able yang fokus pada alur dan visual. Biasanya tidak punya backend sungguhan, data statis, atau logic kompleks. Tujuannya: meyakinkan calon pengguna dan investor dengan cepat. <strong>MVP (Minimum Viable Product)</strong> adalah versi minimum yang sudah live dengan data nyata, basic logic, dan satu alur end-to-end. MVP butuh deploy ke server, database, dan integrasi payment atau email.</p>
      <p>Untuk founder tahap awal, prototype cukup sebagai alat percakapan. Tidak perlu hosting production, integrasi Stripe, atau CI/CD dulu — yang penting konsep produk bisa disampaikan. Saat sudah ada sinyal kuat dari pengguna (10–30 interview, 1–3 paid pilot), baru pindah ke MVP.</p>
      <h2>Contoh prompt KARSA untuk prototype startup</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, dan ketik prompt berikut. Ganti nama produk dan palet sesuai bisnismu. Untuk prototype aplikasi edutech "Belajar Lentera":</p>
      <p><em>"Buat prototype aplikasi web untuk startup edutech 'Belajar Lentera'. Header dengan logo teks hijau tua dan CTA 'Coba Gratis'. Hero section berisi headline 'Les privat online dengan guru pilihan', subheadline satu kalimat, dan tombol 'Daftar Sekarang'. Section fitur 3 kartu (1-on-1 tutor, jadwal fleksibel, harga transparan). Section cara kerja 4 langkah (Pilih mata pelajaran, Pilih tutor, Pilih jadwal, Mulai les via video). Section harga 3 tier (Reguler Rp 150.000, Plus Rp 250.000, Premium Rp 400.000). Footer dengan kontak email dan link Play Store. Palet hijau-putar, font Inter bersih."</em></p>
      <p>Hasilnya muncul di preview KARSA dalam hitungan detik. Minta revisi: <em>"tambah section FAQ"</em>, <em>"buat onboarding 3 langkah"</em>, atau <em>"ganti tombol CTA ke oranye kontras"</em>. Kalau perlu alur multi-halaman, minta: <em>"buat juga halaman onboarding setelah klik Daftar Sekarang, berisi form nama, email, mata pelajaran, dan tombol Lanjut"</em>.</p>
      <h2>Langkah memvalidasi prototype ke pengguna</h2>
      <ol style="margin:0 0 1.25em 1.25em">
        <li><strong>Rekrut 5–10 calon pengguna</strong> dari komunitas atau LinkedIn — yang cocok dengan persona, bukan teman dekat yang selalu bilang "keren".</li>
        <li><strong>Kirim link prototype</strong> dengan instruksi singkat: <em>"Coba klik-klik prototype ini 10 menit, kirim balik bagian yang membingungkan dan yang paling menarik"</em>.</li>
        <li><strong>Wawancara 30 menit</strong> via Zoom, minta mereka share screen selagi klik. Catat di mana ragu, scroll balik, atau senyum.</li>
        <li><strong>Iterasi</strong> 1–2 hari, ulangi dengan pengguna berikutnya. Tiga putaran cukup untuk melihat pola yang konsisten.</li>
        <li><strong>Putuskan</strong> lanjut ke MVP, pivot, atau stop — berdasarkan data, bukan perasaan.</li>
      </ol>
      <p>Wawancara dengan prototype yang klik-able memberi 10x lebih banyak sinyal dibanding mockup diam. Saat pengguna ragu di CTA, mereka bilang "yang mana ya?"; saat scroll balik ke harga, harga masih sensitif. Catat reaksi ini semua.</p>
      <h2>Cara menyebar prototype untuk pitch dan user interview</h2>
      <p>Setelah preview KARSA sesuai, klik Publish. Prototype live di subdomain gratis seperti <code>belajar-lentera.karsa.work</code> — gratis, tanpa hosting. Untuk investor pitch, lebih profesional pakai custom domain — lihat <a href="/artikel/cara-publish-website-karsa">cara publish dari KARSA</a> dan <a href="/artikel/custom-domain-karsa">panduan custom domain</a>.</p>
      <p>Sebarkan link prototype ke: calon pengguna via chat personal (bukan broadcast), co-founder dan advisor via email, grup komunitas relevan, dan investor lewat deck pitching (cantumkan QR code di slide). Untuk yang minta demo, rekam screen 60 detik pakai Loom dan sertakan di email follow-up — sering lebih efektif daripada invite meeting formal.</p>
      <h2>Kesalahan yang sering terjadi saat bikin prototype</h2>
      <ul>
        <li><strong>Terlalu banyak fitur di prototype pertama</strong> — pilih satu alur utama, polish itu.</li>
        <li><strong>Copy yang menyesatkan</strong> — prototype harus jujur terlihat seperti prototype, bukan produk jadi.</li>
        <li><strong>Tidak ada call-to-action akhir</strong> — tiap halaman ujung butuh CTA jelas: "Daftar", "Pesan Demo", atau "Coba Sekarang".</li>
        <li><strong>Tidak mengukur apa-apa</strong> — pasang analytics sederhana (Google Analytics atau Plausible) supaya tahu di mana drop-off.</li>
        <li><strong>Lupa mencatat reaksi pengguna</strong> — simpan catatan wawancara, highlight kalimat verbatim yang berulang untuk dasar iterasi.</li>
      </ul>
      <p>Yang sering menyelamatkan prototype: tampilkan disclaimer <em>"Ini prototype untuk riset, bukan produk jadi"</em> di header — pengguna lebih jujur menyampaikan kritik, tidak ada salah paham soal kematangan produk.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama produk dan fitur sesuai ide startupmu, dan lihat prototype klik-able dalam menit. Untuk konteks vibecoding dan cara kerja AI-nya, pelajari <a href="/artikel/apa-itu-vibecoding">apa itu vibecoding</a>. Kalau prototype siap diuji, daftarkan ke <a href="/artikel/daftar-google-search-console">Google Search Console</a> agar fondasi SEO sudah siap. Paket gratis KARSA menyertakan 30 prompt AI per hari — cukup untuk eksplorasi awal tanpa keluar biaya. Upgrade ke Pro hanya kalau butuh iterasi harian atau custom domain tanpa watermark.</p>`,
  'seo-website-umkm': `
      <p>Website UMKM yang bagus belum tentu ditemukan pelanggan. Banyak pemilik usaha sudah bikin landing page keren, tapi ketika dicari di Google dengan kata kunci yang relevan — "jasa sablon kaos Jakarta", "kue ulang tahun Bogor" — hasilnya tidak muncul. Padahal calon pelanggan mengetik kata kunci yang sama setiap hari. Di sinilah <strong>SEO website UMKM</strong> berperan: teknik supaya bisnismu muncul di halaman pertama Google untuk pencarian yang paling dekat dengan produkmu.</p>
      <h2>SEO itu apa, dan kenapa UMKM perlu peduli</h2>
      <p>SEO (Search Engine Optimization) adalah kumpulan teknik supaya halaman situsmu lebih relevan di mata Google untuk kata kunci tertentu. Hasilnya adalah penempatan organik — posisi teratas, bahkan sebelum iklan. Untuk UMKM, ini krusial karena tiga hal: calon pelanggan Indonesia makin sering mencari lewat Google sebelum membeli, iklan berbayar makin mahal, dan kepercayaan pada hasil organik lebih tinggi daripada banner iklan. Tidak seperti toko offline, bisnis online bisa ditemukan dari mana saja selama halaman muncul untuk kata kunci yang tepat.</p>
      <h2>Langkah pertama: riset kata kunci yang realistis</h2>
      <p>Banyak UMKM langsung loncat ke "optimasi Google" tanpa tahu kata kunci apa yang dipakai calon pelanggan. Cara paling sederhana: ketik apa yang ingin Anda jual di kolom Google, lalu lihat saran otomatis (autocomplete) di bagian bawah. Itu frasa yang benar-benar diketik orang Indonesia setiap hari — contoh untuk kue: "kue ulang tahun murah", "kue ulang tahun Bogor", "tart custom Jakarta". Untuk analisis lebih dalam, gunakan tool gratis seperti Google Keyword Planner atau Ubersuggest. Pilih kata kunci dengan volume pencarian cukup (minimal 50 pencarian/bulan) dan kompetisi rendah. Kata kunci kompetisi tinggi seperti "jasa pembuatan website" butuh waktu lama untuk ranking; lebih realistis ke "jasa pembuatan website UMKM Jakarta" yang lebih spesifik dan memiliki niat beli lebih kuat.</p>
      <h2>Optimasi halaman: judul, meta, dan struktur</h2>
      <p>Setelah dapat kata kunci, tempatkan secara alami di empat tempat: judul halaman (title tag), meta description, heading utama (h1), dan paragraf pertama. Setiap halaman idealnya fokus pada SATU kata kunci utama plus 2–3 variasi. Hindari menumpuk kata kunci berulang kali (keyword stuffing) — Google menghukum praktik itu. Contoh penerapan: untuk halaman jasa sablon kaos di Jakarta, judulnya bisa <em>"Jasa Sablon Kaos Murah Jakarta — Hasil 3 Hari | Nama UMKM"</em>. Di KARSA, minta AI langsung menghasilkan halaman dengan struktur SEO yang benar: <em>"Buat landing page jasa sablon kaos di Jakarta dengan section: hero, daftar harga 3 paket, galeri hasil sablon, testimoni pelanggan, dan formulir WhatsApp. Gunakan kata kunci 'sablon kaos Jakarta' di judul dan paragraf pertama. Palet oranye-hitam modern."</em> Yang tidak kalah penting: setiap halaman harus punya meta description 140–160 karakter yang mengandung kata kunci dan ajakan bertindak. Ini yang muncul di bawah judul Google dan sering menentukan apakah orang mengklik situs Anda atau kompetitor.</p>
      <h2>Kecepatan situs dan pengalaman mobile</h2>
      <p>Google menggunakan Core Web Vitals — metrik yang menilai kecepatan muat, kestabilan visual, dan responsivitas — sebagai sinyal ranking. Pelanggan Indonesia kebanyakan membuka situs dari HP dengan koneksi 4G. Kalau situs butuh 7 detik untuk tampil, 60% calon pelanggan sudah pindah ke kompetitor. Solusinya: kompres gambar ke format WebP di bawah 200 KB per foto, hindari video autoplay, pakai system font atau maksimal 1–2 font custom, pastikan tombol tap-target minimal 48 px di mobile, dan uji lewat PageSpeed Insights dengan target skor 80+. UMKM yang pakai KARSA mendapat keuntungan struktural: output HTML ringan, tidak ada widget berat, dan otomatis responsive.</p>
      <h2>Submit sitemap dan pantau performa</h2>
      <p>Setelah situs dipublish (lihat <a href="/artikel/cara-publish-website-karsa">cara publish dari KARSA</a>), daftarkan ke Google Search Console. Tool gratis ini memberi tahu keyword apa yang membawa pengunjung, halaman mana yang paling banyak muncul, dan error teknis yang perlu diperbaiki — ibarat memiliki panel analisis yang dulu hanya dimiliki perusahaan besar. Panduan lengkapnya ada di <a href="/artikel/daftar-google-search-console">cara daftar Google Search Console</a>. Yang sering dilupakan: sitemap.xml perlu di-submit supaya Google menemukan semua halaman baru secara otomatis; KARSA menghasilkan sitemap otomatis, tapi tetap harus didaftarkan sekali.</p>
      <h2>SEO lokal: cara muncul di pencarian "sekitar saya"</h2>
      <p>Pelanggan UMKM sering mencari dengan embel-embel lokasi: "kafe estetik dekat sini", "tukang service AC Cibubur", "klinik gigi buka Sabtu". Untuk muncul di pencarian lokal, ada tiga hal wajib: buat Google Business Profile (gratis, verifikasi via surat), konsistenkan NAP (Name, Address, Phone) di semua platform, dan kumpulkan review pelanggan — minta yang puas menulis 5–10 review pertama. Konten situs juga harus menyebut nama kota atau kelurahan secara natural, misalnya "Kafe kami di kawasan Kemang, Jakarta Selatan, buka dari jam 8 pagi sampai 10 malam" — ini membantu Google memahami area layanan Anda.</p>
      <h2>Kesalahan umum yang harus dihindari</h2>
      <p>Enam jebakan SEO UMKM: copy-paste deskripsi dari website lain (Google menghukum duplikat konten), tidak update konten berbulan-bulan (tambahkan 1–2 artikel blog per bulan), pakai subdomain gratis untuk bisnis serius (lihat <a href="/artikel/custom-domain-karsa">custom domain di KARSA</a>), fokus hanya pada satu kata kunci, tidak mengukur lewat Search Console, dan mengharap hasil instan. Yang membedakan UMKM yang berhasil: konsistensi menulis dan update situs setiap minggu, walau cuma 200–300 kata per artikel. Akumulasi 6 bulan konten orisinal menjadi aset organik yang terus membawa trafik.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a> dan minta AI untuk <em>"buat landing page jasa [nama bisnis] di [kota] dengan struktur SEO lengkap, section hero dengan kata kunci utama, daftar harga, galeri, testimoni, dan form WhatsApp"</em>. Publish ke <code>namausaha.karsa.work</code>, daftarkan ke <a href="/artikel/daftar-google-search-console">Google Search Console</a>, dan tambahkan Google Business Profile untuk SEO lokal. Pelajari juga <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> dan <a href="/artikel/karsa-vs-website-builder">KARSA vs Wix vs WordPress</a>. Konsistensi 3–6 bulan dengan fondasi benar akan membawa hasil yang bertahan — tanpa bayar iklan setiap bulan.</p>`,
  'prompt-landing-page-konversi': `
      <p>Landing page UMKM paling sering gagal bukan karena tampilannya jelek, tapi karena <strong>prompt</strong> yang diberikan ke AI terlalu umum. Hasilnya: halaman jadi "bagus tapi generik" — pengunjung scroll, tidak klik tombol WhatsApp, lalu pergi. Artikel ini membongkar struktur <em>prompt landing page konversi</em> yang menghasilkan halaman dengan CTA jelas, hook kuat, dan copy yang membuat orang terdorong bertindak dalam 5 detik pertama.</p>
      <h2>Kenapa landing page UMKM jarang konversi</h2>
      <p>Kesalahan paling umum UMKM ketika minta AI bikin landing page: prompt terlalu singkat ("buatkan landing page untuk toko saya"), tidak menyebut siapa target pembelinya, tidak menentukan satu CTA utama, dan tidak ada bukti sosial. Tanpa arah ini, AI menghasilkan halaman cantik tapi ambigu — copy generic seperti "solusi terbaik untuk Anda" yang tidak menyentuh masalah spesifik pelanggan. Landing page yang konversi selalu menjawab tiga pertanyaan dalam 5 detik: untuk siapa produk ini, masalah apa yang dipecahkan, dan apa yang harus dilakukan pengunjung berikutnya. Prompt yang baik memasukkan ketiganya secara eksplisit.</p>
      <h2>Struktur hero-hook-CTA yang terbukti menghasilkan klik</h2>
      <p>Struktur paling terbukti untuk UMKM Indonesia adalah <strong>hero-hook-CTA</strong>: hero dengan headline + subheadline + tombol utama, section masalah &amp; solusi, tiga benefit, satu bukti sosial, FAQ singkat, lalu CTA akhir. Setiap section harus punya satu tujuan. Hero meyakinkan di 5 detik, masalah-solusi membuat orang merasa "ini gue banget", benefit menjelaskan kenapa produk kamu berbeda, bukti sosial menurunkan keraguan, FAQ menjawab keberatan terakhir, CTA akhir mengambil keputusan. Yang sering dilupakan UMKM: tombol CTA harus spesifik, bukan "Klik di sini" — gunakan "Pesan via WhatsApp", "Daftar Sekarang", atau "Lihat Menu Lengkap". Tiap CTA harus mengarahkan ke satu aksi, bukan link ke halaman lain.</p>
      <h2>Contoh prompt KARSA yang tinggal salin</h2>
      <p>Berikut prompt yang bisa langsung dipakai — ganti bagian dalam tanda kurung dengan detail usahamu:</p>
      <p><em>"Buat landing page untuk [nama bisnis], sebuah [jenis usaha] di [kota]. Target: [siapa pelanggan, misal ibu rumah tangga usia 25-40]. Struktur: hero dengan headline benefit utama + subheadline + tombol WhatsApp; section 3 masalah pelanggan dan solusi; section 3 benefit utama dengan ikon; section testimoni 3 pelanggan placeholder; section FAQ 4 pertanyaan; footer dengan alamat dan jam buka. Palet warna [warna1] dan [warna2], font modern, mobile-first, tanpa gambar eksternal."</em></p>
      <p>Prompt ini menghasilkan halaman dengan copy siap edit, bukan placeholder Lorem Ipsum. Setelah preview muncul, minta revisi spesifik: <em>"Ubah headline hero jadi fokus ke benefit hemat waktu, bukan harga murah"</em>. Iterasi 2–3 kali biasanya cukup untuk dapat versi yang siap publish.</p>
      <h2>Iterasi cepat di KARSA sampai CTA diklik</h2>
      <p>Keunggulan KARSA dibanding website builder drag-drop: setiap iterasi hanya butuh satu kalimat perintah. Mau ubah headline? <em>"Buat headline hero lebih emosional, fokus ke kebahagiaan keluarga"</em>. Mau tambah section promo? <em>"Tambah banner promo di atas hero: 'Diskon 20% sampai 17 Agustus'"</em>. Mau optimize CTA? <em>"Ganti tombol CTA jadi 'Pesan via WhatsApp 0812xxx', warna hijau WhatsApp, ukuran lebih besar"</em>. AI menulis kode baru, preview update real-time, kamu tetap di satu halaman. Bandingkan dengan website builder di mana setiap perubahan layout butuh klik dan drag manual yang berbeda tiap section.</p>
      <p>Untuk UMKM, ini berarti waktu dari "ide landing" ke "landing live" bisa 30 menit, bukan 2 minggu. Pelajari pola iterasi lebih dalam di <a href="/artikel/contoh-prompt-karsa-umkm">contoh prompt KARSA untuk UMKM</a> dan <a href="/artikel/bikin-landing-page-dengan-ai">cara bikin landing page dengan AI</a>.</p>
      <h2>Kesalahan prompt yang bikin landing page mandek</h2>
      <ul>
        <li><strong>Terlalu umum</strong> — "buatkan landing page untuk usaha saya" tanpa konteks: hasilkan copy yang tidak relevan dengan produk spesifik.</li>
        <li><strong>Banyak CTA sekaligus</strong> — "ada tombol WhatsApp, Instagram, email, dan contact form" membingungkan pengunjung. Pilih satu CTA utama, yang lain subordinate.</li>
        <li><strong>Tidak sebut target pelanggan</strong> — copy jadi generik untuk semua orang, efektif untuk siapa pun. Selalu sebut siapa pembelinya.</li>
        <li><strong>Skip bukti sosial</strong> — tanpa testimoni atau angka (misal "500+ pelanggan"), landing page terasa klaim kosong.</li>
        <li><strong>Tidak minta revisi</strong> — prompt pertama jarang sempurna. Sisakan 2–3 iterasi untuk polish copy dan CTA.</li>
        <li><strong>Lupa uji di HP</strong> — 80% pengunjung UMKM buka dari mobile. Selalu preview dalam mode mobile dan pastikan tombol tap-target minimal 48 px.</li>
      </ul>
      <p>Cara mudah ingat: setiap bagian landing page harus menjawab pertanyaan yang sama — "<em>apa untungnya buat saya, dan apa yang harus saya klik sekarang?</em>". Kalau satu section tidak menjawab dua hal itu, revisi atau hapus.</p>
      <h2>Ukur konversi dan optimalkan dari data, bukan feeling</h2>
      <p>Landing page yang konversi adalah yang diukur, bukan yang terasa bagus. Setelah publish, pasang satu analytics gratis (Google Analytics atau Plausible) dan pantau tiga metrik: <strong>visitor per minggu</strong>, <strong>bounce rate</strong> (ideal di bawah 60%), dan <strong>klik CTA</strong>. Kalau bounce rate di atas 70%, masalah biasanya di hero — orang tidak paham produk dalam 5 detik. Kalau visitor datang tapi klik CTA rendah, masalah ada di trust section (belum ada bukti sosial) atau CTA-nya tersembunyi. Pelajari dasar SEO supaya trafik awal datang di <a href="/artikel/seo-website-umkm">panduan SEO UMKM</a>, dan daftarkan situs ke Search Console agar data performa selalu tersedia gratis.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di bagian contoh di atas, ganti bagian dalam kurung dengan detail usahamu, dan lihat preview landing page dalam 30 detik. Iterasi 2–3 kali sampai CTA jelas dan copy terasa spesifik. Publish ke <code>namabisnis.karsa.work</code> atau domain sendiri, lalu ukur konversi dari minggu pertama. Untuk prompt lain yang siap pakai, baca <a href="/artikel/contoh-prompt-karsa-umkm">contoh prompt KARSA untuk UMKM</a>, dan untuk konteks landing page secara umum, pelajari <a href="/artikel/bikin-landing-page-dengan-ai">cara bikin landing page dengan AI</a>. Prompt spesifik selalu mengungguli template generik — dan KARSA membuatnya bisa dilakukan sore ini.</p>`,
  'website-toko-pakaian-thrift': `
      <p>Jualan thrift identik dengan galeri foto di WhatsApp dan story Instagram yang hilang dalam 24 jam. Saat pelanggan bilang "yang kemarin masih ada?", kamu harus scroll ratusan chat. Website toko pakaian thrift mengubah semua foto itu jadi etalase permanen yang bisa dibuka siapa saja, kapan saja, lewat satu link.</p>
      <h2>Kenapa toko thrift butuh website, bukan cuma sosmed</h2>
      <p>Bisnis thrift sangat bergantung pada kecepatan membalas chat — kalau terlambat, pembeli pindah ke lapak lain. Website yang menampilkan katalog rapi dengan filter ukuran dan kondisi membuat pelanggan bisa lihat sendiri sebelum chat, sehingga pertanyaan yang masuk tinggal "size M ready?" bukan "barangmu ada apa saja?". Untuk fondasi katalog online secara umum, baca juga <a href="/artikel/katalog-produk-online-umkm">panduan katalog produk online UMKM</a> — banyak prinsipnya sama, hanya perlu adaptasi ke konteks thrift.</p>
      <h2>Isi halaman yang wajib ada</h2>
      <ul>
        <li><strong>Hero singkat</strong> — nama toko, tagline, dan CTA utama "Lihat Katalog"</li>
        <li><strong>Katalog produk</strong> — grid foto, nama item, ukuran, harga, kondisi (90%/95%/like new)</li>
        <li><strong>Filter ukuran</strong> — S/M/L/XL atau All Size, agar pembeli tidak scroll panjang</li>
        <li><strong>Tombol WhatsApp</strong> — mengambang atau per-item, supaya pelanggan langsung chat untuk nego atau stok</li>
        <li><strong>Kebijakan retur singkat</strong> — dua baris sudah cukup, yang penting jelas</li>
        <li><strong>Footer dengan kontak</strong> — Instagram, alamat offline kalau ada, jam buka toko fisik</li>
      </ul>
      <h2>Contoh prompt KARSA untuk toko thrift</h2>
      <p>Buka proyek baru di KARSA, lalu ketik seperti ini: <em>"Buat website toko pakaian thrift 'Second Chance Jakarta' dengan hero pink-soft, grid katalog 3 kolom yang menampilkan foto, nama item, ukuran, kondisi, dan harga, filter ukuran di atas grid, floating button WhatsApp ke 0812-3456-7890, section kebijakan retur singkat, dan footer dengan Instagram @secondchance.jkt. Warna utama dusty rose dan cream."</em>. AI akan menghasilkan preview lengkap dalam satu kali generate. Kalau ada bagian yang ingin diubah, tinggal bilang "ganti foto placeholder jadi slider" atau "tambah filter kondisi (90%/95%/like new)".</p>
      <h2>Tips foto dan copy biar kelihatan profesional</h2>
      <p>Foto dari kamera HP cukup, asal konsisten: background polos (dinding putih atau hanger netral), pencahayaan alami di dekat jendela, dan sudut yang sama untuk semua item. Copy yang konversi singkat dan spesifik — bukan "baju bagus banget" tapi "kemeja flannel Uniqlo lama, kondisi 95%, size L, lebar dada 52 cm, harga 120rb". Ukuran badan per item adalah pembeda utama toko thrift profesional versus yang amatir. Untuk inspirasi prompt lain yang siap pakai, koleksi prompt KARSA untuk UMKM ada di <a href="/artikel/contoh-prompt-karsa-umkm">contoh prompt KARSA</a>, dan untuk pola vibecoding di bisnis kecil umumnya bisa disimak di <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM Indonesia</a>.</p>
      <h2>Cara nambah stok tanpa ribet</h2>
      <p>Setelah website live, tiap ada barang baru, buka proyek KARSA dan minta AI update: "tambah produk baru: cardigan knit warna coklat, size M, kondisi 95%, harga 85rb". Iterasi biasanya kurang dari satu menit. Versi gratis sudah cukup untuk update harian; kalau traffic mulai naik dan perlu AI lebih sering untuk ubah layout, pertimbangkan Pro. Sebelum publish pertama, pastikan judul halaman, meta description, dan og image terisi — ini otomatis ter-generate dari KARSA saat publish, tinggal cek di tab SEO editor. Kalau punya lebih dari 50 item, pertimbangkan bagi katalog jadi beberapa halaman berdasarkan kategori (jaket, kemeja, celana, dress) supaya load tetap cepat dan pembeli tidak overwhelmed. Batch update juga bisa: foto-foto item baru dikumpulkan di satu album, lalu minta AI "generate deskripsi singkat untuk 10 item thrift sekaligus dalam tabel". Cara ini memotong waktu input manual hingga setengahnya.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama resto, daftar menu, dan nomor WhatsApp sesuai kondisi kamu, lalu lihat preview-nya. Paket gratis sudah termasuk 30 prompt AI per hari, cukup untuk eksplorasi awal tanpa keluar biaya. Untuk variasi lain, pelajari juga <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> dan <a href="/artikel/website-warung-makan">panduan website warung makan</a> — pola yang sama bisa dipakai untuk landing catering, halaman reservasi, atau promo musiman seperti menu Ramadan.</p>`,
  'katalog-menu-restoran-online': `
      <p>Restoran dan kafe kecil di Indonesia biasanya mengandalkan dua hal untuk memperkenalkan menu: daftar PDF yang dishare lewat WhatsApp, dan pajangan di dinding yang hanya dilihat pelanggan yang datang. Masalahnya, pelanggan baru di luar radius 2 km tidak pernah melihat menu itu sama sekali. <strong>Katalog menu restoran online</strong> adalah versi yang bisa dibuka siapa saja, kapan saja, lewat satu link — tanpa harus download atau install apa pun.</p>
      <h2>Kenapa katalog menu online lebih efektif dari PDF</h2>
      <p>PDF memang cepat dibuat, tapi tidak mobile-friendly: di HP, teksnya kecil, layout-nya berantakan, dan pelanggan harus scroll berputar-putar. Katalog online berbasis HTML ringan menampilkan menu dengan grid rapi, foto yang bisa diketuk untuk memperbesar, dan tombol WhatsApp yang langsung terbuka di aplikasi chat. Cukup bookmark satu link.</p>
      <p>Keunggulan lain: katalog online bisa di-update dalam hitungan menit. Saat stok bahan berubah atau ada menu baru, owner tinggal minta AI generate versi terbaru dan publish ulang. Pelanggan selalu melihat versi terkini, bukan PDF lama yang dishare enam bulan lalu. Untuk fondasi katalog online secara umum, pola yang sama berlaku di <a href="/artikel/katalog-produk-online-umkm">panduan katalog produk online UMKM</a> — hanya konteksnya diganti ke hidangan.</p>
      <h2>Isi minimum katalog menu restoran</h2>
      <ul>
        <li><strong>Header</strong> — nama resto, tagline singkat, logo teks, dan floating button WhatsApp</li>
        <li><strong>Section kategori</strong> — Appetizer, Main Course, Dessert, Drinks (bisa di-scroll atau pakai tab)</li>
        <li><strong>Item menu</strong> — foto, nama, deskripsi 1-2 kalimat, harga, label pedas/halal/vegetarian bila perlu</li>
        <li><strong>Tombol pesan per item</strong> — biar pelanggan langsung chat untuk order atau tanya stok</li>
        <li><strong>Info resto</strong> — alamat, jam buka, link Google Maps, dan kontak WhatsApp utama</li>
        <li><strong>Footer</strong> — akun Instagram, link ke marketplace (GoFood/GrabFood) bila ada</li>
      </ul>
      <p>Tidak perlu sistem keranjang atau payment gateway di tahap awal. Pelanggan lihat menu, tertarik, lalu klik tombol WhatsApp untuk order. Prosesnya tetap manusiawi, owner tetap dapat pesanan rapi, dan tidak ada biaya komisi marketplace.</p>
      <h2>Contoh prompt untuk KARSA</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt di bawah. Ganti teks dalam kurung dengan detail resto kamu sendiri.</p>
      <p><em>"Buat katalog menu online untuk kafe 'Kopi Temu 27' di Bandung. Header dengan logo teks coklat tua dan tagline 'Ngopi santai sejak 2019'. Tab kategori: Coffee, Non-Coffee, Snack. Grid 2 kolom berisi 12 item: 5 kopi (Es Kopi Susu Rp 22.000, Americano Rp 18.000, Cappuccino Rp 25.000, Kopi Tubruk Rp 15.000, Latte Rp 28.000), 3 non-coffee (Matcha Latte Rp 28.000, Coklat Panas Rp 20.000, Yuzu Soda Rp 25.000), 4 snack (Pisang Goreng Rp 18.000, Roti Bakar Rp 20.000, Tahu Krispi Rp 22.000, Croffle Rp 28.000). Setiap item ada foto, deskripsi singkat, harga, dan tombol 'Pesan via WhatsApp' yang membuka chat ke 081234567890 dengan pesan otomatis. Section bawah berisi alamat, jam buka (08.00-22.00), link Google Maps, dan Instagram @kopitemu27. Palet warna krem dan coklat, font hangat, mobile-first."</em></p>
      <p>Setelah preview muncul, minta revisi: <em>"tambah section menu seasonal di atas tab"</em>, <em>"ganti palet ke hijau sage dan putih"</em>, atau <em>"buat badge 'Best Seller' di 3 item teratas"</em>. Tiap iterasi cukup satu kalimat.</p>
      <h2>Foto menu yang menggugah selera</h2>
      <p>HP kamera sudah cukup. Tiga aturan yang paling berpengaruh: cahaya alami dari samping, angle 45 derajat untuk makanan berkuah, dan background meja kayu atau kain polos. Foto di jam sepi ketika piring masih penuh dan uap masih naik. Edit ringan dengan Snapseed sudah cukup untuk menyamakan tone warna antar foto. Tidak perlu foto setiap menu — pilih 8-12 hidangan signature yang paling laris atau paling fotogenik. Resolusi ideal 800-1000 piksel di sisi panjang: cukup tajam di layar HP, tidak membebani bandwidth pelanggan 4G.</p>
      <h2>Cara menyebar link katalog menu</h2>
      <p>Setelah preview KARSA sesuai, klik Publish. Katalog live di subdomain gratis seperti <code>kopi-temu-27.karsa.work</code> — tanpa setup hosting, tanpa biaya bulanan. Untuk domain sendiri seperti <code>kopitemu27.com</code>, tambahkan di modal publish dan ikuti instruksi DNS. Panduan publish lengkap ada di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>.</p>
      <p>Sebarkan link itu: taruh di bio Instagram, deskripsi TikTok, header WhatsApp Business, Google Business Profile resto, dan QR code di tatakan gelas. Setiap ada menu baru, broadcast ke pelanggan setia: <em>"Hai kak, ada menu baru nih: [nama menu], mau coba? Chat aja via link di bio ya"</em>. Link permanen membuat pelanggan tidak perlu simpan file.</p>
      <h2>Kesalahan yang sering terjadi</h2>
      <ul>
        <li><strong>Harga tidak konsisten</strong> — campur "Rp 22.000" dan "22K" di item yang berbeda bikin pelanggan bingung. Pilih satu format.</li>
        <li><strong>Foto terlalu kecil atau pecah</strong> — di HP, thumbnail 200 piksel jadi tidak terbaca. Minimal 600 piksel.</li>
        <li><strong>Tidak ada tombol WhatsApp</strong> — pelanggan harus copy nomor manual, biasanya batal di tengah jalan. Tombol harus satu ketukan.</li>
        <li><strong>Menu tidak update</strong> — kalau bahan kosong, ganti label "Stok Habis" daripada hapus item, supaya pelanggan tahu pernah ada.</li>
        <li><strong>Tidak mobile-friendly</strong> — 90 persen pelanggan buka dari HP. Katalog yang didesain untuk desktop akan membuat teks kecil dan tombol sulit diketuk.</li>
      </ul>
      <p>Kuncinya adalah katalog yang terasa hidup dan dijaga: ganti menu musiman, tampilkan promo weekday vs weekend, dan respon chat dalam hitungan menit. Katalog online bukan pengganti keramahan pelayanan, tapi pendukung yang membuat pelanggan baru percaya untuk order pertama.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama resto, daftar menu, dan nomor WhatsApp sesuai kondisi kamu, lalu lihat preview-nya. Paket gratis sudah termasuk 30 prompt AI per hari, cukup untuk eksplorasi awal tanpa keluar biaya. Untuk variasi lain, pelajari juga <a href="/artikel/website-warung-makan">panduan website warung makan</a> dan <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> — pola yang sama bisa dipakai untuk landing catering, halaman reservasi, atau promo musiman seperti menu Ramadan.</p>`,
  'landing-page-jasa-freelance': `
      <p>Freelancer sering punya hasil kerja bagus, tetapi bukti itu tersebar di Instagram, folder Drive, marketplace, dan chat lama. Calon klien akhirnya harus mencari sendiri sebelum memahami kemampuanmu. <strong>Landing page jasa freelance</strong> merangkum semuanya dalam satu tautan: siapa yang kamu bantu, hasil apa yang ditawarkan, contoh pekerjaan, kisaran paket, dan cara menghubungi kamu.</p>
      <h2>Mengapa freelancer perlu landing page sendiri</h2>
      <p>Profil media sosial berguna untuk membangun audiens, tetapi tampilannya mengikuti aturan platform. Postingan terbaik bisa tenggelam, bio hanya memuat sedikit informasi, dan calon klien mudah teralihkan oleh konten lain. Landing page memberi alur yang kamu kendalikan dari pembuka sampai tombol kontak. Tautannya dapat dipasang di bio, proposal, CV, tanda tangan email, atau dikirim saat ada orang meminta portofolio.</p>
      <p>Halaman ini bukan pengganti percakapan. Fungsinya menyaring calon klien dan menjawab pertanyaan dasar sebelum chat dimulai. Jika layanan, proses, dan contoh hasil sudah jelas, percakapan dapat langsung membahas kebutuhan, jadwal, serta anggaran.</p>
      <h2>Susun halaman mengikuti pertanyaan calon klien</h2>
      <p>Urutan terbaik bukan sekadar yang terlihat cantik, melainkan yang mengurangi keraguan sedikit demi sedikit. Gunakan struktur sederhana berikut:</p>
      <ul>
        <li><strong>Hero</strong> — sebutkan keahlian, target klien, manfaat utama, dan satu tombol kontak.</li>
        <li><strong>Layanan</strong> — tampilkan tiga sampai lima jasa yang benar-benar ingin kamu jual.</li>
        <li><strong>Portofolio</strong> — pilih tiga proyek terbaik, lalu jelaskan masalah, pekerjaanmu, dan hasilnya.</li>
        <li><strong>Proses kerja</strong> — ringkas tahapan briefing, pengerjaan, revisi, dan penyerahan.</li>
        <li><strong>Paket atau harga awal</strong> — beri kisaran agar calon klien dapat menilai kecocokan anggaran.</li>
        <li><strong>Testimoni dan CTA</strong> — sertakan bukti yang benar, lalu arahkan ke WhatsApp atau email.</li>
      </ul>
      <p>Kalau belum punya banyak proyek, gunakan satu studi kasus yang lengkap daripada enam gambar tanpa cerita. Proyek pribadi juga boleh, asalkan diberi label jelas dan menunjukkan cara berpikirmu.</p>
      <h2>Tulis penawaran yang spesifik, bukan serba bisa</h2>
      <p>Kalimat seperti “menerima segala jenis desain” terdengar luas, tetapi sulit dipercaya. Lebih kuat jika kamu menyebut target dan hasil: “Saya membantu kedai kopi dan bisnis kuliner membuat identitas visual yang konsisten dalam tujuh hari.” Calon klien segera tahu apakah layananmu relevan. Prinsip yang sama berlaku untuk penulis, fotografer, editor video, penerjemah, konsultan, maupun pengembang web.</p>
      <p>Pilih satu tindakan utama. Jika tujuanmu mendapatkan brief melalui WhatsApp, gunakan tombol yang jelas seperti “Konsultasikan Proyek” dan ulangi setelah portofolio serta paket. Hindari menampilkan WhatsApp, email, Instagram, Telegram, dan lima marketplace dengan bobot yang sama. Untuk mempelajari susunan hero dan CTA lebih dalam, baca <a href="/artikel/prompt-landing-page-konversi">panduan prompt landing page konversi</a>.</p>
      <h2>Contoh prompt KARSA untuk jasa freelance</h2>
      <p>Kamu tidak harus menyusun kode dari nol. Tulis brief yang memuat profesi, target klien, gaya visual, isi portofolio, serta CTA. Berikut contoh yang dapat disesuaikan:</p>
      <p><em>"Buat landing page jasa freelance untuk 'Nadia Putri', desainer identitas merek yang membantu UMKM kuliner di Jakarta. Hero berisi headline manfaat, subheadline singkat, foto profil placeholder, dan tombol 'Konsultasikan Proyek' ke WhatsApp 081234567890. Tambahkan tiga layanan (logo, kemasan, dan panduan merek), tiga studi kasus dengan bagian masalah-solusi-hasil, proses kerja empat langkah, paket mulai Rp 2.500.000, tiga testimoni placeholder yang diberi label contoh, FAQ, serta footer berisi email. Gunakan palet krem, merah bata, dan hitam; gaya editorial bersih; mobile-first."</em></p>
      <p>Ganti nama, bidang, kota, paket, dan kontak dengan data sebenarnya. Jangan menerbitkan testimoni placeholder sebagai ulasan sungguhan. Jika belum ada testimoni, ubah bagian itu menjadi “Cara saya bekerja” atau tampilkan angka yang dapat dibuktikan, misalnya jumlah proyek selesai.</p>
      <h2>Periksa preview sebelum diterbitkan</h2>
      <p>Setelah KARSA menghasilkan halaman, lihat live preview dalam ukuran desktop dan ponsel. Periksa apakah headline terbaca tanpa scroll, tombol kontak mudah diketuk, gambar tidak terpotong, dan teks paket tidak terlalu kecil. Klik semua tautan serta pastikan nomor WhatsApp dan pesan awal sudah benar. Kamu dapat meminta revisi satu per satu, misalnya “buat tombol CTA lebih kontras” atau “ringkas deskripsi studi kasus menjadi tiga kalimat”.</p>
      <p>Pastikan setiap contoh kerja punya konteks. Gambar logo tanpa penjelasan tidak menunjukkan kontribusimu, sedangkan studi kasus singkat membantu calon klien memahami nilai proses. Untuk dasar pembuatan halaman dan pola iterasi, pelajari juga <a href="/artikel/bikin-landing-page-dengan-ai">cara bikin landing page dengan AI</a>.</p>
      <h2>Publish, bagikan, lalu ukur respons</h2>
      <p>Saat halaman siap, publish ke subdomain <code>namamu.karsa.work</code> atau gunakan domain sendiri. Pasang tautannya di bio media sosial, profil marketplace, LinkedIn, proposal PDF, dan pesan balasan cepat WhatsApp Business. Jangan hanya menghitung jumlah pengunjung; catat berapa orang yang mengklik CTA, mengirim brief, dan akhirnya menjadi klien.</p>
      <p>Perbarui portofolio setiap selesai proyek yang lebih kuat. Ubah urutan studi kasus berdasarkan jenis klien yang ingin kamu dapatkan berikutnya. Agar halaman lebih mudah ditemukan melalui Google, lanjutkan dengan <a href="/artikel/seo-website-umkm">dasar SEO website untuk usaha kecil</a>: pilih kata kunci layanan dan lokasi yang realistis, lalu tulis secara alami pada judul dan deskripsi.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt contoh, lalu ganti semua detail dengan layanan dan bukti kerja milikmu. Paket gratis menyediakan 30 prompt AI per hari dan proyek unlimited, sehingga kamu dapat mencoba beberapa susunan tanpa biaya awal. Fokuskan versi pertama pada satu target klien, tiga karya terbaik, dan satu CTA. Landing page yang ringkas tetapi jelas lebih berguna daripada portofolio besar yang tidak pernah selesai.</p>`,
  'website-salon-kecantik': `
      <p>Salon kecantikan dan barbershop kecil biasanya mengandalkan pelanggan yang lewat di depan toko atau yang sudah kenal langganan. Saat tutup sehari karena liburan, atau pindah ke lokasi baru, basis pelanggan lama sulit mencari tahu. <strong>Website salon kecantikan</strong> adalah etalase permanen yang bisa dibuka siapa saja lewat satu link: daftar layanan, harga, hasil kerja, jam buka, dan tombol booking ke WhatsApp.</p>
      <h2>Kenapa salon butuh halaman sendiri, bukan cuma Instagram</h2>
      <p>Instagram bagus untuk menunjukkan hasil karya, tetapi tidak nyaman menampilkan struktur layanan dan harga secara konsisten. Highlight biasanya hanya bertahan 24 jam, dan pelanggan baru harus scroll lama untuk menemukan harga potong rambut atau harga facial. Dengan website, pelanggan baru bisa langsung lihat dalam 10 detik apakah salonmu cocok untuk mereka, lengkap dengan bukti visual dari portofolio.</p>
      <p>Link website juga bisa dipasang di Google Business Profile, stempel struk, banner WhatsApp Business, dan brosur kartu nama. Pelanggan yang puas tinggal share link itu ke teman tanpa harus screenshot. Untuk konteks umum bisnis kecil dan UMKM, pola yang sama berlaku di <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM Indonesia</a>.</p>
      <h2>Isi minimum halaman salon</h2>
      <ul>
        <li><strong>Hero singkat</strong> — nama salon, satu kalimat keunggulan, dan tombol "Booking Sekarang" ke WhatsApp</li>
        <li><strong>Daftar layanan</strong> — potong, warnai, facial, creambath, manicure, dengan harga dan durasi</li>
        <li><strong>Galeri hasil</strong> — 6–12 foto before-after atau hasil akhir yang rapi</li>
        <li><strong>Tim stylist</strong> — foto dan spesialisasi singkat, supaya pelanggan bisa pilih</li>
        <li><strong>Jam buka dan alamat</strong> — jadwal lengkap, link Google Maps, area parkir</li>
        <li><strong>Testimoni</strong> — kutipan singkat dari pelanggan tetap, dengan label bulan dan layanan</li>
      </ul>
      <p>Tidak perlu sistem booking otomatis di tahap awal. Tombol WhatsApp yang mengirim pesan dengan template sudah cukup: "Halo, saya mau booking [layanan] untuk [tanggal]". Owner tinggal bales untuk konfirmasi. Cara ini mirip dengan <a href="/artikel/form-booking-online-umkm">form booking online untuk UMKM</a>, hanya lebih ringan.</p>
      <h2>Contoh prompt KARSA untuk salon</h2>
      <p>Buka proyek baru di <a href="/app">KARSA</a>, lalu ketik prompt spesifik. Semakin lengkap konteks yang kamu berikan, semakin akurat hasilnya. Contoh untuk salon kecantikan wanita:</p>
      <p><em>"Buat website salon kecantikan 'Bella Beauty Studio' di Yogyakarta. Hero pink-rose dengan headline 'Perawatan Rambut & Facial Profesional Sejak 2018', subheadline 'Booking dalam 30 detik via WhatsApp', tombol 'Booking Sekarang' yang membuka chat ke 081234567890 dengan pesan otomatis 'Halo Bella Beauty, saya mau booking'. Section layanan dalam kartu: potong rambut (Rp 75.000, 60 menit), coloring (Rp 350.000, 120 menit), creambath (Rp 120.000, 45 menit), facial whitening (Rp 200.000, 75 menit), manicure (Rp 90.000, 45 menit). Galeri 9 foto grid 3 kolom (placeholder Unsplash rambut dan wajah). Section tim 3 stylist dengan foto placeholder dan spesialisasi. Jam buka Senin–Sabtu 09.00–21.00, Minggu tutup, alamat lengkap dengan embed Google Maps, dan footer Instagram @bellabeauty.yogya. Mobile-first, font modern, warna utama rose-gold dan putih."</em></p>
      <p>Setelah preview muncul, minta revisi satu per satu: <em>"ganti palet ke nude dan emas"</em>, <em>"tambah section promo bridal package"</em>, atau <em>"buat tombol WhatsApp mengambang di pojok kanan bawah"</em>. Tiap iterasi cukup satu kalimat.</p>
      <h2>Foto hasil yang meyakinkan pelanggan baru</h2>
      <p>Pelanggan salon sangat dipengaruhi visual. Tiga hal yang konsisten menaikkan kualitas foto tanpa harus hire fotografer: pencahayaan alami di dekat jendela atau ring light, background polos (dinding putih atau backdrop kertas), dan angle 45 derajat untuk tatanan rambut atau wajah. Edit ringan dengan Snapseed atau Lightroom Mobile cukup untuk menyamakan tone antar foto. Pilih 8–12 hasil terbaik, variasikan antara potong, warna, dan styling, supaya calon pelanggan tahu kamu bisa handle berbagai permintaan.</p>
      <p>Jangan lupa foto before-after, terutama untuk layanan coloring dan smoothing. Sebelum mempublikasikan, minta izin pelanggan lewat chat singkat: boleh difoto untuk ditampilkan? Mayoritas pelanggan tetap setuju, terutama jika hasil bagus dan nama mereka tidak ditulis.</p>
      <h2>Cara menyebar link website salon</h2>
      <p>Setelah puas dengan preview, klik Publish di KARSA. Website live di subdomain gratis seperti <code>bella-beauty.karsa.work</code> atau domain sendiri seperti <code>bellabeauty.co.id</code> dengan setup DNS sederhana. Panduan publish ada di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>. Untuk konteks umum UMKM yang sedang membangun etalase digital, lihat juga <a href="/artikel/katalog-produk-online-umkm">panduan katalog produk online UMKM</a>.</p>
      <p>Sebarkan link itu di: bio Instagram, deskripsi TikTok, header WhatsApp Business, Google Business Profile, stempel struk, kartu nama, dan banner di depan toko. Saat ada pelanggan tanya "berapa harga smoothing?", balas dengan link: "Ini daftar lengkapnya ya, kak". Hemat waktu, dan pelanggan baru bisa lihat-lihat dulu sebelum datang.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama salon, daftar layanan, harga, dan nomor WhatsApp sesuai kondisi kamu, lalu lihat preview dalam satu menit. Paket gratis sudah termasuk 30 prompt AI per hari, cukup untuk eksplorasi awal tanpa keluar biaya. Kalau pelanggan tetap sudah punya nomor kamu, link website adalah cara paling murah untuk mengubah pelanggan lewat jadi pelanggan setia — dan mereka yang rumahnya pindah tetap tahu salonmu masih buka di mana.</p>`,
  'katalog-kerajinan-tangan': `
      <p>Produk handmade punya nilai yang tidak selalu terlihat dari satu foto di media sosial. Pembeli ingin tahu bahan, ukuran, proses pembuatan, pilihan warna, dan apakah pesanan dapat disesuaikan. <strong>Katalog kerajinan tangan</strong> online mengumpulkan informasi itu dalam satu tautan yang rapi, sehingga karya anyaman, keramik, rajut, aksesori, atau dekorasi rumah lebih mudah dipahami dan dipesan.</p>
      <h2>Mengapa produk handmade perlu katalog sendiri</h2>
      <p>Unggahan Instagram cepat tenggelam dan chat WhatsApp membuat penjual mengulang jawaban yang sama. Katalog memberi pelanggan tempat tetap untuk membandingkan koleksi, membaca cerita pembuat, serta melihat kisaran harga sebelum bertanya. Tautannya bisa dibagikan di bio, pameran, kartu nama, kemasan, dan profil Google Business tanpa perlu mengirim banyak foto satu per satu.</p>
      <p>Etalase sendiri juga membantu menjelaskan mengapa harga produk handmade berbeda dari barang pabrik. Waktu pengerjaan, bahan lokal, keterampilan perajin, dan jumlah produksi terbatas dapat diceritakan dengan wajar. Pembeli tidak hanya melihat benda, tetapi memahami nilai di baliknya. Untuk struktur katalog dasar, lihat juga <a href="/artikel/katalog-produk-online-umkm">panduan katalog produk online UMKM</a>.</p>
      <h2>Susun koleksi agar mudah dijelajahi</h2>
      <p>Mulai dengan 9–15 produk terbaik, bukan seluruh stok. Kelompokkan berdasarkan jenis, fungsi, atau rentang harga. Toko keramik, misalnya, dapat memakai kategori Peralatan Makan, Dekorasi, dan Hadiah. Perajin rajut dapat memakai Tas, Aksesori, dan Pesanan Custom. Setiap kartu produk sebaiknya memuat informasi berikut:</p>
      <ul>
        <li><strong>Nama dan foto utama</strong> yang konsisten dari produk ke produk.</li>
        <li><strong>Bahan dan ukuran</strong>, termasuk berat jika berpengaruh pada ongkir.</li>
        <li><strong>Harga atau harga mulai</strong> untuk produk yang bisa disesuaikan.</li>
        <li><strong>Waktu pengerjaan</strong> dan status ready stock atau preorder.</li>
        <li><strong>Pilihan custom</strong>, misalnya warna, tulisan, motif, atau kemasan hadiah.</li>
        <li><strong>Tombol tanya atau pesan</strong> yang membawa nama produk ke WhatsApp.</li>
      </ul>
      <p>Gunakan label yang jujur seperti “dibuat sesuai pesanan, 5–7 hari kerja”. Informasi ini menyaring ekspektasi sejak awal dan mengurangi pertanyaan berulang.</p>
      <h2>Contoh prompt KARSA untuk katalog handmade</h2>
      <p>Buat proyek web baru di KARSA, lalu berikan brief yang menyebut jenis karya, karakter merek, isi koleksi, dan alur pemesanan. Contohnya:</p>
      <p><em>"Buat katalog kerajinan tangan untuk 'Ruang Anyam', UMKM keranjang rotan dari Yogyakarta. Hero bernuansa krem dan hijau zaitun dengan headline 'Anyaman Lokal untuk Rumah yang Hangat'. Buat filter kategori Keranjang, Dekorasi, dan Hampers; grid 12 produk berisi foto placeholder, nama, bahan, ukuran, harga mulai, status ready stock atau preorder, serta tombol 'Tanya Produk' ke WhatsApp 081234567890 dengan nama produk otomatis. Tambahkan section proses pembuatan empat langkah, profil singkat perajin, pilihan custom ukuran, FAQ pengiriman, dan footer berisi alamat workshop serta Instagram. Desain mobile-first dan ringan."</em></p>
      <p>Setelah preview muncul, minta perubahan kecil secara bertahap, misalnya “buat kartu produk lebih lapang”, “tambah badge Bisa Custom”, atau “ubah tombol menjadi warna hijau yang lebih kontras”. Dengan live preview, kamu dapat memeriksa hasil setiap revisi tanpa menunggu file dikirim desainer.</p>
      <h2>Foto dan cerita yang meningkatkan kepercayaan</h2>
      <p>Ambil foto dengan cahaya alami dekat jendela dan latar yang konsisten. Sediakan satu foto keseluruhan, satu detail tekstur, serta satu foto produk saat digunakan agar ukuran mudah dibayangkan. Kompres gambar agar halaman tetap cepat dibuka dari ponsel. Hindari filter warna berlebihan karena pembeli perlu melihat warna bahan sedekat mungkin dengan kondisi asli.</p>
      <p>Tambahkan cerita singkat, bukan paragraf promosi panjang. Jelaskan siapa yang membuat, dari mana bahan berasal, dan apa yang membuat prosesnya khas. Klaim seperti “ramah lingkungan” harus punya dasar yang dapat dijelaskan. Jika bahan berasal dari sisa produksi atau pemasok lokal, sebutkan faktanya secara spesifik. Cerita yang konkret lebih meyakinkan daripada istilah umum seperti premium dan berkualitas tinggi.</p>
      <h2>Atur pesanan custom tanpa membuat pembeli bingung</h2>
      <p>Pesanan custom perlu batas yang jelas. Cantumkan pilihan yang dapat diubah, minimal jumlah pesanan, tambahan biaya, waktu pengerjaan, serta aturan revisi. Tombol WhatsApp dapat membawa format pesan: nama produk, ukuran, warna, jumlah, kota pengiriman, dan tanggal dibutuhkan. Dengan format itu, percakapan pertama sudah berisi data yang dibutuhkan untuk menghitung harga.</p>
      <p>Jangan menjanjikan hasil persis sama untuk karya buatan tangan. Jelaskan bahwa variasi kecil pada serat, warna, atau bentuk merupakan bagian dari karakter produk. Transparansi ini mencegah komplain sekaligus mengedukasi pelanggan tentang proses handmade.</p>
      <h2>Publish lalu bagikan katalog secara konsisten</h2>
      <p>Setelah semua nama, harga, foto, dan nomor kontak diperiksa, publish katalog ke subdomain KARSA atau domain sendiri. Panduan teknisnya tersedia di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>. Pasang tautan pada bio media sosial, WhatsApp Business, QR code di meja pameran, dan kartu ucapan dalam paket. Saat koleksi berubah, perbarui proyek lalu publish ulang dengan alamat yang sama.</p>
      <p>Catat pertanyaan yang paling sering masuk setelah katalog dibagikan. Jika banyak orang bertanya ukuran, perbesar informasi ukuran. Jika ongkir sering menjadi hambatan, tambahkan FAQ pengemasan dan perkiraan berat. Katalog yang baik tumbuh dari pertanyaan pelanggan, bukan selesai sekali lalu dilupakan.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt contoh, lalu ganti nama usaha, koleksi, warna, dan kontak dengan data sebenarnya. Paket gratis menyediakan 30 prompt AI per hari dan proyek unlimited, cukup untuk mencoba beberapa susunan. Pelajari juga <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> untuk ide halaman bisnis lain. Mulailah dari karya terbaik dan informasi yang akurat; katalog sederhana yang selalu diperbarui lebih berguna daripada etalase besar yang tidak pernah selesai.</p>`,
  'website-rental-mobil': `
      <p>Rental mobil kecil dan menengah biasanya melayani pelanggan lewat chat WhatsApp satu per satu. Setiap pelanggan minta daftar armada, tarif, syarat sewa, lalu menunggu balasan manual. <strong>Website rental mobil</strong> adalah etalase permanen yang menjawab semua itu dalam satu tautan, sehingga owner cukup fokus pada konfirmasi dan serah terima unit.</p>
      <h2>Kenapa rental mobil butuh halaman sendiri</h2>
      <p>Instagram bagus untuk memamerkan armada, tetapi tidak nyaman untuk menampilkan tarif harian, syarat sewa, dan status ketersediaan sekaligus. Pelanggan yang cari mobil untuk besok pagi tidak mau scroll sampai enam bulan lalu. Website memberi struktur tetap: katalog armada, tarif jelas, syarat sewa terbaca, dan tombol booking yang langsung membuka chat dengan pesan terformat. Link website juga bisa dipasang di Google Business Profile, banner Telegram, stiker kaca kantor, kartu nama, dan dari mulut ke mulut. Untuk konteks UMKM secara umum, pola ini berlaku di <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM Indonesia</a>.</p>
      <h2>Isi minimum website rental mobil</h2>
      <ul>
        <li><strong>Hero singkat</strong> — nama rental, satu kalimat keunggulan (misal: "Lepas kunci 24 jam Jabodetabek"), dan tombol "Cek Ketersediaan" ke WhatsApp</li>
        <li><strong>Katalog armada</strong> — kartu per unit berisi foto, jenis transmisi, kapasitas penumpang, harga harian, dan status ready</li>
        <li><strong>Syarat sewa</strong> — KTP, SIM, deposit, batas usia, area layanan, dan kebijakan bahan bakar</li>
        <li><strong>Tarif dan paket</strong> — harian, mingguan, bulanan, plus layanan tambahan seperti sopir, BBM, atau antar-jemput</li>
        <li><strong>Cara pesan</strong> — langkah dari cek ketersediaan sampai serah terima, agar pelanggan baru tidak bingung</li>
        <li><strong>Kontak dan lokasi</strong> — WhatsApp utama, alamat pool, jam operasional, dan Google Maps</li>
      </ul>
      <p>Tidak perlu payment gateway di tahap awal. WhatsApp dengan pesan terformat sudah cukup: <em>"Halo, saya mau sewa Avanza matic, tanggal 10–12 Agustus, di area Jakarta"</em>. Owner tinggal bales dengan konfirmasi. Pola ini mirip dengan <a href="/artikel/form-booking-online-umkm">form booking online untuk UMKM</a>, hanya konteksnya armada.</p>
      <h2>Contoh prompt KARSA untuk rental mobil</h2>
      <p>Buka proyek baru di <a href="/app">KARSA</a>, lalu ketik prompt spesifik. Semakin lengkap data yang diberikan, semakin akurat hasilnya. Contoh untuk rental di Jakarta:</p>
      <p><em>"Buat website rental mobil 'Jaya Rent Car' di Jakarta. Hero navy dengan headline 'Sewa Mobil Lepas Kunci 24 Jam Jabodetabek', subheadline 'Booking dalam 60 detik via WhatsApp', tombol 'Cek Ketersediaan' ke 081234567890. Katalog 6 unit grid 2 kolom: Avanza matic 2023 (Rp 350.000/hari, 7 seat, ready), Innova Reborn 2022 (Rp 550.000/hari, 7 seat, ready), Brio matic 2023 (Rp 280.000/hari, 4 seat, ready), Pajero Sport 2021 (Rp 750.000/hari, 7 seat, ready), Fortuner VRZ 2022 (Rp 800.000/hari, 7 seat, ready), Hiace Commuter 2020 (Rp 900.000/hari, 14 seat, ready). Tiap kartu berisi foto placeholder, transmisi, kapasitas, harga harian, dan tombol 'Pesan' ke WhatsApp dengan nama unit. Section syarat sewa: KTP + SIM A aktif, usia 21+, deposit Rp 500.000, BBM kembali sesuai awal. Paket: harian 6×24 jam, mingguan diskon 15%, bulanan diskon 30%, sopir +Rp 150.000/hari, antar-jemput bandara +Rp 200.000. Footer berisi alamat pool, jam 07.00–22.00, Google Maps. Mobile-first, warna navy dan putih."</em></p>
      <p>Setelah preview muncul, minta revisi satu per satu: <em>"ganti palet ke hijau tua dan putih"</em>, <em>"tambah section FAQ"</em>, atau <em>"buat tombol WhatsApp mengambang"</em>. Tiap iterasi cukup satu kalimat.</p>
      <h2>Detail kecil yang membedakan rental profesional</h2>
      <p>Sebelum publish, cek tiga hal yang biasanya jadi pembeda antara rental yang terasa rapi dan yang terasa asal-asalan: konsistensi format harga (pilih "Rp 350.000" di semua unit, bukan campuran "350K" dan "350rb"), status ketersediaan yang selalu segar (tandai jelas "ready" vs "preorder" dan update harian), serta syarat sewa yang terbaca sebelum pelanggan chat, bukan baru muncul saat serah terima. Photo unit sebaiknya pakai latar polos, cahaya terang, dan angle 3/4; edit ringan dengan Snapseed cukup untuk menyamakan tone.</p>
      <h2>Cara menyebar link website rental</h2>
      <p>Setelah puas dengan preview, klik Publish di KARSA. Website live di subdomain gratis seperti <code>jaya-rent.karsa.work</code> atau domain sendiri dengan setup DNS sederhana. Panduan publish ada di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>; konteks katalog digital untuk UMKM secara umum di <a href="/artikel/katalog-produk-online-umkm">panduan katalog produk online UMKM</a>.</p>
      <p>Sebarkan link itu di bio Instagram, header WhatsApp Business, Google Business Profile, stiker kaca kantor pool, brosur di bagasi setiap unit, dan grup komunitas. Saat ada pelanggan tanya "berapa sewa Innova?", balas dengan link: "Ini daftar lengkapnya, kak. Tinggal klik armada yang dimau dan chat via WhatsApp". Hemat waktu, dan pelanggan baru bisa cek sendiri di jam yang mereka inginkan.</p>
      <h2>Kesalahan yang sering terjadi</h2>
      <ul>
        <li><strong>Tarif tidak konsisten</strong> — campur "Rp 350.000" dan "350K" di unit berbeda bikin pelanggan bingung. Pilih satu format.</li>
        <li><strong>Status ketersediaan tidak pernah diupdate</strong> — pelanggan pesan unit yang sebenarnya sudah jalan. Tandai jelas ready vs preorder.</li>
        <li><strong>Syarat sewa disembunyikan</strong> — pada saat serah terima muncul syarat baru. Cantumkan syarat lengkap dari awal.</li>
        <li><strong>Tidak ada tombol WhatsApp</strong> — pelanggan harus copy nomor manual, biasanya batal di tengah jalan. Tombol harus satu ketukan.</li>
        <li><strong>Foto tidak rapi</strong> — di HP, thumbnail kecil jadi tidak terbaca. Minimal 600 piksel dengan latar konsisten.</li>
      </ul>
      <p>Kuncinya adalah halaman yang dijaga: update status unit setiap hari, tampilkan promo weekday atau peak season, dan respon chat dalam hitungan menit. Website rental bukan pengganti keramahan, tapi pendukung yang membuat pelanggan baru percaya untuk pesan pertama kali.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama rental, daftar armada, dan nomor WhatsApp sesuai kondisi bisnis kamu, lalu lihat preview dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi awal tanpa keluar biaya. Pelajari juga <a href="/artikel/seo-website-umkm">panduan SEO website UMKM</a> supaya muncul di pencarian "sewa mobil [kota]" dan <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a> untuk go-live. Link permanen membuat rental kecil terlihat profesional — pelanggan cukup ingat satu tautan.</p>`,
  'landing-page-event': `
      <p>Event organizer, komunitas, atau tim HR yang sering bikin acara punya masalah klasik: broadcast chat WhatsApp tenggelam, info tersebar di banyak grup, peserta lupa jadwal, dan pendaftar tidak tertangkap rapi. Solusinya satu halaman yang shareable, rapi, dan bisa diisi sendiri — landing page event.</p>
      <h2>Section wajib di landing page event</h2>
      <p>Sebelum bicara desain, tentukan dulu isi. Pengunjung datang untuk menjawab tiga hal: acaranya apa, kapan, dan berapa. Susun section dalam urutan logis ini:</p>
      <ul>
        <li><strong>Hero</strong> — judul acara, tanggal, lokasi, dan tombol "Daftar Sekarang"</li>
        <li><strong>Tentang acara</strong> — tiga sampai empat kalimat siapa yang cocok hadir dan benefit apa yang dibawa pulang</li>
        <li><strong>Jadwal &amp; pembicara</strong> — rundown singkat dengan foto, nama, dan topik tiap sesi</li>
        <li><strong>Tiket &amp; harga</strong> — paling dua sampai tiga tier (early bird, reguler, VIP) dengan benefit tiap tier</li>
        <li><strong>Form pendaftaran</strong> — nama, email, WhatsApp, dan pertanyaan singkat soal preferensi</li>
        <li><strong>FAQ singkat</strong> — pertanyaan yang selalu muncul di chat: parkir, sertifikat, rekaman</li>
      </ul>
      <p>Urutan ini mengikuti cara orang memindai halaman dari atas ke bawah. Yang penting di atas, detail setelahnya, CTA diulang di section terakhir.</p>
      <h2>Contoh prompt KARSA untuk landing page event</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt spesifik. Semakin lengkap data yang kamu berikan, semakin sedikit revisi yang dibutuhkan. Contoh untuk seminar dua hari di Jakarta:</p>
      <p><em>"Buat landing page seminar 'UMKM Go Digital 2026'. Hero dengan headline 'Bersiap Jadi UMKM Kelas Nasional', subheadline 'Seminar 2 hari + workshop + sertifikat', tanggal 15–16 Agustus 2026 di Hotel Aryaduta Jakarta, tombol 'Daftar Sekarang' ke Google Form. Section 'Mengapa hadir' 4 poin: strategi digital marketing, cara dapat modal, diskusi dengan founder sukses, networking dengan 200 UMKM. Section jadwal hari pertama: 09.00 registrasi, 10.00 pembicara 1 (Budi Santoso, 'Iklan Facebook untuk UMKM'), 12.00 makan siang, 13.00 pembicara 2 (Sari Indah, 'Branding tanpa agency'), 15.00 workshop paralel. Hari kedua: lanjutan workshop + sesi tanya jawab. Section tiket 3 tier: Early Bird Rp 350.000 (hingga 1 Agustus, 100 tiket), Reguler Rp 500.000 (150 tiket), VIP Rp 1.200.000 (maks 30 peserta, makan malam pembicara). Tiap tier menampilkan benefit. Section pembicara dengan foto placeholder dan bio 2 kalimat. Section FAQ 5 pertanyaan. Footer dengan kontak WhatsApp 081234567890 dan link Instagram @umkmgodigital. Warna utama biru navy dan putih, mobile-first."</em></p>
      <p>Setelah preview muncul, iterasi per bagian: <em>"ganti palet jadi hijau tua dan krem"</em>, <em>"tambah section sponsor dengan 6 logo placeholder"</em>, atau <em>"tampilkan countdown timer ke tanggal acara di hero"</em>. Tiap iterasi cukup satu kalimat.</p>
      <h2>Detail kecil yang bikin event terasa profesional</h2>
      <p>Tiga hal yang membedakan landing event yang dapat banyak pendaftar dan yang banyak ditinggalkan: konsistensi informasi harga di semua section (jangan tulis "Early Bird 350K" di satu tempat dan "Rp 350.000" di tempat lain), countdown timer menuju tanggal acara di hero (mendorong pendaftaran lebih cepat), dan konfirmasi otomatis yang langsung dikirim setelah form diisi (email atau pesan WhatsApp terformat). Untuk webinar, sertakan info rekaman dan slide di section FAQ; untuk event offline, info parkir, transport, dan rekomendasi hotel terdekat.</p>
      <p>Pastikan formulir pendaftaran sesingkat mungkin. Setiap field tambahan menurunkan conversion sekitar 5–10%. Cukup nama, WhatsApp, email, dan kalau perlu asal kota. Pertanyaan detail tentang preferensi topik bisa dikirim lewat email setelah formulir utama diisi, bukan di awal yang bisa menggugurkan pendaftaran.</p>
      <h2>Cara menyebarkan link event</h2>
      <p>Setelah preview sesuai, klik Publish di KARSA. Landing page live di <code>umkm-go-digital.karsa.work</code> atau domain sendiri kalau EO sudah punya. Panduan publish lengkap di <a href="/artikel/cara-publish-website-karsa">cara publish website dari KARSA</a>. Sebarkan link itu di:</p>
      <ul>
        <li>Bio Instagram akun EO dan akun komunitas partner</li>
        <li>Header WhatsApp Business dan broadcast berkala ke database peserta lama</li>
        <li>Grup Telegram atau LINE komunitas topik terkait</li>
        <li>Email newsletter ke list peserta acara sebelumnya</li>
        <li>LinkedIn dengan post pendek dan hashtag acara</li>
      </ul>
      <p>Setiap kali broadcast, sertakan call-to-action spesifik yang sesuai audiens — bukan cuma "lihat acaranya". Misalnya: "Buat owner UMKM di Jakarta, 2 hari ini bisa ganti cara pandang soal digital marketing. Kuota early bird tinggal 23 tiket. Daftar: [link]".</p>
      <h2>Kesalahan yang sering terjadi</h2>
      <ul>
        <li><strong>Informasi harga tidak konsisten</strong> — early bird di hero Rp 350K, di section tiket Rp 350.000, di FAQ "Rp 350rb". Bikin orang ragu apakah ini benar. Pilih satu format.</li>
        <li><strong>Form terlalu panjang</strong> — sepuluh field di halaman pertama bikin 60% pendaftar kabur. Maksimal 4–5 field.</li>
        <li><strong>Tidak ada countdown atau deadline early bird</strong> — pendaftaran ditunda ke besok, besok, besok. Tampilkan deadline eksplisit.</li>
        <li><strong>CTA tenggelam</strong> — tombol "Daftar" cuma ada di hero. Ulangi sebelum jadwal, sebelum tiket, dan setelah FAQ.</li>
        <li><strong>Tidak mobile-friendly</strong> — 80% peserta buka dari HP. Cek preview di viewport kecil sebelum publish.</li>
      </ul>
      <p>Yang paling penting setelah landing page live adalah konsistensi update. Kalau ada perubahan jadwal, update halaman dalam 24 jam dan broadcast ulang. Kalau early bird habis, tampilkan status sold-out dengan jelas dan arahkan ke tier berikutnya. Landing page yang hidup membangun trust jauh lebih cepat dari halaman yang statis.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail acara kamu, lalu lihat preview dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Untuk optimasi halaman supaya banyak yang daftar, baca <a href="/artikel/prompt-landing-page-konversi">prompt landing page konversi tinggi</a> dan <a href="/artikel/bikin-landing-page-dengan-ai">cara bikin landing page dengan AI</a>. Setelah publish, link permanen bisa dipakai di semua materi promosi — broadcast, poster, story, dan email — tanpa biaya tambahan per event.</p>`,
  'form-pendaftaran-seminar': `
      <p>Event organizer dan tim komunitas yang sering gelar seminar serta webinar pasti kenal ritual ini: link Google Form disebar di broadcast, peserta rebutan kursi, panitia rekap manual dari spreadsheet, dan banyak data bolak-balik di chat. Solusinya satu halaman form pendaftaran seminar yang rapi dan mobile-friendly — bisa kamu buat dengan KARSA dalam hitungan menit tanpa coding.</p>
      <h2>Field wajib di form pendaftaran seminar</h2>
      <p>Sebelum bicara desain, tentukan field yang benar-benar kamu butuhkan. Setiap field tambahan menurunkan rasio pendaftar, jadi lebih baik form singkat dengan data yang cukup untuk operasional:</p>
      <ul>
        <li><strong>Nama lengkap</strong> — untuk sertifikat, absensi, dan label name tag</li>
        <li><strong>Email</strong> — kirim invoice, link Zoom, dan rekaman acara</li>
        <li><strong>Nomor WhatsApp</strong> — kontak utama untuk reminder H-1 dan info mendadak</li>
        <li><strong>Asal kota / instansi</strong> — berguna untuk catering dan sesi networking</li>
        <li><strong>Pilihan sesi atau tiket</strong> — kalau acaranya paralel atau bertingkat (early bird, reguler, VIP)</li>
        <li><strong>Metode pembayaran</strong> — QRIS, transfer bank, atau kartu (opsional, bisa dikonfirmasi via chat)</li>
        <li><strong>Persetujuan penggunaan data</strong> — checkbox kecil untuk kepatuhan perlindungan data pribadi</li>
      </ul>
      <p>Jangan tambahin field yang tidak operasional, seperti "pekerjaan spesifik" atau "pendapatmu tentang acara ini". Itu bisa dikirim sebagai survei setelah acara selesai, bukan di gerbang pendaftaran.</p>
      <h2>Contoh prompt KARSA untuk form seminar</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt spesifik ini. Semakin lengkap data yang kamu berikan, semakin sedikit revisi yang dibutuhkan:</p>
      <p><em>"Buat halaman form pendaftaran seminar 'UMKM Naik Kelas 2026' di Jakarta, 20 Agustus 2026. Hero sederhana dengan judul seminar, tanggal, dan tagline 'Kelas Satu Hari untuk Owner UMKM'. Section 'Benefit peserta' 4 poin: template bisnis plan, konsultasi 30 menit dengan mentor, e-sertifikat, dan grup alumni WhatsApp. Section form: nama lengkap, email, WhatsApp, asal kota, dropdown pilihan paket (Reguler Rp 500.000 atau VIP Rp 1.500.000 termasuk makan siang dan konsultasi 1 jam), checkbox persetujuan menerima informasi acara, dan textarea singkat 'Apa tantangan utama bisnismu' maksimal 200 karakter. Tombol submit ke WhatsApp 081234567890 dengan pesan template: 'Halo, saya [nama] dari [kota] mau daftar paket [paket]. Email: [email]. WA: [wa].'. Setelah submit tampilkan halaman konfirmasi berisi nomor WhatsApp untuk konfirmasi pembayaran dan rekening bank. Mobile-first, warna utama biru navy dan oranye, footer menyebut Penyelenggara: Komunitas UMKM Maju."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"tambah field pekerjaan di form"</em>, <em>"ganti tombol submit jadi kirim ke email organizers@kabarumkm.id"</em>, atau <em>"tampilkan sesi-sesi seminar di atas form biar peserta tahu isi acaranya"</em>. Cukup satu kalimat per iterasi.</p>
      <h2>Cara mengumpulkan data pendaftar dengan rapi</h2>
      <p>Ada tiga pola yang sering dipakai EO di Indonesia, masing-masing dengan kelebihan:</p>
      <ul>
        <li><strong>Submit ke WhatsApp Panitia</strong> — paling cocok untuk acara di bawah 100 peserta. Pesan WhatsApp otomatis terformat dengan data peserta, panitia tinggal reply konfirmasi. Hindari spam karena data tetap lewat chat.</li>
        <li><strong>Submit ke Google Sheets via webhook</strong> — untuk acara 200+ peserta. KARSA bisa diarahkan ke endpoint sederhana yang append row ke spreadsheet, jadi panitia punya basis data terstruktur tanpa ketik manual.</li>
        <li><strong>Submit ke email + autoresponder</strong> — untuk webinar gratis atau acara komunitas. Peserta dapat email konfirmasi instan berisi link Zoom atau dokumen briefing.</li>
      </ul>
      <p>Pilih satu pola yang paling cocok dengan volume pesertamu. Kalau EO kamu biasanya handle 30–80 orang per event, WhatsApp Panitia sudah lebih dari cukup dan paling minim setup. Kalau kamu rutin gelar event 500+ atau menerima hibah yang butuh laporan data terstruktur, investasi ke integrasi spreadsheet.</p>
      <h2>Konfirmasi dan reminder yang bikin peserta datang</h2>
      <p>Sebagian besar peserta yang terlambat atau lupa datang bukan karena tidak tertarik, tapi karena tidak ada reminder. Pasang dua touch point sederhana:</p>
      <ol>
        <li><strong>Konfirmasi instan</strong> — langsung setelah submit, kirim WhatsApp otomatis berisi detail acara dan kontak panitia. Peserta yang dapat konfirmasi cepat 3× lebih mungkin benar-benar hadir.</li>
        <li><strong>Reminder H-1</strong> — broadcast WhatsApp ke seluruh peserta esok harinya, berisi rundown singkat, lokasi map, dan dress code kalau ada. Ini memotong no-show sampai 40% di acara gratis.</li>
      </ol>
      <p>Hindari email blast generik. Peserta cenderung mengabaikan yang tidak personal. Cukup dua pesan di atas — instan dan H-1 — yang sudah terbukti paling efektif di EO kecil dan menengah. Untuk pola komunikasi lain dengan peserta — seperti form konfirmasi kehadiran atau jadwal alternatif — pelajari juga contoh form <a href="/artikel/form-booking-online-umkm">booking online untuk UMKM</a> di panduan KARSA.</p>
      <h2>Kesalahan yang sering terjadi</h2>
      <ul>
        <li><strong>Form terlalu panjang</strong> — sepuluh field bikin 50–60% pendaftar kabur. Maksimal 5–7 field inti, sisanya setelah mereka konfirmasi hadir.</li>
        <li><strong>Tidak ada konfirmasi setelah submit</strong> — peserta tidak tahu apakah pendaftarannya berhasil, dan panitia harus cek manual. Selalu tampilkan halaman terima kasih dengan info jelas.</li>
        <li><strong>Nomor WhatsApp panitia salah</strong> — pastikan nomor yang dituju benar dan aktif (kode negara, bukan awalan 0 saja untuk internasional).</li>
        <li><strong>Lupa sebut deadline</strong> — kalau ada batas pendaftaran, tampilkan di hero form dan di pesan submit, bukan cuma di landing utama.</li>
        <li><strong>Tidak mobile-friendly</strong> — lebih dari 80% pendaftar buka dari HP. Cek preview di viewport kecil sebelum publish.</li>
      </ul>
      <p>Yang paling penting setelah form live adalah konsistensi data. Setiap pendaftar yang masuk lewat form otomatis terstruktur dan rapi. Kalau biasanya EO kamu rekap manual dari screenshot chat, halaman KARSA menggantikan itu sekaligus.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail seminar atau webinar kamu, lalu lihat preview halaman form dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Untuk halaman lengkap yang juga memuat jadwal dan tiket, padukan dengan <a href="/artikel/landing-page-event">panduan landing page event</a>. Setelah publish, link permanen form bisa kamu pasang di broadcast WhatsApp, bio Instagram, dan email newsletter — semua pendaftar masuk ke satu pintu yang rapi.</p>`,
  'website-komunitas-hobi': `
      <p>Komunitas hobi Indonesia tumbuh subur — lari pagi, plant parent, board game, sampai vintage camera. Tapi hampir semua masih mengandalkan grup WhatsApp atau Telegram untuk koordinasi. Chat cepat tenggelam, foto kegiatan susah dicari lagi, dan anggota baru bingung harus mulai dari mana. <strong>Website komunitas hobi</strong> adalah rumah digital bersama: satu link yang menjelaskan siapa kalian, jadwal rutin, galeri kegiatan, dan cara gabung — tanpa scroll ribuan chat lama.</p>
      <h2>Kenapa komunitas butuh website, bukan cuma grup chat</h2>
      <p>Grup chat memang cepat untuk diskusi harian, tapi buruk untuk tiga hal: onboarding anggota baru (mereka tidak bisa lihat sejarah), dokumentasi kegiatan (foto dan cerita kopdar hilang setelah beberapa hari), dan kesan pertama untuk calon anggota atau sponsor (grup chat terlalu informal). Website sederhana dengan 4–5 section sudah cukup untuk mengatasi semuanya. Anggap saja website adalah etalase formal, grup chat adalah dapur internal.</p>
      <p>Untuk komunitas 20–500 anggota, one-page dengan section terstruktur biasanya lebih praktis dibanding blog multi-halaman. Pengunjung scroll, dapat info penting, lalu klik gabung.</p>
      <h2>Halaman penting di website komunitas</h2>
      <p>Sebelum mulai, tentukan section wajib. Struktur minimum paling efektif:</p>
      <ul>
        <li><strong>Hero / About</strong> — nama komunitas, tagline, deskripsi 2–3 kalimat tentang siapa kalian dan misi</li>
        <li><strong>Jadwal rutin</strong> — hari, jam, lokasi, dan link Google Maps untuk kopdar mingguan</li>
        <li><strong>Galeri kegiatan</strong> — foto kopdar terakhir, dokumentasi event, atau showcase karya anggota</li>
        <li><strong>Tim inti / founder</strong> — 3–6 foto dan peran biar calon anggota tahu siapa menjalankan komunitas</li>
        <li><strong>Cara gabung</strong> — form daftar atau link WhatsApp dengan template pertanyaan singkat</li>
        <li><strong>Footer</strong> — kontak, media sosial, dan link grup WhatsApp/Telegram untuk chat harian</li>
      </ul>
      <p>Tidak perlu section blog atau artikel di awal. Fungsinya memperkenalkan, mengajak gabung, dan memusatkan info. Kalau konten perlu diarsipkan mendalam, tambahkan nanti setelah komunitas stabil.</p>
      <h2>Contoh prompt KARSA untuk website komunitas</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt kontekstual berikut. Semakin spesifik datanya, semakin sedikit revisi yang kamu butuhkan:</p>
      <p><em>"Buat landing page untuk komunitas 'Jakarta Plant Swap' — komunitas tukar tanaman hias di Jabodetabek. Hero dengan judul besar, tagline 'Tukar Tanaman, Tambah Teman, Belajar Bareng', dan tombol 'Gabung Sekarang' warna hijau. Section 'Tentang Kami' 3 paragraf pendek: siapa kami, misi, dan jumlah anggota aktif (sekitar 350 orang). Section 'Jadwal Kopdar' card 3 pertemuan berikutnya: tanggal, jam, lokasi (Taman Suropati / Ragunan / Kemang), dan link Google Maps. Section 'Galeri' grid 6 foto kegiatan sebelumnya dari Unsplash tema tanaman. Section 'Tim Inti' 4 foto placeholder dengan nama dan peran (Founder, Koordinator Lokasi, Admin Galeri, Bendahara). Section 'Cara Gabung' form: nama, WhatsApp, domisili, dropdown 'Pengalaman Tanaman Hias' (Pemula/Menengah/Hobi Serius), textarea 'Cerita singkat kenapa mau gabung' maksimal 150 karakter. Tombol submit kirim ke WhatsApp 081234567890 dengan template pesan. Footer dengan link Instagram @jakartaplantswap dan link grup WhatsApp. Mobile-first, warna dominan hijau sage dan krem, font Inter dan Syne, ilustrasi daun kecil sebagai dekorasi."</em></p>
      <p>Setelah preview muncul, iterasi per bagian dengan kalimat pendek: <em>"tambah section FAQ"</em>, <em>"ganti warna jadi biru pastel"</em>, atau <em>"tampilkan counter anggota aktif yang update otomatis"</em>. Tiap iterasi biasanya hanya 10–20 detik.</p>
      <h2>Memilih domain untuk komunitas</h2>
      <p>Untuk langkah awal, subdomain gratis dari KARSA seperti <code>jakartaplantswap.karsa.work</code> sudah lebih dari cukup. Bagus untuk uji coba dan lihat apakah website dipakai. Setelah 2–3 bulan dan trafik stabil, baru pertimbangkan domain sendiri seperti <code>jakartaplantswap.id</code> — identitas lebih kuat dan profesional untuk sponsorship.</p>
      <p>Pastikan slug konsisten dengan username Instagram atau nama grup WhatsApp biar anggota tidak bingung. Detail propagasi domain dan setup DNS bisa dibaca di <a href="/artikel/custom-domain-karsa">panduan custom domain KARSA</a>.</p>
      <h2>Memasukkan website ke kegiatan operasional komunitas</h2>
      <p>Website yang bagus adalah yang dipakai. Setelah publish, integrasikan ke ritual yang sudah ada:</p>
      <ul>
        <li>Set sebagai pinned message di grup WhatsApp dan Telegram: "Info resmi & galeri ada di sini"</li>
        <li>Tambahkan ke bio Instagram dan link-in-bio tools (Linktree atau Sendspark)</li>
        <li>Sebut di setiap kopdar: "Foto kegiatan akan diupload ke website, cek halaman Galeri minggu depan"</li>
        <li>Gunakan form gabung sebagai filter utama — calon anggota isi form, admin cek, baru invite ke grup chat</li>
        <li>Update jadwal dan galeri 1–2 minggu sekali, jangan sampai website terasa mati</li>
      </ul>
      <p>Admin website (1–2 orang) dapat tugas rutin update galeri dan jadwal. Anggap seperti notulensi kopdar — kalau tidak diupdate, anggota mulai lupa kegiatannya. Untuk event khusus seperti kopdar akbar, padukan dengan <a href="/artikel/landing-page-event">panduan landing page event</a>.</p>
      <h2>Kesalahan yang sering terjadi</h2>
      <ul>
        <li><strong>Terlalu banyak section di awal</strong> — 10 section bikin anggota baru overwhelmed. Mulai dari 5 section utama, tambah kalau sudah perlu.</li>
        <li><strong>Form gabung tidak jelas prosesnya</strong> — calon anggota bingung setelah submit. Selalu tampilkan halaman konfirmasi: "Admin akan reply dalam 1×24 jam".</li>
        <li><strong>Foto galeri tidak dikurasi</strong> — foto blur, gelap, atau tidak relevan bikin kesan tidak profesional. Maksimal 12 foto terbaik per periode.</li>
        <li><strong>Tidak ada admin website</strong> — kalau cuma satu orang yang bisa edit dan dia sibuk, website mati. Siapkan minimal 2 admin.</li>
        <li><strong>Lupa mobile preview</strong> — 80% anggota buka dari HP. Cek preview di viewport kecil sebelum publish.</li>
      </ul>
      <p>Yang paling penting setelah live adalah konsistensi. Update kecil tiap 1–2 minggu sudah cukup untuk menjaga website tetap hidup. Komunitas bukan perusahaan, jadi tidak perlu posting setiap hari. Yang penting ada ritme yang jelas.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail komunitasmu, lalu lihat preview dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Untuk dasar vibecoding, baca juga <a href="/artikel/apa-itu-vibecoding">penjelasan vibecoding untuk pemula</a>. Setelah publish, share link permanen ke grup chat, bio Instagram, dan setiap kopdar — biarkan website yang bekerja memperkenalkan komunitasmu 24 jam, sementara kamu fokus menjalankan kegiatannya.</p>`,
  'katalog-buku-bekas': `
      <p>Penjual buku bekas di Indonesia — dari toko kecil di gang kota sampai seller rumahan di Bukalapak, Tokopedia, dan Instagram — punya satu masalah klasik: stok buku banyak, tapi calon pembeli tidak punya cara browse yang rapi. Foto di chat cepat hilang, story 24 jam, dan daftar PDF di WhatsApp bikin orang scroll tanpa ujung. Solusinya sederhana: satu halaman katalog buku bekas online yang permanen, mobile-friendly, dan bisa dibuka dari mana saja. KARSA memungkinkan kamu bikin etalase itu dalam hitungan menit, tanpa coding.</p>
      <h2>Kenapa katalog online layak, bukan cuma arsip foto</h2>
      <p>Katalog online bukan sekadar galeri foto — ini adalah alat jualan. Link permanen bisa kamu tempel di bio Instagram, pesan otomatis WhatsApp Business, marketplace, sampai nama domain sendiri. Tidak hilang setelah 24 jam, tidak tenggelam di antara ribuan chat, dan yang paling penting: calon pembeli bisa search, filter, dan langsung kontak kamu saat tertarik. Untuk seller buku bekas, etalase digital sering mengalahkan toko marketplace karena tidak ada komisi 5–10% per transaksi, brandingnya milik sendiri, dan kamu pegang hubungan langsung dengan pelanggan tetap. Seller yang andalkan chat saja sering kehilangan 80% buyer karena lupa — katalog online bikin calon pembeli eksplor sendiri, kamu duduk terima chat dari yang benar-benar tertarik.</p>
      <h2>Struktur katalog buku bekas yang bikin closing</h2>
      <p>Tidak perlu keranjang belanja dan payment gateway di tahap awal. Cukup halaman yang informatif, gampang di-scroll, dan ada jalur jelas ke WhatsApp. Komponen wajibnya:</p>
      <ul>
        <li><strong>Header</strong> — nama toko, tagline (mis. "Buku bekas langka &amp; best seller, kondisi 80–95%"), tombol WhatsApp melayang</li>
        <li><strong>Grid buku</strong> — foto cover, judul, penulis, kondisi, harga, label kategori</li>
        <li><strong>Detail buku</strong> — foto besar, sinopsis 1 paragraf, ISBN, tahun, kondisi, berat, tombol chat untuk negosiasi</li>
        <li><strong>Filter dan search</strong> — kategori, penulis, rentang harga, kata kunci judul</li>
        <li><strong>Section info</strong> — cara order, ongkir rata-rata, metode pembayaran, kebijakan retur</li>
        <li><strong>Footer</strong> — alamat toko, jam buka, link marketplace, Instagram, kontak WhatsApp</li>
      </ul>
      <p>Yang membedakan katalog buku bekas dari katalog fashion adalah label kondisi. Pembeli butuh tahu apakah buku 90% mulus atau ada coretan. Tampilkan label ini jelas di kartu grid dan detail — tidak perlu di belakang halaman.</p>
      <h2>Contoh prompt KARSA untuk toko buku bekas</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt spesifik ini. Semakin lengkap konteks yang kamu berikan, semakin sedikit revisi yang dibutuhkan. Contoh untuk toko buku bekas yang jual fiksi impor dan lawas:</p>
      <p><em>"Buat katalog online untuk toko buku bekas 'Rak Buku Bekas' di Jakarta. Header dengan logo teks berwarna coklat tua dan tagline 'Buku bekas berkualitas, harga mahasiswa'. Floating button WhatsApp ke 081234567890. Hero section berisi banner lebar dengan foto tumpukan buku dan CTA 'Browse Katalog'. Section filter dengan dropdown kategori (Fiksi, Nonfiksi, Anak, Langka, Paket Bundling), input search, dan slider rentang harga Rp 10.000–Rp 500.000. Grid 3 kolom berisi 9 contoh buku, masing-masing dengan card berisi foto cover, judul, penulis, label kondisi (90% / 70% / Baca dulu), harga coret dan harga baru, badge 'Langka' atau 'Best Seller' untuk buku tertentu. Klik card buka halaman detail dengan foto besar, sinopsis, ISBN, tahun, berat, kondisi, dan tombol 'Pesan via WhatsApp' yang pre-fill pesan. Section 'Cara Order' 4 langkah, footer dengan alamat, jam buka, dan link Tokopedia. Mobile-first, warna coklat tua dan krem."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"tambah filter berdasarkan penulis"</em> atau <em>"ganti warna jadi hijau sage"</em>. Cukup satu kalimat per iterasi — itu kekuatan vibecoding. Pola vibecoding ini sama dengan bikin <a href="/artikel/contoh-prompt-karsa-umkm">katalog produk UMKM</a> pada umumnya, tinggal sesuaikan konteksnya.</p>
      <h2>Tips mengelola katalog yang tetap hidup</h2>
      <ul>
        <li><strong>Update mingguan</strong> — tambahkan 5–10 buku baru per minggu, hapus yang sudah terjual</li>
        <li><strong>Foto natural light</strong> — pakai cahaya jendela, latar kayu atau kain</li>
        <li><strong>Label kondisi jujur</strong> — tulis "bekas 85%, ada highlight halaman 30–40" daripada sekadar "bekas"</li>
        <li><strong>Paket bundling</strong> — grup 3–5 buku dengan tema (paket sastra, paket bisnis) jadi nilai lebih</li>
        <li><strong>Testimoni di homepage</strong> — screenshot chat positif dari pelanggan, tampilkan apa adanya</li>
      </ul>
      <p>Untuk seller yang sudah punya 100+ judul, pertimbangkan filter berdasarkan genre dan label "Langka" atau "Best Seller" — itu yang membedakan toko profesional dari yang amatir di mata kolektor.</p>
      <h2>Kesalahan yang sering bikin katalog buku bekas tidak laku</h2>
      <ul>
        <li><strong>Foto gelap atau blur</strong> — foto ulang di cahaya terang sebelum publish</li>
        <li><strong>Tidak ada harga</strong> — orang enggan chat hanya untuk tanya harga. Tampilkan harga di grid</li>
        <li><strong>Tombol WhatsApp rusak</strong> — nomor salah, tidak pakai kode negara, atau link tidak auto-prefill pesan</li>
        <li><strong>Tidak mobile preview</strong> — 80% buyer buka dari HP. Grid 3 kolom di desktop sering overflow</li>
        <li><strong>Kategori asal buat</strong> — "Lain-lain" menumpuk 50% buku. Pecah jadi "Langka", "Best Seller", "Bundling"</li>
      </ul>
      <p>Yang paling penting setelah live adalah konsistensi. Katalog buku bekas yang tidak di-update 3 bulan akan terasa mati dan tidak dipercaya. Jadwalkan 30 menit setiap akhir pekan untuk update stok, rotasi foto, dan tambah 5–10 buku baru.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail tokomu (nama, kota, nomor WhatsApp, contoh judul), lalu lihat preview dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Untuk dasar menyusun katalog produk UMKM, baca juga <a href="/artikel/katalog-produk-online-umkm">panduan katalog produk online</a>. Setelah publish, link permanen bisa kamu tempel di bio Instagram, pesan otomatis WhatsApp Business, dan listing marketplace — biar satu etalase digital bekerja memperkenalkan tokomu 24 jam, sementara kamu fokus carikan buku langka yang dicari kolektor.</p>`,
  'landing-page-produk-digital': `
      <p>Kreator Indonesia — penulis ebook, desainer template Notion atau Canva, pembuat course singkat, sampai komunitas membership — sering mengandalkan link chat panjang, broadcast WhatsApp, atau landing page gratisan yang templatenya kaku. Hasilnya: copy jadi tidak konsisten, diskon tenggelam di antara pesan lain, dan calon pembeli bingung mau klik apa. Solusinya bukan platform mahal: satu halaman landing page produk digital yang kamu tulis sendiri dengan KARSA, mobile-friendly, dan publish ke link permanen dalam hitungan menit. Tidak perlu WordPress, tidak perlu plugin, tidak perlu langganan bulan.</p>
      <h2>Apa bedanya landing page produk digital dengan katalog biasa</h2>
      <p>Katalog cocok untuk barang fisik yang sudah jadi — pembeli lihat, tanya, transaksi. Landing page produk digital berbeda: halaman ini menggabungkan <strong>cerita</strong> (kenapa produk ini penting), <strong>bukti</strong> (testimoni, cuplikan, hasil), dan <strong>tombol aksi</strong> (beli, daftar, unduh, atau join membership) dalam satu alur scroll. Karena produk digital tidak bisa dipegang, halaman harus menjelaskan value lebih panjang, mengatasi keberatan, dan memperlihatkan sampel. Untuk kreator yang menjual ebook, template, course, membership, atau preset Lightroom, landing page yang terstruktur biasanya meningkatkan konversi 2–4× dibanding chat biasa — hanya karena orang punya waktu eksplor sendiri sebelum memutuskan.</p>
      <h2>Struktur landing page yang closing</h2>
      <p>Tidak perlu 10 section. Cukup 6 blok yang terbukti bekerja untuk produk digital Indonesia. Urutannya:</p>
      <ul>
        <li><strong>Hero</strong> — judul masalah + solusi 1 kalimat, sub-judul yang spesifik, CTA utama, mockup produk di kanan</li>
        <li><strong>Masalah &amp; solusi</strong> — 3 poin singkat: apa yang buyer rasakan sebelum beli, apa yang produk kamu ubah</li>
        <li><strong>Isi produk</strong> — daftar bab, modul, atau file, plus visual cuplikan 2–3 halaman</li>
        <li><strong>Untuk siapa</strong> — bullet spesifik (bukan "semua orang"), sertakan yang TIDAK cocok</li>
        <li><strong>Testimoni &amp; FAQ</strong> — 3 testimoni dengan nama, 4–5 pertanyaan keberatan (garansi, refund, format, dukungan)</li>
        <li><strong>Harga &amp; CTA akhir</strong> — harga jelas, bonus, tombol bayar/link WhatsApp, FAQ terakhir</li>
      </ul>
      <p>Yang sering dilupakan kreator adalah blok "Untuk siapa TIDAK cocok". Trik kecil ini meningkatkan konversi karena calon pembeli merasa jujur dengan mereka — dan yang merasa cocok lebih yakin klik beli.</p>
      <h2>Contoh prompt KARSA untuk landing page produk digital</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt ini. Semakin lengkap detail yang kamu berikan, semakin sedikit revisi yang dibutuhkan. Contoh untuk ebook panduan UMKM:</p>
      <p><em>"Buat landing page untuk ebook 'Pandumu Buka Toko Online' karya Rina Wulandari. Hero section dengan headline 'Buka toko online tanpa stok barang, modal Rp 0', sub-judul 1 kalimat, CTA 'Beli Sekarang Rp 99.000', dan mockup ebook 3D di kanan. Section 'Masalah &amp; Solusi' 3 poin: pusing urus stok, tidak tahu cara foto produk, tidak paham ongkir. Section 'Isi Ebook' 6 bab (Riset Pasar, Foto dari HP, Copywriting WhatsApp, Ongkir &amp; Margin, Ads Sederhana, Scale Up) dengan ikon. Section 'Untuk Siapa' — bullet 'UMKM baru, freelancer, ibu rumah tangga yang ingin cuan', plus 'TIDAK untuk: yang sudah punya toko online berjalan'. Section Testimoni 3 testimoni dengan nama dan foto profil. Section FAQ 5 pertanyaan (format file, garansi refund 7 hari, akses selamanya, grup diskusi, update gratis). Footer harga dengan strikethrough Rp 199.000 jadi Rp 99.000, CTA ke checkout, dan badge '30 hari uang kembali'. Warna utama hijau sage, mobile-first."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"ganti foto mockup jadi lebih minimalis"</em> atau <em>"tambah countdown diskon 24 jam di hero"</em>. Cukup satu kalimat per iterasi. Pola vibecoding ini juga dipakai di <a href="/artikel/prompt-landing-page-konversi">prompt landing page konversi</a> untuk variasi struktur hero-hook-CTA.</p>
      <h2>Tips landing page yang tahan uji kreator</h2>
      <ul>
        <li><strong>Mockup realistis</strong> — bukan foto mockup dari Google, tapi hasil kamu sendiri (mockup Canva gratis cukup)</li>
        <li><strong>Spesifik di testimonial</strong> — "omzet naik 3× di bulan pertama" lebih dipercaya daripada "sangat membantu"</li>
        <li><strong>Harga &amp; bonus jelas</strong> — tampilkan harga akhir, bonus apa saja, dan total nilai (Rp 350.000, sekarang Rp 99.000)</li>
        <li><strong>FAQ jawab keberatan utama</strong> — refund, format file, akses selamanya selalu ditanyakan</li>
        <li><strong>Tombol CTA di 3 titik</strong> — hero, setelah isi produk, dan footer. Mobile user butuh banyak kesempatan klik</li>
      </ul>
      <p>Untuk kreator yang sudah punya audiens, tambahkan section "Sudah dipakai oleh" dengan logo follower atau pelanggan, plus counter (1.200+ eksemplar terjual). Angka spesifik selalu lebih dipercaya daripada "banyak".</p>
      <h2>Kesalahan umum landing page produk digital</h2>
      <ul>
        <li><strong>Terlalu panjang tanpa visual</strong> — paragraf panjang di section pertama bikin orang kabur. Pecah jadi ikon + 1 kalimat</li>
        <li><strong>Harga di belakang</strong> — orang enggan scroll sampai bawah. Tampilkan harga di hero dan setelah isi</li>
        <li><strong>Testimoni tidak spesifik</strong> — testimoni generic ("keren banget") tidak dipercaya. Minta testimoni dengan hasil konkret</li>
        <li><strong>Tombol bayar tidak jelas</strong> — link WA ke nomor salah, atau ke checkout yang rusak. Cek tombol sebelum publish</li>
        <li><strong>Tidak mobile preview</strong> — 80% buyer buka dari HP. Cek viewport kecil, pastikan CTA tidak ketutup nav</li>
      </ul>
      <p>Yang paling penting setelah publish adalah iterasi. Landing page produk digital yang di-update tiap 2–4 minggu dengan testimoni baru, FAQ baru, atau bonus musiman biasanya stabil di konversi 3–5%. Buat versi 2 setelah 30 hari dengan A/B sederhana: ganti hero headline, atau tambah video pendek di section pertama.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail produkmu (judul, harga, testimoni, FAQ), lalu lihat preview dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Untuk kreatif menjual jasa, baca juga <a href="/artikel/landing-page-jasa-freelance">panduan landing page jasa freelance</a> agar kamu tahu perbedaan struktur saat menjual jasa vs produk digital. Setelah publish, link permanen bisa kamu tempel di bio Instagram, broadcast WhatsApp, dan linktree — biar satu halaman bekerja menjelaskan produkmu 24 jam, sambil kamu fokus bikin karya berikutnya.</p>`,
  'website-jasa-konsultan': `
      <p>Konsultan pajak, hukum, IT, bisnis, SDM, dan keuangan di Indonesia masih banyak mengandalkan chat WhatsApp + LinkedIn satu-satu untuk dapat klien. Cara itu membuat jam kerja habis untuk menjawab pertanyaan yang sama berulang, dan calon klien tidak punya gambaran paket, tarif, maupun jadwal kosongmu. Solusinya bukan kalender online mahal: satu <strong>website jasa konsultan</strong> yang kamu tulis sendiri dengan KARSA, mobile-friendly, publish ke link permanen dalam hitungan menit. Tidak perlu WordPress, tidak perlu plugin, tidak perlu desain ulang tiap ada perubahan paket.</p>
      <h2>Apa bedanya website konsultan dengan landing page biasa</h2>
      <p>Landing page UMKM jualan produk fokus pada katalog dan tombol beli. <strong>Website jasa konsultan</strong> berbeda: halaman ini menggabungkan <strong>otoritas</strong> (siapa kamu, pengalaman, sertifikasi), <strong>layanan</strong> (apa yang dikerjakan, untuk siapa, berapa), dan <strong>cara booking</strong> (jadwal, formulir, atau WhatsApp). Karena jasa konsultasi tidak bisa disentuh, calon klien butuh lebih banyak bukti sebelum rela transfer DP. Website yang terstruktur biasanya mempersingkat siklus closing dari 2–4 minggu jadi 5–10 hari, hanya karena pertanyaan awal sudah terjawab sebelum mereka chat.</p>
      <h2>Struktur halaman jasa konsultan yang bikin klien percaya</h2>
      <p>Tidak perlu 12 section. Cukup 7 blok yang terbukti bekerja untuk konsultan independen dan konsultan UMKM di Indonesia. Urutannya:</p>
      <ul>
        <li><strong>Hero</strong> — headline berisi spesialisasi + benefit, sub-judul 1 kalimat, CTA utama "Konsultasi 30 Menit", foto profesional di kanan</li>
        <li><strong>Tentang singkat</strong> — 3–4 baris: siapa kamu, berapa tahun pengalaman, siapa klien utama. Hindari biografi panjang</li>
        <li><strong>Layanan</strong> — 3–5 paket jelas (misal: review laporan pajak, pendampingan izin, audit 1 jam), masing-masing dengan harga atau "mulai dari"</li>
        <li><strong>Untuk siapa</strong> — bullet spesifik (bukan "semua orang"), plus daftar yang TIDAK cocok kamu tangani</li>
        <li><strong>Bukti &amp; kasus</strong> — 3 studi kasus ringkas (situasi, apa yang kamu lakukan, hasil angka), 2–3 testimoni dengan nama</li>
        <li><strong>Cara booking</strong> — step 1-2-3 (pilih paket → isi form → dapat jadwal), link kalender atau WhatsApp</li>
        <li><strong>FAQ</strong> — 5 pertanyaan keberatan (biaya, kerahasiaan, garansi, format konsultasi, refund)</li>
      </ul>
      <p>Yang sering dilupakan konsultan adalah blok "Untuk siapa TIDAK cocok". Trik ini meningkatkan trust karena calon klien merasa kamu jujur, dan mereka yang merasa cocok lebih yakin klik booking.</p>
      <h2>Contoh prompt KARSA untuk website jasa konsultan</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt ini. Semakin lengkap detail yang kamu berikan, semakin sedikit revisi. Contoh untuk konsultan pajak UMKM:</p>
      <p><em>"Buat website jasa konsultan untuk 'Konsultan Pajak UMKM Bandung' oleh Dewi Aryanti, S.E., Ak. CA — 8 tahun membantu UMKM di Jawa Barat. Hero headline 'Bikin Laporan Pajak UMKM Selesai 3 Hari, Mulai Rp 750 Ribu', sub-judul 'Pendampingan one-on-one dengan konsultan bersertifikat', CTA 'Booking Konsultasi 30 Menit', dan foto profesional di kanan. Section Tentang 4 baris (200+ UMKM, S2 Akuntansi UPI, anggota IAPI). Section Layanan 4 paket: Review Laporan Bulanan Rp 750K, Pendampingan SPT Tahunan Rp 2,5jt, Konsultasi Satu Soal Rp 150K/30 menit, Paket Tahunan UMKM Rp 6jt. Section 'Untuk Siapa' bullet UMKM omset 50jt–5M, founder baru go online, freelancer bingung PPh — TIDAK untuk: perusahaan Tbk, sengketa pajak besar. Section Bukti 3 studi singkat (misal 'Bantu kedai kopi di Cimahi hemat Rp 12jt dari restitusi PPN'), testimoni 3. Section Cara Booking 3 step. Section FAQ 5 pertanyaan (kerahasiaan, refund, format, garansi revisi, bahasa dokumen). Footer link WhatsApp + badge 'Anggota IAPI' + strip 'Konsultasi pertama gratis untuk UMKM baru'. Warna utama navy dan emas, mobile-first."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"ganti foto jadi siluet"</em> atau <em>"tambah badge 'IAPI Certified' di hero"</em>. Cukup satu kalimat per iterasi. Pola vibecoding ini juga berlaku untuk <a href="/artikel/bikin-landing-page-dengan-ai">landing page UMKM pada umumnya</a>.</p>
      <h2>Tips website konsultan yang tahan uji klien profesional</h2>
      <ul>
        <li><strong>Foto profesional, bukan selfie</strong> — modal Rp 50–150K untuk foto studio dengan latar netral. Klien korporat lebih percaya wajah yang jelas</li>
        <li><strong>Spesialisasi, bukan generalis</strong> — 'Konsultan pajak untuk F&B' lebih dipercaya daripada 'konsultan pajak semua orang'</li>
        <li><strong>Tarif di halaman</strong> — orang enggan chat hanya untuk tanya harga. Tampilkan "mulai dari" atau paket tetap</li>
        <li><strong>Bukti angka konkret</strong> — 'hemat Rp 12jt' lebih dipercaya daripada 'banyak klien puas'. Minta izin klien sebelumnya</li>
        <li><strong>Kerahasiaan jadi FAQ</strong> — untuk konsultan pajak/hukum, kerahasiaan selalu ditanyakan. Jawab di FAQ, bukan di chat</li>
      </ul>
      <p>Untuk konsultan yang sudah punya banyak klien, tambahkan logo klien (dengan izin) atau counter "200+ UMKM telah dibantu". Angka spesifik lebih dipercaya daripada kata "banyak".</p>
      <h2>Kesalahan umum website jasa konsultan</h2>
      <ul>
        <li><strong>Bahasa terlalu akademis</strong> — paragraf panjang dengan istilah hukum/pajak bikin calon klien kabur. Pecah jadi ikon + 1 kalimat</li>
        <li><strong>Tarif tersembunyi</strong> — orang enggan chat hanya untuk tanya harga. Tampilkan paket di halaman</li>
        <li><strong>Bukti tidak spesifik</strong> — testimoni generic ("sangat membantu") tidak dipercaya. Minta testimoni dengan hasil konkret</li>
        <li><strong>Tidak ada cara booking</strong> — link WA ke nomor salah, atau tidak ada form. Cek tombol sebelum publish</li>
        <li><strong>Tidak mobile preview</strong> — 70% klien buka dari HP. Cek viewport kecil, pastikan CTA tidak ketutup nav</li>
      </ul>
      <p>Yang paling penting setelah publish adalah iterasi. Website konsultan yang di-update tiap 1–2 bulan dengan studi kasus, FAQ, atau testimoni baru biasanya stabil di closing rate 8–15%. Buat versi 2 setelah 60 hari: ganti hero headline, atau tambah video perkenalan di section pertama.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail praktismu (nama, spesialisasi, tarif, testimoni, FAQ), lalu lihat preview dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Untuk portofolio dan paket jasa, bandingkan dengan <a href="/artikel/landing-page-jasa-freelance">panduan landing page jasa freelance</a> dan <a href="/artikel/vibecoding-untuk-umkm">panduan vibecoding UMKM</a> untuk konteks lebih luas. Setelah publish, link permanen bisa kamu tempel di bio LinkedIn, WhatsApp Business, dan kartu nama digital — biar satu halaman bekerja menjual keahlianmu 24 jam.</p>`,
  'katalog-perlengkapan-bayi': `
      <p>Owner toko bayi, Mom &amp; Baby shop, atau reseller stroller di Instagram biasanya melayani lewat DM, broadcast story, dan testimoni. Ortu muda cari rekomendasi dengan tenang — tidak mau terlihat cerewet, tapi tidak mau salah pilih. Solusinya: satu <strong>katalog perlengkapan bayi online</strong> yang mobile-friendly, kategori jelas, ada stok dan tombol WhatsApp, publish dalam hitungan menit dengan KARSA. Tidak perlu WordPress, tidak perlu plugin, tidak perlu desain ulang tiap stok berubah.</p>
      <h2>Kenapa katalog bayi beda dari katalog fashion</h2>
      <p>Produk bayi tidak seperti baju, sepatu, atau kuliner yang bersifat dekat dan emosional. Yang dicari ortu muda adalah <strong>keamanan, sertifikat, dan review</strong>. Rentang usia (0–3, 3–6, 6–12 bulan, 1–2, 2–4 tahun) membuat satu produk punya banyak varian. Stok cepat berubah karena ukuran pakai anak tidak bisa diulang. Katalog yang baik menampilkan usia, berat, bahan, dan nomor sertifikat (SNI untuk dot, BPOM untuk kosmetik bayi, ASTM untuk stroller). CTA-nya bukan "Beli" melainkan "Tanya ketersediaan", karena keputusan beli datang setelah chat. Pola umum ini juga berlaku untuk <a href="/artikel/katalog-produk-online-umkm">katalog produk UMKM pada umumnya</a>, hanya saja untuk bayi perlu kepastian ekstra.</p>
      <h2>Struktur katalog bayi yang bikin orang tua tenang</h2>
      <p>Cukup 7 blok terbukti bekerja untuk Mom &amp; Baby shop di Indonesia:</p>
      <ul>
        <li><strong>Hero</strong> — headline kategori usia (mis. "Toko Bayi 0–3 Tahun, COD Bandung"), foto bayi, CTA "Lihat Katalog"</li>
        <li><strong>Kategori</strong> — box-grid 6–8: Stroller, Car Seat, Bouncer, Baju Bayi, Botol &amp; Dot, Mainan Edukatif, MPASI, Perawatan</li>
        <li><strong>Produk Unggulan</strong> — 4–6 best-seller, foto rapi, harga, badge "SNI" atau "BPOM" bila ada, link WhatsApp</li>
        <li><strong>Filter Usia</strong> — chip 0–3, 3–6, 6–12, 1–2, 2–4 tahun; ortu klik langsung lihat koleksi sesuai anaknya</li>
        <li><strong>Bundle / Paket</strong> — newborn, MPASI, perjalanan (stroller + car seat). Paket meningkatkan rata-rata transaksi 30–50%</li>
        <li><strong>Testimoni</strong> — 3 testimoni ortu dengan nama, usia anak, dan foto (dengan izin)</li>
        <li><strong>FAQ &amp; Kebijakan</strong> — COD area mana, retur berapa hari, garansi car seat, konsultasi ukuran via WhatsApp</li>
      </ul>
      <p>Yang sering dilupakan adalah blok "Filter Usia". Ortu dengan bayi 4 bulan tidak mau scroll 40 produk hanya untuk cari dot usia 4+. Chip kategori usia menghemat 5–10 menit, dan itu yang membedakan katalog profesional dari foto produk acak.</p>
      <h2>Contoh prompt KARSA untuk katalog perlengkapan bayi</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt ini. Semakin lengkap detail yang kamu berikan, semakin sedikit revisi. Contoh untuk toko bayi lokal di Jakarta:</p>
      <p><em>"Buat katalog online untuk 'BabySteps Shop Jakarta' oleh Bu Rina, 3 tahun. Hero headline 'Perlengkapan Bayi 0–3 Tahun, COD Jakarta &amp; Bekasi', foto bayi, CTA 'Lihat Katalog'. Section 8 kategori: Stroller, Car Seat, Bouncer, Baju Bayi, Botol &amp; Dot, Mainan Edukatif, MPASI, Tidur. Section Produk Unggulan 6 item termasuk Stroller Cocolatte 3in1 Rp 1,8jt, Car Seat Cocolatte 0–4 tahun Rp 2,2jt, Bouncer Fisher Price Rp 650K, Baju Newborn 5pcs Rp 180K, Set Botol Pigeon 3pcs Rp 220K, Mainan Kayu Rp 95K. Section Filter Usia 5 chip. Section Bundle 3 paket: Newborn Essential Rp 350K, MPASI Starter Rp 175K, Travel Set Rp 4,1jt. Section Testimoni 3 (Bu Laras bayi 8 bulan, Pak Dedi bayi 1 tahun, Bu Sinta bayi 2 tahun). Section FAQ 5 (COD area, retur 7 hari, garansi car seat 1 tahun, konsultasi ukuran via WhatsApp, sertifikat SNI). Footer link WhatsApp + badge SNI + BPOM. Warna pastel pink, biru, putih, mobile-first."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"tambah badge BPOM di kosmetik"</em> atau <em>"ganti bundle jadi 4"</em>. Pola vibecoding ini juga dipakai untuk <a href="/artikel/vibecoding-untuk-umkm">katalog UMKM pada umumnya</a>.</p>
      <h2>Tips katalog bayi yang tahan uji ortu profesional</h2>
      <ul>
        <li><strong>Foto produk, bukan fotostock</strong> — ortu muda percaya foto asli warehouse. Modal Rp 50–150K untuk foto produk dengan latar putih sudah cukup</li>
        <li><strong>Kelompokkan usia, bukan merek</strong> — 'Baju 6–12 bulan' lebih dicari daripada 'Baju Brand A'. Pengalaman belanja sesuai tahap tumbuh kembang anak</li>
        <li><strong>Tampilkan sertifikat</strong> — SNI untuk dot, ASTM untuk stroller, BPOM untuk kosmetik. Badge kecil sudah cukup membangun trust</li>
        <li><strong>Stok real-time</strong> — update manual tiap 1–2 hari. Ortu yang kecewa karena "barang kosong" tidak kembali</li>
        <li><strong>CTA tanya, bukan beli</strong> — 'Tanya ukuran untuk 8 bulan' lebih sopan daripada 'Beli'. Apalagi untuk produk mahal</li>
      </ul>
      <p>Untuk toko yang sudah ramai, tambahkan counter "500+ keluarga dibantu". Angka spesifik lebih dipercaya daripada kata "banyak". Minta izin pelanggan sebelum memajang foto bayi mereka di testimoni.</p>
      <h2>Kesalahan umum katalog bayi online</h2>
      <ul>
        <li><strong>Tanpa filter usia</strong> — ortu scroll 50 produk hanya untuk cari dot. Tambahkan chip usia</li>
        <li><strong>Tidak ada sertifikat</strong> — tanpa badge SNI/BPOM, ortu ragu. Tambahkan sticker kecil</li>
        <li><strong>Foto tidak konsisten</strong> — latar beda-beda. Style guide: putih, posisi tengah, 800×800px</li>
        <li><strong>Harga tidak jelas</strong> — "call for price" bikin ortu kabur. Tampilkan harga atau "mulai dari"</li>
        <li><strong>Tidak ada kebijakan retur</strong> — untuk produk bayi, ortu wajib tahu cara tukar ukuran</li>
        <li><strong>Tidak mobile preview</strong> — 80% ortu buka dari HP. Cek viewport kecil</li>
      </ul>
      <p>Yang paling penting setelah publish adalah iterasi. Katalog yang di-update tiap 2–4 minggu dengan produk baru, bundle musiman, dan testimoni biasanya stabil di conversion 4–7%. Buat versi 2 setelah 60 hari: tambah "Paket Hadiah Baby Shower", atau video unboxing singkat.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail tokomu, lalu lihat preview dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Untuk variasi katalog lain, bandingkan dengan <a href="/artikel/katalog-kerajinan-tangan">panduan katalog kerajinan tangan</a> agar kamu tahu perbedaan struktur saat menjual karya handmade vs produk bayi. Setelah publish, link permanen bisa kamu tempel di bio Instagram, broadcast WhatsApp, dan linktree — biar satu etalase digital bekerja menjelaskan produkmu 24 jam, sementara kamu fokus packing pesanan.</p>`,
  'website-toko-oleh-oleh': `
      <p>Toko oleh-oleh di Bandung, Semarang, Yogyakarta, Bali, atau kota wisata lain biasanya mengandalkan etalase kaca di pinggir jalan dan testimoni mulut ke mulut dari traveler. Saat musim liburan rame, antrian panjang; saat sepi, showroom kosong. Pelancong zaman sekarang browsing dulu sebelum jalan, dan mereka cari kepastian: produk apa, harga berapa, bisa kirim ke Jakarta atau tidak. <strong>Website toko oleh-oleh</strong> yang mobile-friendly menjawab semua itu sekaligus — link permanen yang bisa dishare ke grup WhatsApp keluarga, broadcast travel agent, atau rekomendasi di TripAdvisor. Dengan KARSA kamu bisa publish etalase digital lengkap dalam hitungan menit, tanpa sewa developer.</p>
      <h2>Kenapa toko oleh-oleh perlu website</h2>
      <p>Etalase fisik bagus untuk impulse buyer yang lewat, tapi tidak untuk traveler yang pulang ke kota asal dan ingin kirim oleh-oleh untuk keluarga satu bulan kemudian. Tanpa link permanen, transaksi itu hilang. Website toko oleh-oleh menjawab tiga kebutuhan spesifik pelancong modern:</p>
      <ul>
        <li><strong>Browsing sebelum jalan</strong> — traveler riset daftar produk, harga, dan paket dari rumah. Tanpa website, kamu tidak muncul di pencarian "oleh-oleh Bandung enak"</li>
        <li><strong>Kirim ke luar kota</strong> — banyak toko kecil tidak bisa kirim karena tidak ada form online. Padahal ongkir ke Jakarta bisa jadi margin tambahan</li>
        <li><strong>Kepercayaan reseller</strong> — korporat yang kirim parcel ke klien butuh vendor dengan link tetap, bukan cuma akun Instagram</li>
      </ul>
      <p>Dengan satu link website, toko oleh-oleh di pinggir jalan bisa melayani pelancong dari Sabang sampai Merauke, plus reseller korporat dari LinkedIn. Pola ini mirip dengan <a href="/artikel/katalog-menu-restoran-online">katalog menu restoran online</a> yang juga mengandalkan link permanen untuk pelanggan yang tidak sempat mampir langsung.</p>
      <h2>Struktur website toko oleh-oleh yang bikin traveler percaya</h2>
      <p>Cukup 7 blok terbukti bekerja untuk toko oleh-oleh UMKM di Indonesia:</p>
      <ul>
        <li><strong>Hero</strong> — headline ciri khas daerah (mis. "Oleh-Oleh Khas Bandung Sejak 1998, Kirim Se-Indonesia"), foto etalase, CTA "Lihat Katalog"</li>
        <li><strong>Best Seller</strong> — 6 produk terlaris dengan foto, harga, label "Best Seller"</li>
        <li><strong>Kategori</strong> — box-grid 6–8: Makanan Kering, Kue Basah, Keripik, Sambal, Parcel, Minuman, Snack Import, Kerajinan</li>
        <li><strong>Paket &amp; Parcel</strong> — paket hemat, parcel kantor, parcel hari raya. Margin paket biasanya lebih tinggi 20–30%</li>
        <li><strong>Kirim ke Luar Kota</strong> — ekspedisi (JNE, J&amp;T, Paxel), ongkir estimasi, packing kayu untuk makanan</li>
        <li><strong>Cerita Toko</strong> — kapan buka, kenapa khas, foto owner, plus sertifikasi (halal, BPOM, P-IRT)</li>
        <li><strong>Testimoni &amp; FAQ</strong> — 3 testimoni pelancong (kota asal, produk), plus 5 FAQ (tahan berapa lama, retur, custom parcel, COD, gift wrapping)</li>
      </ul>
      <p>Blok "Kirim ke Luar Kota" sering dilupakan toko kecil. Padahal traveler dari Jakarta atau Surabaya enggan beli oleh-oleh yang tidak bisa dikirim. Tampilkan info ekspedisi + packing kayu agar trust naik 2–3x.</p>
      <h2>Contoh prompt KARSA untuk website toko oleh-oleh</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt di bawah ini. Contoh untuk toko oleh-oleh di Bandung:</p>
      <p><em>"Buat website toko oleh-oleh untuk 'Toko Acih Bandung' oleh Pak Asep, sejak 1998, di Jalan Asia Afrika 100. Hero headline 'Oleh-Oleh Khas Bandung Sejak 1998, Kirim Se-Indonesia', foto etalase toko, CTA 'Lihat Katalog'. Section Best Seller 6 item: Brownies Kukus Tiramisu Rp 85K, Batagor Frozen 10pcs Rp 65K, Keripik Tempe 250gr Rp 35K, Sambal Cibiuk Botol Rp 45K, Peuyeum Bandung 6pcs Rp 50K, Dodol Garut 500gr Rp 75K. Section Kategori 8. Section Paket &amp; Parcel 4 paket: Parcel A Rp 250K, Parcel B Rp 350K (premium box), Parcel Kantor Rp 450K (10 orang), Parcel Hari Raya Rp 550K. Section Kirim ke Luar Kota: JNE/J&amp;T/Paxel, packing kayu Rp 25K, estimasi 2–4 hari, COD Bandung. Section Cerita Toko: 3 paragraf (sejak 1998, resep turun temurun). Section Testimoni 3 (Bpk Hendra Jakarta, Ibu Lina Surabaya, Tour Leader Malaysia). Section FAQ 5 (tahan 3 hari suhu ruang, 2 minggu kulkas, retur 1 hari rusak, custom parcel 50pcs min, gift wrapping Rp 15K). Footer WhatsApp + IG + badge Halal + BPOM. Warna merah maroon dan krem, mobile-first."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"tambah section parcel Natal"</em> atau <em>"ganti foto hero jadi owner"</em>. Pola vibecoding seperti ini juga berlaku untuk <a href="/artikel/katalog-kerajinan-tangan">katalog kerajinan tangan</a> yang fokus pada cerita produk handmade.</p>
      <h2>Tips website toko oleh-oleh yang tahan uji pelancong</h2>
      <ul>
        <li><strong>Foto asli produk</strong> — traveler percaya foto keranjang parcel asli lebih dari foto Pinterest. Modal Rp 50–100K foto produk dengan cahaya natural sudah cukup</li>
        <li><strong>Tampilkan label halal &amp; BPOM</strong> — untuk makanan, badge kecil sudah cukup membangun trust</li>
        <li><strong>Harga jujur</strong> — tampilkan "mulai dari Rp 35K" atau harga tetap. Traveler dari luar kota malas tawar</li>
        <li><strong>Paket parcel lengkap</strong> — parcel 5–10 item meningkatkan rata-rata transaksi 30–50% daripada beli satuan</li>
        <li><strong>Update stok musiman</strong> — saat Lebaran, parcel ludes. Tampilkan "Pre-order 7 hari" bila stok terbatas</li>
      </ul>
      <p>Untuk toko yang sudah ramai, tambahkan counter "20.000+ pelancong dilayani" atau logo travel agent yang pernah order. Angka spesifik lebih dipercaya daripada klaim "banyak pelanggan".</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail tokomu (nama, produk, parcel, ekspedisi), lalu lihat preview dalam satu menit. Paket gratis termasuk 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Untuk variasi UMKM kuliner lain, bandingkan dengan <a href="/artikel/katalog-menu-restoran-online">panduan katalog menu restoran online</a> agar kamu tahu perbedaan struktur saat menjual menu harian vs oleh-oleh tahan lama. Setelah publish, link permanen bisa kamu tempel di bio Instagram, Google Maps, dan banner toko fisik — biar satu etalase digital melayani pelancong 24 jam, sementara kamu fokus produksi dan packing parcel.</p>`,
  'website-laundry-sepatu': `
      <p>Bisnis laundry sepatu dan sneaker care di Indonesia tumbuh pesat — dari Clean My Shoes, Sneakers Point, sampai ratusan UMKM rumahan yang layani antar-jemput. Sebagian besar masih rely pada Instagram, WhatsApp, dan Google Maps. Saat orderan rame, chat numpuk; saat sepi, pelanggan tidak bisa cek status cucian. <strong>Website laundry sepatu</strong> yang mobile-friendly menjawab semua itu sekaligus: etalase layanan, tarif per jenis, form serah terima, dan tombol WhatsApp — publish dalam hitungan menit dengan KARSA, tanpa sewa developer.</p>
      <h2>Kenapa laundry sepatu perlu website</h2>
      <p>Pelanggan sneaker care punya tiga pertanyaan sebelum order: "bisa cuci apa?", "berapa biayanya?", "berapa hari jadi?". Tanpa link permanen, mereka harus chat dulu — dan banyak yang akhirnya batal karena malas nunggu balesan. Website menjawab itu dalam 5 detik, plus:</p>
      <ul>
        <li><strong>tracking status cucian</strong> — pelanggan tinggal buka link, lihat "siap diambil" tanpa harus chat</li>
        <li><strong>form serah terima</strong> — kurir antar-jemput punya data pelanggan, alamat, dan jenis sepatu sebelum dijemput</li>
        <li><strong>testimoni before-after</strong> — foto hasil cuci lebih dipercaya daripada caption testimoni</li>
      </ul>
      <p>Dengan satu link, bisnis rumahan di gang kecil bisa melayani pelanggan se-kota via ojol, plus reseller sepatu preloved. Pola ini mirip dengan <a href="/artikel/form-booking-online-umkm">form booking online UMKM</a> yang juga mengandalkan link permanen untuk pelanggan yang tidak sempat datang.</p>
      <h2>Struktur website laundry sepatu yang bikin customer order</h2>
      <p>Cukup 7 blok terbukti bekerja untuk bisnis sneaker care UMKM di Indonesia:</p>
      <ul>
        <li><strong>Hero</strong> — headline jelas (mis. "Cuci Sepatu Premium, Same Day Service, Jemput Jabodetabek"), foto before-after, CTA "Cek Tarif"</li>
        <li><strong>Layanan</strong> — box-grid 6–8: Fast Clean, Deep Clean, Whitening, Unyellowing, Reparasi Sol, Repaint, Treatment Kulit, Anti Bacterial</li>
        <li><strong>Tarif per Jenis</strong> — tabel atau card Sneakers (Rp 35–55K), Kanvas (Rp 25–40K), Boots (Rp 60–90K), Suede (Rp 50–75K), Leather (Rp 70–120K)</li>
        <li><strong>Tracking Status</strong> — input nomor order, tampilkan "Diterima / Dicuci / Dijemur / QC / Siap Diambil" — bahkan bisa statis manual tiap pagi</li>
        <li><strong>Form Serah Terima</strong> — nama, WhatsApp, alamat jemput, jenis sepatu, jumlah, foto kondisi awal, jadwal jemput</li>
        <li><strong>Before-After Gallery</strong> — 6–8 foto, kelompokkan Sneakers vs Kanvas vs Boots. Pola ini sama dengan <a href="/artikel/landing-page-jasa-freelance">landing page jasa</a> yang fokus pada bukti kerja</li>
        <li><strong>FAQ &amp; Kebijakan</strong> — 5 FAQ (estimasi selesai, garansi noda balik, cara pembayaran, antar-jemput area mana, retur jika sepatu rusak)</li>
      </ul>
      <p>Blok "Tarif per Jenis" sering dilupakan bisnis kecil. Pelanggan malas chat hanya untuk tanya harga. Tampilkan harga dari Rp 25K sudah cukup untuk filter 50% pertanyaan. Diskon berlaku untuk paket 3 pasang atau lebih.</p>
      <h2>Contoh prompt KARSA untuk website laundry sepatu</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt di bawah ini. Semakin lengkap detail yang kamu berikan, semakin sedikit revisi. Contoh untuk bisnis laundry sepatu di Jakarta:</p>
      <p><em>"Buat website laundry sepatu untuk 'SneakerClean Jakarta' oleh Bang Dika, 4 tahun. Hero headline 'Cuci Sepatu Premium, Same Day Service, Jemput Jabodetabek', foto before-after sneakers putih, CTA 'Cek Tarif'. Section Layanan 8: Fast Clean, Deep Clean, Whitening, Unyellowing, Reparasi Sol, Repaint, Treatment Kulit, Anti Bacterial. Section Tarif per Jenis 5: Sneakers Rp 35–55K, Kanvas Rp 25–40K, Boots Rp 60–90K, Suede Rp 50–75K, Leather Rp 70–120K. Section Tracking Status: input nomor order, tampilkan 5 status. Section Form Serah Terima 7 field (nama, WhatsApp, alamat, jenis sepatu, jumlah, foto, jadwal). Section Before-After Gallery 6 foto. Section FAQ 5 (same day 6 jam, garansi noda balik 7 hari, transfer &amp; e-wallet, antar-jemput 10km, retur 1x24 jam). Footer WhatsApp + IG + testimoni 3. Warna hitam, putih, kuning neon, mobile-first."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"tambah paket hemat 3 pasang Rp 120K"</em> atau <em>"ganti foto hero jadi before-after kanvas"</em>. Pola vibecoding seperti ini juga berlaku untuk <a href="/artikel/katalog-menu-restoran-online">katalog UMKM kuliner</a> yang fokus pada etalase produk.</p>
      <h2>Tips website laundry sepatu yang bikin pelanggan balik</h2>
      <ul>
        <li><strong>Foto before-after asli</strong> — pelanggan percaya foto nyata daripada stock photo. Modal Rp 0 karena HP sudah cukup</li>
        <li><strong>Tampilkan estimasi waktu</strong> — same day, 2 hari, atau 5 hari. Pelanggan lebih tenang saat tau deadline</li>
        <li><strong>Update tracking tiap pagi</strong> — 30 detik via spreadsheet yang di-screenshot. Bisa otomatis via Google Sheets embed</li>
        <li><strong>Paket hemat</strong> — diskon 15–20% untuk 3 pasang. Rata-rata transaksi naik 40%</li>
        <li><strong>Highlight sertifikasi</strong> — chemical-safe, hypoallergenic, atau brand produk yang dipakai (mis. Jason Markk, Kiwi)</li>
      </ul>
      <p>Untuk bisnis yang sudah ramai, tambahkan counter "5.000+ sepatu dicuci" atau "4.8 rating Google". Angka spesifik lebih dipercaya dari klaim umum. Minta izin sebelum pajang foto sepatu branded.</p>
      <h2>Kesalahan umum laundry sepatu online</h2>
      <ul>
        <li><strong>Tanpa tarif</strong> — pelanggan kabur karena tidak tau harga. Tampilkan minimal range</li>
        <li><strong>Tidak ada tracking</strong> — pelanggan chat tiap hari "udah jadi?". Tambahkan status sederhana</li>
        <li><strong>Foto tidak konsisten</strong> — before-after angle beda. Style guide: angle 45°, cahaya natural, latar putih</li>
        <li><strong>Form terlalu panjang</strong> — 7 field cukup. Lebih dari itu, pelanggan batal</li>
        <li><strong>Tidak mobile preview</strong> — 80% pelanggan sneakers buka dari HP. Cek viewport kecil</li>
      </ul>
      <p>Yang paling penting setelah publish adalah iterasi. Website yang di-update tiap 2–4 minggu dengan foto before-after baru, promo musiman, dan testimoni biasanya stabil di conversion 5–8%. Versi 2 setelah 60 hari: tambah "pick-up gratis 5km" atau membership Rp 150K untuk 4 pasang.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt, ganti detail bisnismu, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari, cukup untuk eksplorasi tanpa keluar biaya. Bandingkan dengan <a href="/artikel/form-booking-online-umkm">panduan form booking UMKM</a> untuk bedanya booking jadwal vs pesan layanan. Setelah publish, link permanen bisa kamu tempel di bio Instagram, Google Maps, dan kartu nama — biar satu etalase digital menjelaskan layananmu 24 jam, sementara kamu fokus cuci dan antar-jemput pesanan.</p>`,
  'landing-page-preorder': `
      <p>Pre-order selalu jadi cara jualan favorit saat produk belum ready: drops fashion, parcel Lebaran, bundling kopi spesial harvest, stok awal sneakers, sampai kursus online dengan peserta terbatas. Masalahnya, link chat WhatsApp sering hilang di antara broadcast dan DM lain. Pembeli niat checkout mundur karena ragu. <strong>Landing page preorder</strong> yang mobile-friendly mengubah niat itu jadi transaksi — countdown, slot tersisa, harga early bird, dan form pre-order rapi di satu halaman.</p>
      <h2>Kapan UMKM butuh landing page preorder</h2>
      <p>Kamu butuh landing page khusus saat produk belum ready dan mau commit jumlah produksi dari transaksi yang masuk lebih dulu. Paling sering dipakai:</p>
      <ul>
        <li><strong>Drops fashion</strong> — thrift, hijab, sneakers lokal, dengan slot terbatas per warna atau size</li>
        <li><strong>Parcel musiman</strong> — Lebaran, Natal, Imlek, parcel korporat untuk klien perusahaan</li>
        <li><strong>Produk digital batch</strong> — ebook update, template Notion baru, membership batch terbatas</li>
        <li><strong>Pre-launch brand baru</strong> — founder mau cek demand sebelum produksi massal</li>
        <li><strong>Event dan workshop</strong> — gelombang 1, 2, 3 dengan harga yang naik per gelombang</li>
      </ul>
      <p>Logika utamanya sama: pembeli commit lebih dulu, kamu produksi sesuai jumlah. Karena itu halaman harus menunjukkan scarcity (slot, deadline) dan trust (foto, testimoni) sekaligus. Tanpa keduanya, pre-order terasa gimmicky.</p>
      <h2>Struktur landing page preorder yang bikin orang checkout</h2>
      <p>Dari ratusan halaman pre-order UMKM yang convert di atas 5%, ada tujuh blok yang selalu muncul. Susun dalam urutan ini:</p>
      <ul>
        <li><strong>Hero + Countdown</strong> — headline benefit, foto produk, dan timer mundur ke deadline. Countdown di JavaScript sederhana</li>
        <li><strong>Slot Counter</strong> — "tersisa 23 dari 100 slot", update real-time. Bikin orang takut kehabisan</li>
        <li><strong>Harga &amp; Tier</strong> — early bird, reguler, dan bundle. Tampilkan harga coret kalau ada diskon</li>
        <li><strong>Benefit &amp; What's Included</strong> — apa yang dapat, kapan dikirim, garansi, bonus kecil</li>
        <li><strong>Trust Block</strong> — testimoni 3–5 orang, logo media yang meliput, atau jumlah follower</li>
        <li><strong>Form Pre-order</strong> — nama, WhatsApp, alamat, varian, jumlah, dan catatan. Kirim ke WhatsApp owner</li>
        <li><strong>FAQ &amp; Kebijakan</strong> — 5–7 pertanyaan: kapan dikirim, bagaimana jika batal, ongkir, retur</li>
      </ul>
      <p>Bagian countdown wajib mobile-friendly karena 80% traffic pre-order datang dari story IG. Timer yang tidak jelas di HP bikin orang scroll lewat. Paket gratis KARSA cukup untuk versi pertama; paket Pro menghapus watermark dan menambah AI prompt tanpa batas untuk iterasi.</p>
      <h2>Contoh prompt KARSA untuk landing page preorder</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt berikut. Contoh untuk drops hijab dengan slot terbatas:</p>
      <p><em>"Buat landing page pre-order hijab brand 'Luma Scarf' oleh Mbak Sari, Jakarta. Hero headline 'Drops 3: 5 Motif Eksklusif, Slot 100 Pembeli'. Foto model hijab warna sage, terracotta, lilac. Countdown timer mundur ke 20 Juni 2026 jam 23.59 WIB. Slot counter '67 / 100 terisi', update dari form submission. Section Harga 3 tier: Early Bird Rp 175K (50 slot), Reguler Rp 210K (35 slot), Bundle 3 pcs Rp 550K (15 slot). Tabel benefit early bird: free ongkir, bonus pouch, akses VIP grup WhatsApp. Section Trust: 4 testimoni pembeli sebelumnya, 12K follower IG, liputan di 3 media. Form Pre-order 7 field: nama, WhatsApp, alamat, pilih motif (dropdown 5), pilih tier (3 radio), jumlah (1–3), catatan. Kirim ke WhatsApp 0812xxx. Section FAQ 7: kapan dikirim (15 Juni), retur (7 hari), ongkir (Rp 15K), batal (uang kembali 100% sampai 5 hari), kualitas (sudah 3 batch), tracking (link WhatsApp). Footer WhatsApp + IG + e-mail. Warna cream, sage, terracotta, mobile-first."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"tambah popup konfirmasi setelah form submit"</em> atau <em>"ganti foto hero jadi shot flat-lay 5 motif"</em>. Pola vibecoding ini juga berlaku untuk <a href="/artikel/landing-page-event">landing page event</a> dan <a href="/artikel/landing-page-produk-digital">landing page produk digital</a>.</p>
      <h2>Tips landing page preorder yang benar-benar convert</h2>
      <ul>
        <li><strong>Countdown harus asli</strong> — timer mundur ke deadline produksi yang sebenarnya. Timer palsu bikin audiens kabur</li>
        <li><strong>Slot counter update</strong> — manual tiap 10 order dari spreadsheet, atau integrasi Google Sheets</li>
        <li><strong>Harga early bird 15–25% lebih murah</strong> — beda tipis tidak cukup</li>
        <li><strong>Foto produk pakai flat-lay atau model</strong> — angle konsistensi membangun trust. HP cukup, asal cahaya natural dan latar bersih</li>
        <li><strong>Form 7 field maksimal</strong> — lebih dari itu, completion rate turun drastis. Sisanya bisa kamu follow-up via WhatsApp</li>
        <li><strong>Tampilkan sosial proof</strong> — screenshoot testimoni, jumlah follower, atau jumlah drops sebelumnya. Bukti lebih kuat dari klaim</li>
      </ul>
      <p>Untuk drops yang sudah punya audiens, tambahkan blok "Bonus untuk 50 pembeli pertama" seperti e-book gratis atau akses VIP. Untuk parcel musiman, FAQ wajib detail soal ongkir dan retur.</p>
      <h2>Kesalahan umum landing page preorder UMKM</h2>
      <ul>
        <li><strong>Tanpa countdown</strong> — pembeli tidak merasa urgensi. Slot terbatas tanpa timer biasanya kurang convert 50%</li>
        <li><strong>Harga tidak jelas</strong> — tampilkan harga satuan dan bundle. Kalau ada ongkir terpisah, tulis eksplisit</li>
        <li><strong>Form input alamat tidak perlu</strong> — untuk produk digital cukup e-mail + WhatsApp. Untuk barang fisik tetap perlu alamat</li>
        <li><strong>Tidak mobile preview</strong> — 80% traffic dari HP. Cek viewport 360px (layar terkecil) sebelum publish</li>
        <li><strong>Tanpa kebijakan refund</strong> — pre-order yang tidak jelas refund-nya bikin ragu. Tulis 1–2 kalimat saja</li>
        <li><strong>CTA lemah</strong> — "Klik di sini" tidak cukup. Pakai "Pesan Slot Sekarang — Rp 175K" dengan tombol warna kontras</li>
      </ul>
      <p>Yang paling penting setelah publish adalah iterasi berdasarkan chat masuk. Versi 2 setelah 30 hari biasanya naik conversion 20–40% hanya karena menjawab keraguan yang muncul di DM.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail drops-mu, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari cukup untuk eksplorasi. Bandingkan dengan <a href="/artikel/landing-page-produk-digital">panduan landing page produk digital</a> untuk perbedaan saat menjual ebook atau membership. Setelah publish, tempel link di bio IG dan story — biar satu halaman menjelaskan produk, harga, dan countdown 24 jam.</p>`,
  'katalog-furniture-minimalis': `
      <p>Showroom di kota besar menyewa mahal, catalog PDF dikirim via WhatsApp sering bingung saat pelanggan forward ke teman, dan foto produk tercecer di galeri HP. Katalog furniture minimalis online yang mobile-friendly memecahkan semuanya: satu link permanen yang bisa dibuka arsitek, desainer interior, maupun pelanggan rumahan dari HP mereka. Pelanggan tinggal scroll, klik produk yang mirip gaya, lalu chat WhatsApp untuk detail harga dan ongkir.</p>
      <h2>Elemen wajib di katalog furniture online</h2>
      <p>Katalog furniture bukan sekadar galeri foto. Pelanggan butuh informasi agar tidak balik nanya hal yang sama lewat chat. Blok yang selalu muncul di katalog yang closing:</p>
      <ul>
        <li><strong>Foto produk</strong> — minimal 3 angle: tampak depan, sudut 45°, dan detail sambungan atau finishing</li>
        <li><strong>Nama dan kategori</strong> — lemari, meja, rak, sofa, kursi. Pakai istilah yang umum dicari Google</li>
        <li><strong>Dimensi</strong> — panjang, lebar, tinggi dalam cm. Pelanggan tidak akan beli tanpa angka ini</li>
        <li><strong>Material</strong> — kayu jati solid, plywood finishing HPL, besi hollow powder coating, rotan sintetis</li>
        <li><strong>Harga</strong> — tampilkan eksplisit atau rentang "mulai Rp 2,4 juta". Tersembunyi = bounce</li>
        <li><strong>Warna finishing</strong> — natural, walnut, black, whitewash. Pakai swatch kalau bisa</li>
        <li><strong>Tombol WhatsApp</strong> — floating button ke nomor owner dengan pesan otomatis berisi nama produk</li>
      </ul>
      <p>Yang membedakan katalog profesional dari sekadar galeri foto adalah detail teknis. Pelanggan furniture butuh kepastian: muat di ruang tamu ukuran 3x4 meter, muat di pintu lift, tahan Rayap atau tidak, dan berapa lama garansi. Semakin lengkap sebelum klik WhatsApp, semakin sedikit round-trip chat.</p>
      <h2>Contoh prompt KARSA untuk katalog furniture</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt berikut. Contoh untuk UMKM mebel minimalis di Jepara:</p>
      <p><em>"Buat katalog furniture minimalis online untuk 'Studio Mebel Jati — Bu Lastri' di Jepara. Hero 'Furniture Jati Solid untuk Rumah Modern'. Grid 12 produk: Rak Dinding Jati 60cm Rp 850K, Meja Tamu Jati Bulat 80cm Rp 1,8 juta, Lemari Piring Jati 3 pintu Rp 3,4 juta, Kursi Jati Sandaran Lengkung Rp 1,2 juta, Nakas Jati 2 laci Rp 950K, Bufet Jati 4 laci Rp 2,8 juta, Meja Makan Jati 6 Kursi Rp 6,5 juta, Rak Buku Jati 5 susun Rp 2,1 juta, Tempat Tidur Jati Queen Rp 4,8 juta, Lemari Pakaian Jati 3 pintu Rp 5,2 juta, Bangku Teras Jati 120cm Rp 1,4 juta, Set Meja Kerja Jati Rp 1,9 juta. Tiap kartu: foto, nama, dimensi, material, harga, tombol WhatsApp ke 0812xxx dengan pesan otomatis nama produk. Section Tentang: bu Lastri 15 tahun pengrajin jati Jepara, garansi 2 tahun, kirim seluruh Indonesia via cargo. Section FAQ 6: cara pesan, ongkir, retur, custom ukuran, waktu produksi, kayu bersertifikat. Filter sidebar: kategori (rak/meja/kursi/lemari), rentang harga (di bawah 1 juta / 1-3 juta / 3-5 juta / di atas 5 juta), material (jati/plywood/besi). Warna cream, kayu, hitam, mobile-first."</em></p>
      <p>Setelah preview muncul, minta iterasi per bagian: <em>"tambah lightbox foto klik jadi besar"</em> atau <em>"tambah badge 'Best Seller' di 3 produk terlaris"</em>. Pola vibecoding ini berlaku juga untuk <a href="/artikel/katalog-produk-online-umkm">katalog produk UMKM</a> lain seperti kerajinan tangan dan thrift.</p>
      <h2>Tips katalog furniture yang benar-benar closing</h2>
      <ul>
        <li><strong>Foto background putih atau kayu netral</strong> — warna ramai bikin produk kecil dan tidak kelihatan detail</li>
        <li><strong>Tulis dimensi di kartu, bukan hanya di spec sheet</strong> — pelanggan malas buka dua halaman</li>
        <li><strong>Tampilkan harga eksplisit</strong> — furniture yang harganya "call for price" convert 60% lebih rendah</li>
        <li><strong>Pakai nama produk yang searchable</strong> — "Meja Tamu Jati Bulat 80cm" lebih baik dari "MD-12"</li>
        <li><strong>Sertakan foto di ruangan nyata</strong> — staging di ruang tamu atau kamar bantu pelanggan membayangkan</li>
        <li><strong>Filter wajib</strong> — katalog di atas 15 produk tanpa filter bikin orang scroll terlalu lama</li>
        <li><strong>WhatsApp link pakai pesan otomatis</strong> — <code>https://wa.me/62812xxx?text=Halo%20Bu%20Lastri%2C%20saya%20tertarik%20Meja%20Tamu%20Jati%20Bulat%2080cm</code></li>
      </ul>
      <p>Untuk UMKM yang melayani interior designer atau kontraktor, tambahkan section "Proyek Kami" dengan foto before-after dan testimoni klien. Untuk ritel rumahan, fokus ke foto staging yang hangat dan harga eksplisit. Versi 2 setelah 60 hari biasanya punya konversi 2x lipat hanya karena menulis harga eksplisit dan dimensi lengkap.</p>
      <h2>Kesalahan umum katalog furniture UMKM</h2>
      <ul>
        <li><strong>Foto produk tanpa konteks</strong> — katalog terasa seperti selembar foto produk, bukan toko. Tambah staging di ruangan</li>
        <li><strong>Tidak ada dimensi</strong> — pelanggan furniture selalu tanya ukuran dulu. Tanpa dimensi, mereka pergi</li>
        <li><strong>Harga tersembunyi</strong> — "hubungi untuk harga" bikin bounce. Tulis rentang minimal</li>
        <li><strong>Tombol WhatsApp tidak ada</strong> — katalog tanpa CTA utama = etalase tanpa kasir</li>
        <li><strong>Desain terlalu ramai</strong> — furniture minimalis butuh latar bersih. Hindari gradient dan banner besar</li>
        <li><strong>Tidak SEO-friendly</strong> — page title dan meta description harus berisi kata kunci "katalog furniture online"</li>
        <li><strong>Tanpa kebijakan ongkir</strong> — furniture besar butuh info cargo dan estimasi biaya. Tulis eksplisit</li>
      </ul>
      <p>Yang paling penting setelah publish adalah kecepatan memuat. Furniture katalog yang loading 5+ detik di HP 4G biasanya bounce 70%. Pakai foto dikompres ke WebP, ukur dengan PageSpeed, dan compress lagi kalau perlu. Versi mobile-first wajib diuji di viewport 360px.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail furniture kamu, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari cukup untuk eksplorasi. Bandingkan dengan <a href="/artikel/seo-website-umkm">panduan SEO website UMKM</a> untuk cara muncul di pencarian, dan <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> untuk konteks vibecoding. Setelah publish, link permanen bisa kamu tempel di bio Instagram, Google Maps showroom, dan kartu nama — biar satu etalase digital menjelaskan koleksi, harga, dan kontak 24 jam tanpa harus angkat telepon.</p>`,
  'website-jasa-fotografi': `
      <p>Fotografer UMKM biasanya mengandalkan Instagram untuk pamer hasil jepretan. Masalahnya, algoritma feed berubah-ubah, story hilang 24 jam, dan klien potensial tidak mudah balik ke postingan enam bulan lalu. Website jasa fotografi adalah etalase permanen: portofolio tersusun rapi, paket layanan jelas, tombol booking selalu ada — dan calon klien yang menemukan lewat Google Search datang dengan niat lebih kuat daripada yang sekadar scroll IG.</p>
      <h2>Elemen wajib website jasa fotografi</h2>
      <p>Klien fotografer mengevaluasi tiga hal dalam hitungan detik: gaya visual, konsistensi, dan apakah vibes mereka cocok. Website yang closing selalu punya blok berikut:</p>
      <ul>
        <li><strong>Hero foto terbaik</strong> — satu gambar penuh gaya yang sedang kamu jual (wedding, product, keluarga, food, fashion)</li>
        <li><strong>Galeri portofolio</strong> — minimal 6 sesi, dikelompokkan per kategori</li>
        <li><strong>Paket dan harga</strong> — 3 tingkatan (basic, standard, premium) dengan ekspektasi output dan durasi</li>
        <li><strong>Tentang fotografer</strong> — cerita singkat, gaya, kota domisili, bahasa yang dipakai klien</li>
        <li><strong>Testimoni klien</strong> — 3–5 kutipan dengan nama dan tanggal acara</li>
        <li><strong>FAQ</strong> — cara booking,DP, file delivery, revisi, pembatalan</li>
        <li><strong>Tombol WhatsApp floating</strong> — link ke nomor kamu dengan pesan otomatis</li>
      </ul>
      <p>Yang membedakan fotografer profesional dari yang hobi adalah konsistensi presentasi. Warna font, layout grid, dan cara foto dikurasi harus terasa satu bahasa visual. Klien wedding misalnya, mau fotografer yang vibe-nya "calm elegant", bukan yang tampil ramai dengan terlalu banyak font dan warna.</p>
      <h2>Contoh prompt KARSA untuk fotografer</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, lalu ketik prompt spesifik. Semakin lengkap konteks yang kamu berikan, semakin akurat hasilnya. Contoh untuk fotografer wedding di Yogyakarta:</p>
      <p><em>"Buat website jasa fotografi wedding untuk 'Sela &amp; Lensa' di Yogyakarta. Hero full-screen foto pasangan di sawah Magelang saat golden hour dengan headline 'Dokumentasi Wedding yang Tenang dan Natural'. Section Tentang: Sela, 8 tahun memotret wedding outdoor di Jawa dan Bali, gaya candid &amp; warm tone, bahasa klien Indonesia dan Inggris. Galeri 6 sesi: Intimate Garden Wedding Bali 2025, Traditional Javanese Wedding Solo 2025, Beach Sunset Wedding Lombok 2024, Modern Rooftop Wedding Jakarta 2024, Engagement Candid Bandung 2024, Prewedding Ubud 2024. Paket: Bronze Rp 4,5 juta (4 jam, 1 fotografer, 150 edited foto, gallery online 90 hari); Silver Rp 7,5 juta (8 jam, 1 fotografer + 1 videografer, 300 foto + 3 menit highlight, gallery 1 tahun); Gold Rp 14 juta (full day, 2 fotografer + videografer, album hardcover 30 halaman, gallery 2 tahun). Section testimoni 4 kutipan. FAQ 6: cara pesan (DP 30%), file delivery (Google Drive + gallery private), revisi (color grading 1x), pembatalan (DP hangus H-30), coverage area (Jawa &amp; Bali), turnaround (3 minggu). Floating WhatsApp ke 0812xxx dengan pesan otomatis 'Halo Sela, saya tertarik paket [Bronze/Silver/Gold] untuk wedding [tanggal]'. Footer link Instagram @sela.lensa. Warna cream, sage, hitam, font serif untuk headline dan sans-serif untuk body, mobile-first."</em></p>
      <p>Setelah preview muncul, iterasi per bagian dengan kalimat pendek: <em>"tambah section 'Jadwal Tersedia'"</em> atau <em>"buat galeri jadi lightbox saat diklik"</em>. Pola iterasi vibecoding ini berlaku juga untuk <a href="/artikel/landing-page-jasa-freelance">landing page jasa freelance</a> lain seperti desainer, ilustrator, atau videographer.</p>
      <h2>Tips portofolio yang membuat klien booking</h2>
      <ul>
        <li><strong>Kurasi 6–9 foto terbaik per sesi</strong> — lebih baik 6 foto bagus daripada 30 foto mediocare</li>
        <li><strong>Tampilkan konteks lokasi dan cerita</strong> — klien ingin merasakan vibe, bukan hanya komposisi</li>
        <li><strong>Tulis nama venue atau kota</strong> — SEO lokal membantu klien di kota yang sama menemukan kamu</li>
        <li><strong>Pakai foto konsisten warna</strong> — moodboard yang kohesi bikin portofolio terasa signature</li>
        <li><strong>Tambahkan loading cepat</strong> — galeri berat bikin bounce 60%. Kompres ke WebP,ukur PageSpeed</li>
        <li><strong>Tampilkan harga eksplisit</strong> — "mulai Rp 4,5 juta" lebih baik daripada "hubungi untuk harga"</li>
        <li><strong>Tulis proses booking 3 langkah</strong> — konsultasi, DP, pemotretan. Clarity = trust</li>
      </ul>
      <p>Untuk fotografer yang melayani klien korporat atau produk UMKM, tambahkan section "Klien" dengan logo brand yang pernah kamu tangani. Untuk wedding, tampilkan timeline hari H dan highlight candid yang emosional. Versi kedua setelah 60 hari biasanya konversi naik 2x lipat hanya karena menulis harga eksplisit, testimoni nyata, dan menambahkan FAQ.</p>
      <h2>Kesalahan umum website fotografer</h2>
      <ul>
        <li><strong>Galeri tanpa kategori</strong> — klien bingung lihat wedding diselingi foto produk. Kelompokkan sesi</li>
        <li><strong>Tidak ada harga</strong> — "tanyakan via chat" bikin calon klien pindah ke fotografer lain yang lebih jelas</li>
        <li><strong>Foto full auto-expose</strong> — foto terlalu terang atau gelap tanpa editing profesional menurunkan persepsi kualitas</li>
        <li><strong>Tombol WhatsApp tidak ada</strong> — portofolio tanpa CTA utama = etalase tanpa kasir</li>
        <li><strong>Desain terlalu rame</strong> — foto terbaik butuh whitespace. Hindari banner promo besar di atas galeri</li>
        <li><strong>Tidak SEO-friendly</strong> — page title dan meta description harus berisi kata kunci "fotografer [kota]" dan "jasa foto [kategori]"</li>
        <li><strong>Lupa mobile test</strong> — 80% calon klien buka dari HP. Versi desktop sempurna tapi mobile kacau = gagal</li>
      </ul>
      <p>Yang paling penting setelah publish adalah kecepatan memuat galeri. Foto full-res 5MB per gambar bikin bounce 70% di HP 4G. Pakai foto dikompres ke WebP, ukuran lebar 1200px cukup untuk layout grid, dan aktifkan lazy loading. Versi mobile-first wajib diuji di viewport 360px sebelum dianggap siap.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail portofolio dan paket kamu, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari cukup untuk eksplorasi. Bandingkan dengan <a href="/artikel/landing-page-jasa-freelance">panduan landing page jasa freelance</a> untuk portofolio non-fotografi, dan <a href="/artikel/vibecoding-untuk-umkm">vibecoding untuk UMKM</a> untuk konteks vibecoding. Setelah publish, link permanen bisa kamu tempel di bio Instagram, kartu nama, dan signature email — biar satu halaman menjelaskan gaya, harga, testimoni, dan cara booking 24 jam tanpa harus balas chat satu-satu.</p>`,
  'form-survey-pelanggan': `
      <p>UMKM sering menebak-nebak apa yang pelanggan rasakan: produk laku, tapi tidak tau kenapa pelanggan balik — atau kenapa berhenti setelah dua pesanan. Form survey pelanggan lewat WhatsApp mengubah tebakan jadi data: kepuasan, NPS, sampai masukan produk, masuk rapi dalam hitungan jam tanpa telepon satu-satu.</p>
      <h2>Kapan UMKM butuh form survey pelanggan</h2>
      <p>Survey bukan hanya untuk korporat besar. Begitu bisnis kamu punya lebih dari 50 pelanggan rutin, suara mereka sudah cukup beragam untuk menuntun keputusan produk. Situasi yang paling terasa:</p>
      <ul>
        <li><strong>Setelah pembelian pertama</strong> — cek apakah produk sesuai ekspektasi dan apa yang bisa diperbaiki</li>
        <li><strong>Setelah layanan selesai</strong> — salon, bengkel, jasa konsultan: tanyakan kepuasan di hari yang sama</li>
        <li><strong>Setelah 3–6 bulan</strong> — pelanggan lama: tanyakan apakah masih tertarik produk baru</li>
        <li><strong>Saat akan rilis menu atau koleksi</strong> — uji konsep sebelum produksi besar</li>
        <li><strong>Setelah ada komplain</strong> — pastikan masalah sudah selesai dan pelanggan merasa didengar</li>
      </ul>
      <p>Yang membuat survey UMKM sering gagal bukan tool-nya, tapi panjang dan tidak relevan. Form 20 pertanyaan membuat orang menutup sebelum selesai. Form 5 pertanyaan yang fokus biasanya punya completion rate 60–80% lewat WhatsApp.</p>
      <h2>Struktur form survey yang bikin orang mau isi</h2>
      <p>Survey yang dapat jawaban berkualitas selalu mengikuti pola tiga blok: konteks, pengukuran, dan ruang terbuka. Susun dalam urutan ini:</p>
      <ul>
        <li><strong>Pembuka singkat</strong> — siapa kamu, berapa lama waktu yang dibutuhkan (idealnya 60–90 detik), janji kerahasiaan</li>
        <li><strong>Skala kepuasan</strong> — 1 sampai 5 atau 1 sampai 10 (NPS). Tanyakan hal spesifik: kecepatan, rasa produk, keramahan, harga</li>
        <li><strong>Pilihan ganda tertutup</strong> — darimana tau produk, kategori produk yang sering dibeli, alasan berhenti membeli</li>
        <li><strong>Pertanyaan terbuka 1–2</strong> — "Apa yang paling kamu suka?" dan "Apa satu hal yang ingin kami perbaiki?"</li>
        <li><strong>Data responden (opsional)</strong> — nama, WhatsApp, kota, hanya jika pelanggan bersedia</li>
        <li><strong>Penutup dan ucapan terima kasih</strong> — kupon diskon kecil, undian, atau cukup terima kasih tulus</li>
      </ul>
      <p>Total 8–12 field adalah sweet spot untuk WhatsApp. Lebih dari itu, drop-off melonjak. Triknya adalah menyimpan pertanyaan lanjutan untuk iterasi berikutnya. Setelah dua bulan, kirim survey baru dengan fokus berbeda.</p>
      <h2>Contoh prompt KARSA untuk form survey pelanggan</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt berikut. Contoh untuk kedai kopi yang ingin tahu kepuasan pelanggan:</p>
      <p><em>"Buat form survey pelanggan untuk 'Kopi Tetangga Bandung'. Hero 'Bantu Kami Bikin Kopi Lebih Enak — Isi 60 Detik'. Pembuka: 'Kami Pah Rianto, owner Kopi Tetangga. Mohon 60 detik untuk isi survey ini, jawabanmu sangat menentukan menu baru kami'. Section Skala Kepuasan 5 pertanyaan (1–5): kecepatan penyajian, keramahan barista, rasa kopi, harga dibanding tempat lain, kenyamanan tempat. Section Pilihan Ganda 4 pertanyaan: darimana tau Kopi Tetangga (IG/TikTok/Google Maps/teman/lainnya), berapa sering datang (harian/mingguan/bulanan/jarang), menu favorit (es kopi susu/kopi hitam/manual brew/makanan/cemilan), alasan utama datang (rasa/harga/lokasi/wifi/kerja). Section Terbuka 2 pertanyaan textarea: 'Apa hal yang paling kamu suka?' dan 'Satu hal yang ingin kami perbaiki?'. Section Data Responden 4 field opsional (nama, WhatsApp, email, kota). Section Penutup: 'Terima kasih! Sebagai ucapan, tunjukkan screenshot ke kasir untuk gratis upgrade ke Large di kunjungan berikutnya'. Footer WhatsApp + IG. Warna krem, coklat, hijau tua, mobile-first, single page."</em></p>
      <p>Setelah preview muncul, iterasi per bagian: <em>"tambah checkbox 'Boleh hubungi saya untuk follow-up'"</em> atau <em>"ganti ucapan terima kasih jadi undian mingguan voucher Rp 50K"</em>. Pola vibecoding ini juga berlaku untuk <a href="/artikel/form-pendaftaran-seminar">form pendaftaran seminar</a> dan <a href="/artikel/form-booking-online-umkm">form booking UMKM</a>.</p>
      <h2>Tips survey yang dapat jawaban berkualitas</h2>
      <ul>
        <li><strong>Pertanyaan singkat dan spesifik</strong> — "Apakah kopi kami cukup enak?" lebih baik daripada "Bagaimana pendapatmu tentang keseluruhan pengalaman?"</li>
        <li><strong>Hindari pertanyaan majemuk</strong> — pisah jadi dua kalau membahas lebih dari satu hal</li>
        <li><strong>Gunakan skala genap (1–4 atau 1–10)</strong> — skala ganjil bikin responden memilih tengah. NPS wajib 0–10</li>
        <li><strong>Berikan insentif kecil</strong> — diskon 10%, free upgrade, atau undian. Response rate naik 2–3x</li>
        <li><strong>Kirim di waktu yang tepat</strong> — H+1 setelah transaksi untuk produk, hari yang sama untuk jasa</li>
        <li><strong>Personalisasi link</strong> — tambahkan nama pelanggan: "Halo Mbak Sari, boleh minta 60 detik?"</li>
        <li><strong>Mobile-first</strong> — 80% responden buka dari HP. Cek viewport 360px dan keyboard-friendly</li>
      </ul>
      <p>Setelah dapat 30–50 jawaban, hitung rata-rata skor dan kelompokkan komentar terbuka menjadi 3 tema. Itu cukup untuk memutuskan satu perbaikan nyata di bulan depan. Survey yang tidak berakhir di tindakan hanya membuang waktu pelanggan.</p>
      <h2>Kesalahan umum form survey UMKM</h2>
      <ul>
        <li><strong>Terlalu panjang</strong> — 20 pertanyaan membuat orang tutup sebelum selesai. Maksimal 12</li>
        <li><strong>Tanpa tujuan jelas</strong> — survey yang tidak menghasilkan keputusan hanya formality. Tentukan dulu "satu hal yang ingin diketahui"</li>
        <li><strong>Pertanyaan bias</strong> — "Apakah kopi kami luar biasa enak?" mengarah ke jawaban ya. Netralkan diksi</li>
        <li><strong>Tidak ada insentif</strong> — tanpa motivasi, response rate 5–10%. Tambah benefit kecil naik ke 30–50%</li>
        <li><strong>Kirim di waktu yang salah</strong> — subuh, tengah malam, atau terlalu lama setelah transaksi. Pilih H+1 atau H+2</li>
        <li><strong>Lupa follow-up</strong> — pelanggan yang sudah kasih waktu layak dapat balasan: "Terima kasih, kami akan perbaiki X"</li>
        <li><strong>Tidak mobile-friendly</strong> — keyboard pop-up menutupi field. Test di viewport kecil</li>
      </ul>
      <p>Yang paling penting setelah publish adalah konsistensi. Survey sekali jalan tidak cukup; tren kepuasan baru terlihat setelah 3–6 bulan berjalan. Buat versi ringkas (5 pertanyaan) untuk rutin, dan versi penuh (10–12) untuk momen khusus.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail kedai atau toko kamu, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari cukup untuk eksplorasi. Bandingkan dengan <a href="/artikel/vibecoding-untuk-umkm">panduan vibecoding UMKM</a> untuk konteks vibecoding, dan <a href="/artikel/form-booking-online-umkm">panduan form booking UMKM</a> untuk bedanya survey vs form booking. Setelah publish, kirim link lewat WhatsApp blast dan baca komentar terbuka tiap akhir pekan — biasanya di situ muncul satu ide produk yang tidak pernah kamu pikirkan sebelumnya.</p>`,
  'website-portfolio-mahasiswa': `
      <p>Mahasiswa Indonesia yang baru lulus sering kirim CV PDF panjang ke recruiter, lalu tidak pernah buka lagi. Recruiter HR Tech menerima ratusan lamaran seminggu; CV yang mereka ingat biasanya yang punya tautan ke portofolio online. Website portfolio mahasiswa adalah satu halaman berisi biodata, proyek, sertifikat, dan link magang — shareable lewat chat, mudah diingat, dan tetap hidup setelah kamu kirim email.</p>
      <p>Artikel ini membahas kapan portfolio online lebih penting dari CV, struktur halaman yang membuat recruiter berhenti scroll, dan cara bikin versi pertama dalam satu sore pakai KARSA tanpa harus jago HTML.</p>
      <h2>Kapan mahasiswa butuh website portfolio</h2>
      <p>Portfolio online terasa overkill untuk semester awal, tapi mulai relevan begitu kamu punya minimal tiga hal untuk ditunjukkan: proyek kuliah, sertifikat magang atau kursus, atau pengalaman organisasi dengan output terukur. Situasi paling terasa:</p>
      <ul>
        <li>Sedang apply magang di startup atau korporat — recruiter ingin bukti kerja, bukan transkrip</li>
        <li>Sudah lulus dan cari kerja pertama — banyak lowongan mensyaratkan "link portfolio" di formulir</li>
        <li>Ingin freelance sembari kuliah — klien butuh cara cepat menilai gaya dan kecepatan kerja kamu</li>
        <li>Membangun personal brand di LinkedIn atau Instagram — link di bio jadi etalase profesional</li>
        <li>Melamar beasiswa atau kompetisi — beberapa program minta portofolio online, bukan PDF</li>
      </ul>
      <p>Recruiter HR Tech di Indonesia menerima 200–500 CV per lowongan. CV PDF tanpa link portfolio biasanya masuk tumpukan "lihat nanti" dan jarang dibuka dua kali. Website portfolio dengan domain rapi dan tiga proyek unggulan akan selalu muncul di urutan atas kandidat yang mereka ingat namanya.</p>
      <h2>Struktur halaman portfolio yang bikin orang berhenti scroll</h2>
      <p>Halaman portfolio yang efektif selalu mengikuti pola empat blok: hero, bukti kerja, tentang, dan cara kontak. Susun dalam urutan ini:</p>
      <ul>
        <li>Hero singkat — nama, satu kalimat posisi (contoh: "Mahasiswa Informatika angkatan 2023, tertarik ke product design"), tombol Lihat Proyek dan Download CV</li>
        <li>Proyek unggulan 3–6 item — judul, deskripsi dua kalimat, peran, teknologi, link demo atau repo, screenshot kecil</li>
        <li>Sertifikat dan skill — pill atau baris pendek, tidak perlu diagram radar yang menyesatkan</li>
        <li>Pengalaman organisasi dan magang — nama tempat, periode, satu bullet kontribusi terukur</li>
        <li>Testimoni dosen atau atasan magang 1–2 kalimat dengan foto kecil</li>
        <li>Kontak — email, LinkedIn, GitHub, dan form singkat jika kamu ingin menerima brief langsung</li>
      </ul>
      <p>Panjang ideal adalah satu halaman scroll dengan navigasi anchor di atas. Recruiter menghabiskan rata-rata 30 detik di portofolio pertama. Kalau hero padat, proyek jelas, dan kontak mudah ditemukan, mereka akan bookmark dan balik lagi.</p>
      <h2>Contoh prompt KARSA untuk website portfolio</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt berikut. Contoh untuk mahasiswa Informatika semester 6 yang baru selesai magang di startup fintech:</p>
      <p><em>"Buat website portfolio untuk 'Aulia Rahmadhani, Mahasiswa Informatika Universitas Brawijaya angkatan 2022'. Hero dengan foto profil bundar, headline 'Product-minded informatics student, baru selesai magang di fintech', sub 'Tertarik pada riset pengguna dan desain antarmuka yang bisa dipakai oleh teman saya sendiri', dua tombol 'Lihat Proyek' dan 'Download CV PDF'. Section Proyek Unggulan 4 kartu: 'Riset Pengguna Aplikasi Banking UMKM' (magang, 3 bulan, hasil 12 insight prioritas), 'Website Komunitas Pencinta Tanaman Hias' (UKM, React + Tailwind, 1500 pengunjung pertama), 'Bot WhatsApp Stok Warung' (tugas akhir, Python + Flask), 'Katalog Donasi Buku Komunitas' (organisasi, dipakai 3 sekolah). Tiap kartu: judul, peran, teknologi sebagai pill, screenshot placeholder, tombol Demo dan Source. Section Skill sebagai pill baris: Figma, TypeScript, Python, SQL, user research, wireframing. Section Pengalaman 3 baris: 'Magang Product Research di FinTech XYZ' (Mar–Jun 2026), 'Bendahara UKM Coding' (2024–2025), 'Asisten Dosen Algoritma' (2023). Section Testimoni 2 kutip: 'Aulia paling teliti saat menghimpun insight dari 12 responden' — Bu Sari, Dosen; 'Ia eigen inisiatif saat membangun prototype bot' — Mas Doni, Supervisor Magang. Section Kontak dengan form nama, email, jenis kerja sama, pesan, dan link LinkedIn + GitHub + email langsung. Footer sederhana. Warna putih, aksen biru tua dan kuning lembut, font sans-serif, mobile-first, single page."</em></p>
      <p>Setelah preview muncul, iterasi per bagian: <em>"ganti foto placeholder jadi inisial AR dengan background gradien"</em> atau <em>"tambah section blog dengan dua tulisan pendek tentang riset"</em>. Pola vibecoding ini juga berlaku untuk <a href="/artikel/prototype-aplikasi-startup">prototype aplikasi startup</a> dan <a href="/artikel/landing-page-jasa-freelance">landing page jasa freelance</a>.</p>
      <h2>Tips portfolio yang dilirik recruiter</h2>
      <ul>
        <li>Tulis nama proyek dengan jelas — "Riset Pengguna Aplikasi Banking UMKM" lebih diingat daripada "Project 1"</li>
        <li>Satu kalimat outcome terukur — "12 insight prioritas" lebih kuat daripada "banyak insight"</li>
        <li>Tautkan ke demo yang bisa dibuka tanpa login — repo GitHub dengan README rapi lebih baik daripada folder Zip</li>
        <li>Pakai foto asli bukan avatar default — wajah asli membangun trust 3x lebih cepat</li>
        <li>Sertakan link LinkedIn dan GitHub — 70% recruiter Tech Indonesia cek keduanya</li>
        <li>Mobile-friendly wajib — banyak HR lihat portofolio dari HP saat perjalanan ke kantor</li>
      </ul>
      <p>Setelah publish, link permanen bisa kamu pasang di bio LinkedIn, bio Instagram, dan signature email kampus. Bonus: domain rapi dari KARSA bisa kamu pakai bertahun-tahun, sehingga saat sudah kerja dan cari pekerjaan berikutnya, halaman yang sama tinggal di-update — bukan mulai dari nol.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail nama, kampus, dan proyek kamu, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari cukup untuk eksplorasi. Bandingkan dengan <a href="/artikel/prototype-aplikasi-startup">panduan prototype aplikasi startup</a> untuk konteks founder muda, dan <a href="/artikel/landing-page-jasa-freelance">panduan landing page jasa freelance</a> untuk portofolio yang fokus ke klien. Setelah publish, kirim link ke dosen pembimbing dan tambahkan ke bio LinkedIn — recruiter akan menemukan kamu bahkan saat kamu tidak sedang melamar.</p>`,
  'website-cv-online': `
      <p>Recruiter HR Tech Indonesia menerima 200–500 lamaran per lowongan. CV PDF yang terlampir di email sering dibuka di ponsel, terpotong di preview Gmail, dan hilang di folder Unduhan. Website CV online memecahkan itu: satu halaman berisi biodata, pengalaman, skill, dan link apply — bisa dibuka satu klik dari LinkedIn, WhatsApp, atau bio Instagram.</p>
      <p>Artikel ini membahas kapan CV online lebih efektif dari CV PDF, struktur halaman yang membuat recruiter berhenti scroll, dan cara bikin versi pertama dalam satu sore pakai KARSA.</p>
      <h2>Kapan CV online lebih efektif dari PDF</h2>
      <p>CV PDF masih penting untuk attachment formal, tapi ada situasi di mana halaman CV online lebih unggul:</p>
      <ul>
        <li>Melamar lewat LinkedIn — kolom pesan cuma muat beberapa baris, link CV online lebih rapi</li>
        <li>Share lewat WhatsApp ke HR — link tampil utuh, PDF sering gagal buka di HP lawas</li>
        <li>Job fair dan career expo — QR code di name tag mengarah langsung ke CV interaktif</li>
        <li>Bio Instagram, TikTok, atau X untuk personal brand kreator dan freelancer</li>
        <li>Apply ke startup teknologi yang menilai inisiatif digital</li>
        <li>Sudah lulus 2–5 tahun dan aktif networking — halaman statis tetap hidup, PDF cepat basi</li>
      </ul>
      <p>Bedanya dengan <a href="/artikel/website-portfolio-mahasiswa">website portfolio mahasiswa</a>: portfolio menonjolkan karya, sedangkan CV online fokus ke kronologi karier dan pencapaian terukur. Keduanya saling melengkapi untuk konteks berbeda.</p>
      <h2>Struktur halaman CV online yang bikin recruiter berhenti scroll</h2>
      <p>Halaman CV online yang efektif selalu mengikuti pola lima blok. Recruiter menghabiskan rata-rata 30 detik di CV pertama; kalau lima blok ini jelas, mereka akan bookmark dan baca ulang:</p>
      <ul>
        <li>Hero ringkas — nama, satu kalimat posisi, tombol Download CV PDF dan Hubungi WhatsApp</li>
        <li>Ringkasan profesional 3–4 kalimat — spesialisasi dan pencapaian paling relevan</li>
        <li>Pengalaman kerja kronologis terbalik — posisi, perusahaan, periode, 2–3 bullet kontribusi terukur</li>
        <li>Pendidikan, sertifikat, dan skill — pill atau baris pendek, tidak perlu diagram radar</li>
        <li>Kontak dan CTA — email, LinkedIn, GitHub, dan form singkat untuk interview request</li>
      </ul>
      <p>Panjang ideal satu halaman scroll dengan navigasi anchor di atas. Freelancer bisa tambah section portofolio singkat; pelamar korporat tambah sertifikasi industri (PMP, AWS, dll.) di bawah pendidikan.</p>
      <h2>Contoh prompt KARSA untuk website CV online</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt berikut. Contoh untuk frontend developer 3 tahun yang baru resign dan cari kerja remote:</p>
      <p><em>"Buat website CV online untuk 'Rangga Pradana, Frontend Developer 3 tahun'. Hero dengan foto profil bundar inisial RP, headline 'Frontend Developer dengan spesialisasi Vue 3 dan TypeScript', sub 'Tiga tahun di produk B2B SaaS, terakhir memimpin migrasi Vue 2 ke Vue 3 di tim 5 orang', dua tombol 'Download CV PDF' dan 'Hubungi via WhatsApp'. Section Ringkasan 4 kalimat: siapa, spesialisasi, pencapaian kuantitatif, tujuan karier. Section Pengalaman kronologis terbalik 3 posisi: 'Senior Frontend Developer di PT Solusi Digital' (2024–2026, migrasi 80 komponen Vue 2 ke Vue 3 dalam 4 bulan, turunkan bug regression 35%), 'Frontend Developer di Startup EduTech' (2023–2024, pimpin redesign dashboard, naikkan completion rate 22%), 'Frontend Intern di Konsultan TI' (2022–2023, kontribusi 12 modul reusable). Tiap posisi: nama, periode, 3 bullet kontribusi. Section Pendidikan: 'S1 Teknik Informatika Universitas Indonesia, IPK 3.72, 2022'. Section Sertifikat 4 pill: Vue 3 Composition API, TypeScript Advanced, Figma Auto Layout, AWS Cloud Practitioner. Section Skill pisah dua kolom — Hard (Vue, TypeScript, Tailwind, Vite) dan Soft (komunikasi async, code review). Section Kontak dengan form nama, email, jenis kerja sama, pesan, dan link LinkedIn + GitHub + email. Footer sederhana. Warna putih, aksen biru navy dan oranye lembut, font sans-serif, mobile-first, single page."</em></p>
      <p>Setelah preview muncul, iterasi per bagian: <em>"ganti foto placeholder jadi monogram RP dengan gradien biru"</em>. Pola iterasi ini sama dengan <a href="/artikel/landing-page-jasa-freelance">landing page jasa freelance</a> — bedanya CV online fokus ke kredensial.</p>
      <h2>Tips CV online yang dilirik recruiter</h2>
      <ul>
        <li>Headline spesifik — "Frontend Developer 3 tahun spesialisasi Vue" lebih diingat daripada "Web Developer berpengalaman"</li>
        <li>Kontribusi dengan angka — "turunkan bug regression 35%" lebih kuat dari "memperbaiki bug"</li>
        <li>Nama perusahaan lengkap — singkatan internal tidak dikenali recruiter luar</li>
        <li>GitHub dan LinkedIn wajib terlihat — 70% recruiter Tech Indonesia cek keduanya</li>
        <li>Sertifikat sebagai pill dengan ikon platform (AWS, Coursera) — lebih profesional</li>
        <li>Mobile-friendly wajib — HR sering lihat CV dari HP di antara meeting</li>
        <li>Tracking link di bio — tahu berapa recruiter benar-benar buka halaman</li>
      </ul>
      <p>Setelah publish, link permanen bisa kamu pasang di bio LinkedIn, signature email, dan QR code name tag untuk job fair. Domain rapi dari KARSA bisa dipakai bertahun-tahun; saat sudah kerja dan promosi, halaman yang sama tinggal di-update, bukan dibuat ulang dari nol.</p>
      <h2>Cara publish dan promosikan CV online</h2>
      <p>Publish ke subdomain gratis {slug}.karsa.work cukup untuk mulai. Kalau sudah dapat pekerjaan tetap, pertimbangkan custom domain dengan nama pribadi — recruiter menilai lebih serius dan halamanmu muncul di hasil pencarian Google ketika mereka mengetik namamu. Detail langkah DNS ada di panduan <a href="/artikel/custom-domain-karsa">custom domain KARSA</a>, dan submit sitemap dibahas di panduan <a href="/artikel/daftar-google-search-console">daftar Google Search Console</a>.</p>
      <p>Setelah live, promosikan lewat tiga kanal: pesan LinkedIn ke recruiter dengan kalimat pembuka yang menyebut posisi spesifik, broadcast ke 10 teman terdekat minta mereka sebarkan ke koneksi HR, dan tambahkan ke signature Gmail. Jangan broadcast ke grup besar — terasa spam.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti detail nama, pengalaman, dan skill kamu, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari cukup untuk eksplorasi. Bandingkan dengan <a href="/artikel/website-portfolio-mahasiswa">panduan website portfolio mahasiswa</a> untuk konteks fresh graduate, dan <a href="/artikel/landing-page-jasa-freelance">landing page jasa freelance</a> untuk versi CV yang fokus ke klien. Setelah publish, kirim link ke tiga recruiter incar dan tambahkan ke bio LinkedIn.`,
  'landing-page-produk-herbal': `      <p>Penjual jamu, kapsul, dan skincare herbal Indonesia biasanya mengandalkan testimoni dari chat WhatsApp. Pelanggan pertama senang, kirim testimoni panjang, lalu hilang di antara ratusan pesan. Pembeli kedua ragu karena tidak ada bukti visual rapi, lalu batal checkout. <strong>Landing page produk herbal</strong> yang mobile-friendly memecahkan itu: satu halaman berisi benefit, komposisi, nomor BPOM, testimoni dengan foto, dan tombol pesan — bisa dibuka dari bio Instagram, story, atau status WhatsApp kapan saja.</p>
      <p>Landing page produk herbal harus menjawab lima keraguan utama pembeli dalam 30 detik pertama: apa produknya, siapa yang cocok, aman atau tidak, sudah dipakai siapa, dan bagaimana cara pesan. Artikel ini membahas struktur yang menjawab kelima keraguan itu, contoh prompt KARSA bahasa Indonesia, dan tips yang sering diabaikan UMKM herbal pemula.</p>
      <h2>Kapan UMKM herbal butuh landing page</h2>
      <p>Tidak semua produk herbal butuh landing page. Katalog multi-produk cocok untuk etalase besar di marketplace, tapi landing page khusus sangat membantu saat satu produk sedang jadi fokus promo:</p>
      <ul>
        <li><strong>Produk andalan baru</strong> — jamu kunyit asam, kapsul temulawak, minuman herbal siap saji</li>
        <li><strong>Skincare herbal lini tunggal</strong> — serum, sabun serai, masker kefir, lotion daun mint</li>
        <li><strong>Peluncuran varian baru</strong> — rasa baru, kemasan baru, atau upgrade formula</li>
        <li><strong>Pre-order batch terbatas</strong> — stok produk herbal sering tergantung musim panen</li>
        <li><strong>Kerja sama reseller</strong> — landing page terpisah jadi materi promosi rapi untuk calon agen</li>
      </ul>
      <h2>Elemen wajib di landing page produk herbal</h2>
      <p>Pembeli produk herbal lebih hati-hati dari pembeli fashion. Mereka cek komposisi, legalitas, dan testimoni sebelum checkout. Landing page yang convert di atas 3% selalu punya tujuh blok:</p>
      <ul>
        <li><strong>Hero dengan klaim utama</strong> — headline singkat, sub-benefit, dan foto produk close-up</li>
        <li><strong>Komposisi dan cara kerja</strong> — daftar bahan, takaran, penjelasan sederhana, sertakan logo organik, halal, atau BPOM bila ada</li>
        <li><strong>Nomor izin BPOM dan Halal</strong> — wajib terlihat di atas lipatan, trust booster terbesar</li>
        <li><strong>Benefit terstruktur</strong> — 4–6 poin dengan ikon, singkat dan jelas</li>
        <li><strong>Testimoni dengan foto</strong> — 3–5 testimoni, sertakan nama, usia, dan keluhan awal</li>
        <li><strong>Cara pakai dan dosis</strong> — kapan diminum, berapa kali sehari, catatan khusus</li>
        <li><strong>Form order atau tombol WhatsApp</strong> — form singkat 4–5 field, atau tombol langsung chat</li>
      </ul>
      <p>Yang sering dilupakan adalah blok FAQ. Produk herbal memicu pertanyaan berulang: amankah untuk asam lambung, boleh untuk anak, efek samping, kapan hasil terasa. FAQ 5–7 pertanyaan kurangi beban chat sampai 40%.</p>
      <h2>Contoh prompt KARSA untuk landing page produk herbal</h2>
      <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt berikut. Contoh untuk kapsul herbal daya tahan tubuh UMKM Bandung:</p>
      <p><em>"Buat landing page single product kapsul herbal 'Sehat Akar Imun+', UMKM Bandung. Hero headline 'Imunitas Harian dari 7 Akar Nusantara', sub 'Kapsul 500mg, 60 kapsul, diminum 2x sehari'. Badge BPOM TRxxxxxxxxx dan Halal MUI di hero. Komposisi 7 bahan: jahe merah, temulawak, kunyit, serai, daun mint, kayu manis, meniran. 5 Benefit dengan ikon: naikkan imun, redakan masuk angin, bantu tidur, jaga stamina, redakan kembung. Aturan Pakai: 2 kapsul pagi, 1 malam, sesudah makan. Jangan diminum ibu hamil dan anak di bawah 12. Testimoni 4 orang: Bu Tini 52 tahun Jakarta, Pak Hendro 47 tahun Surabaya, Mbak Ratna 35 tahun Bandung, Mas Yoga 29 tahun Yogya — tiap ada nama, usia, kota, bintang 5. Harga 3 tier: 1 Botol Rp 145K, Bundle 3 Botol Rp 395K, Bundle 6 Botol Rp 749K free ongkir. FAQ 6: berapa lama hasil terasa (2 minggu rutin), efek samping (jarang), izin BPOM (ada, tertera), alergi (tanpa pengawet), ongkir (Rp 12K), garansi (uang kembali kalau segel rusak). Form Order 5 field: nama, WhatsApp, alamat singkat, pilih paket, jumlah. Submit kirim ke WhatsApp 0812xxx. Warna krem, hijau daun, aksen emas, mobile-first."</em></p>
      <p>Setelah preview muncul, minta iterasi: <em>"tambah warning box kuning untuk peringatan ibu hamil dan anak"</em>. Pola vibecoding ini juga berlaku untuk <a href="/artikel/katalog-produk-online-umkm">katalog produk online UMKM</a> dan <a href="/artikel/landing-page-produk-digital">landing page produk digital</a>.</p>
      <h2>Tips landing page produk herbal yang convert</h2>
      <ul>
        <li><strong>Klaim sesuai izin BPOM</strong> — jangan klaim "menyembuhkan" jika izin hanya "membantu menjaga daya tahan tubuh"</li>
        <li><strong>Foto testimoni nyata</strong> — pembeli produk herbal curiga pada testimoni tanpa foto, minta izin pelanggan atau buat video 15 detik</li>
        <li><strong>Tampilkan nomor izin</strong> — BPOM TR atau MD wajib terlihat tanpa scroll</li>
        <li><strong>Harga tanpa ongkir mengecewakan</strong> — tulis ongkir eksplisit atau tawarkan free ongkir di atas Rp 300K</li>
        <li><strong>Bundle hemat jelas</strong> — tampilkan harga satuan dan per kapsul. Herbal sering dibeli 1–3 bulan, bundle jadi penentu</li>
        <li><strong>Mobile preview wajib</strong> — 75% traffic dari Instagram dan TikTok mobile, cek viewport 360px sebelum publish</li>
      </ul>
      <h2>Kesalahan umum landing page produk herbal UMKM</h2>
      <ul>
        <li><strong>Klaim berlebihan</strong> — "menyembuhkan diabetes" tanpa bukti klinis, BPOM bisa cabut izin</li>
        <li><strong>Testimoni tanpa konteks</strong> — testimoni "mantap" tanpa nama dan foto tidak dipercaya, pembeli herbal cek detail kecil</li>
        <li><strong>Tanpa komposisi jelas</strong> — formulasi proprietary sah, tapi tampilkan bahan utama</li>
        <li><strong>Foto produk asal-asalan</strong> — foto blur di kamar mandi turunkan persepsi kualitas, minimal foto di meja kayu dengan cahaya alami</li>
        <li><strong>Form terlalu panjang</strong> — alamat lengkap plus kode pos plus patokan terlalu berat</li>
      </ul>
      <p>Versi kedua biasanya naik konversi 30–50% setelah kamu mendengar 10 chat pertama. Catat pertanyaan berulang dan tambahkan ke FAQ.</p>
      <h2>Mulai sekarang</h2>
      <p>Buka <a href="/app">KARSA</a>, salin prompt, ganti detail produk dan nomor BPOM, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari cukup untuk eksplorasi. Bandingkan dengan <a href="/artikel/katalog-produk-online-umkm">panduan katalog produk online UMKM</a> untuk etalase multi-produk, dan <a href="/artikel/landing-page-produk-digital">panduan landing page produk digital</a> untuk ebook atau membership. Setelah publish, tempel link di bio Instagram dan story — biar satu halaman menjelaskan produk, legalitas, testimoni, dan cara pesan dalam 30 detik.</p>
      `,
        'landing-page-kopi-spesialti': `
            <p>Penjual kopi spesialti Indonesia sering mengandalkan postingan Instagram satu-satu: foto cangkir, V60, atau roasted beans. Hasilnya lumayan untuk sekali viral, tapi calon pelanggan baru sulit balik ke feed lama, dan ragu checkout karena tidak ada cerita lengkap soal origin, proses sangrai, dan cara seduh. <strong>Landing page kopi spesialti</strong> yang mobile-friendly memecahkan itu: satu halaman berisi hero aroma, profil origin, catatan rasa, roast level, harga, dan tombol pesan — bisa dibuka dari bio Instagram, story, atau broadcast WhatsApp kapan saja.</p>
                  <p>Artikel ini membahas struktur yang menjawab enam pertanyaan calon pembeli dalam 30 detik pertama, contoh prompt KARSA bahasa Indonesia, dan tips yang membedakan halaman kopi spesialti dari sekadar katalog online.</p>
            <h2>Kapan UMKM kopi butuh landing page</h2>
            <p>Tidak semua produk kopi butuh landing page. Toko grosir multi-origin cocok untuk katalog besar di marketplace, sedangkan landing page khusus sangat membantu saat satu kopi sedang jadi fokus promo:</p>
                  <ul>
                    <li><strong>Single origin musiman</strong> — panen Gayo, Toraja, Mandheling, Java, atau Flores</li>
                    <li><strong>Produk andalan roaster kecil</strong> — espresso blend rumah, cold brew botol, signature drip</li>
                    <li><strong>Peluncuran metode baru</strong> — edisi anaerobic natural, washed honey, experimental fermentasi</li>
                    <li><strong>Workshop atau cupping session</strong> — landing page terpisah untuk materi pendaftaran</li>
                  </ul>
            <p>Bedanya dengan <a href="/artikel/katalog-produk-online-umkm">katalog produk online UMKM</a>: katalog menonjolkan banyak SKU dalam satu etalase grid, sedangkan landing page kopi spesialti fokus menceritakan satu kopi dalam satu halaman. Cerita yang dalam membuat orang klik tombol pesan.</p>
            <h2>Elemen wajib di landing page kopi spesialti</h2>
            <p>Pembeli kopi spesialti membaca lebih teliti daripada pembeli fashion. Landing page yang menutup transaksi di hari yang sama selalu punya tujuh blok:</p>
                  <ul>
                    <li><strong>Hero aroma</strong> — headline singkat, foto close-up biji atau cangkir, satu tombol pesan WhatsApp</li>
                    <li><strong>Profil singkat petani dan origin</strong> — nama petani, ketinggian, varietas, proses, cerita manusiawi</li>
                    <li><strong>Catatan rasa dan roast level</strong> — 3–5 flavour notes, skala light-medium-dark, dan tanggal roast</li>
                    <li><strong>Rekomendasi seduh</strong> — V60, French press, espresso, dengan takaran sederhana</li>
                    <li><strong>Detail harga dan ukuran</strong> — 250g, 500g, 1kg, harga jelas, ongkir jujur</li>
                    <li><strong>Testimoni dan rating</strong> — 3–5 testimoni pelanggan dengan nama dan kota</li>
                    <li><strong>Tombol pesan berulang</strong> — CTA yang jelas, termasuk info langganan mingguan atau batch berikutnya</li>
                  </ul>
            <p>Tujuh blok ini menjawab enam pertanyaan calon pembeli sekaligus. Kopi specialty justru lebih dipercaya kalau tampilannya sederhana dan copy-nya spesifik, bukan template marketplace.</p>
            <h2>Contoh prompt KARSA untuk landing page kopi spesialti</h2>
            <p>Buka <a href="/app">KARSA</a>, buat proyek web baru, ketik prompt berikut. Contoh untuk roaster kecil Bandung yang baru rilis single origin Toraja Sapan:</p>
            <p><em>"Buat landing page single product kopi Toraja Sapan edisi terbatas. Hero dengan foto close-up biji, headline 'Toraja Sapan — Cokelat, Blueberry, dan Akhir yang Bersih', sub '200kg dari petani Pak Duma, proses washed, roast light-medium tanggal 25 Agustus 2026'. Tombol 'Pesan 250g — Rp 145K' warna oranye gelap di atas lipatan. Section Profil Petani: foto placeholder portrait, nama Pak Duma, desa Sapan Minahasa, ketinggian 1650 mdpl, varietas Typica dan Bourbon, proses washed. Section Catatan Rasa: 4 pill — Cokelat 80%, Blueberry 70%, Caramel 65%, Tea-like Finish 60%. Section Roast: 'Light-medium, paling enak di 7–21 hari setelah roast date'. Section Rekomendasi Seduh: V60 15g kopi 220ml air 92°C 2.30 menit, French Press 30g kopi 350ml air 93°C 4 menit, Espresso 18g in 36g out 28 detik. Section Harga 3 tier: 250g Rp 145K, 500g Rp 275K (hemat 15K), 1kg Rp 525K (free ongkir Jabodetabek). Testimoni 4: Aulia 28 tahun Jakarta 'akhirnya ada Toraja yang bersih dan fruity', Rio 33 tahun Bandung 'akhir semana balik lagi', Sasa 31 tahun Surabaya 'bisa untuk V60 maupun espresso', Pak Yanto 45 tahun Denpasar 'pelanggan kafe saya selalu pesan ini'. Footer alamat workshop Bandung, jam buka, dan link Instagram. Warna krem, cokelat tua, aksen oranye, font serif modern, mobile-first."</em></p>
            <p>Setelah preview muncul, iterasi per bagian: <em>"tambah section FAQ dengan 5 pertanyaan: kapan roast berikutnya, ongkir ke mana saja, apakah bisa subscription, refund policy, dan apakah ada edisi lain"</em>. Cara iterasi seperti ini juga berlaku untuk <a href="/artikel/prompt-landing-page-konversi">prompt landing page konversi</a> pada umumnya.</p>
            <h2>Tips landing page kopi spesialti yang membuat orang repeat order</h2>
            <ul>
              <li><strong>Ceritakan petani dengan nama</strong> — 'Pak Duma di Toraja' lebih diingat daripada 'petani lokal Indonesia'</li>
              <li><strong>Tanggal roast jelas terlihat</strong> — kopi spesialti paling enak 7–21 hari setelah roast, tulis tanggal bukan hanya bulan</li>
              <li><strong>Catatan rasa dalam persentase</strong> — pembeli kopi pemula lebih mudah membandingkan antar-edisi</li>
              <li><strong>Tombol langganan mingguan</strong> — 70% repeat order berasal dari pelanggan langganan, bukan pembeli dadakan</li>
              <li><strong>Batch berikutnya jelas</strong> — tulis 'Batch 7: roast 22 September' agar pelanggan tahu kapan harus balik</li>
            </ul>
            <h2>Kesalahan umum landing page kopi spesialti UMKM</h2>
            <ul>
              <li><strong>Foto asal-asalan</strong> — foto blur di atas meja kayu dengan cahaya flash membuat origin bagus kelihatan murahan</li>
              <li><strong>Catatan rasa terlalu puitis</strong> — 'nikmatnya menyentuh jiwa' tidak membantu pembeli pilih. Pakai flavour notes konkret</li>
              <li><strong>Tanpa tanggal roast</strong> — kopi bulan lalu terasa beda dari kopi minggu ini. Tulis tanggal, bukan bulan</li>
              <li><strong>CTA lemah</strong> — 'Klik di sini' tidak cukup. Pakai 'Pesan 250g — Rp 145K, Roast 25 Agustus' dengan tombol kontras</li>
            </ul>
            <p>Versi kedua biasanya naik konversi 20–40% setelah kamu mendengar 10 chat pertama. Catat pertanyaan berulang dan tambahkan ke FAQ — kopi spesialti punya pelanggan yang sangat teknis dan menghargai transparansi.</p>
                  <h2>Mulai sekarang</h2>
                  <p>Buka <a href="/app">KARSA</a>, salin prompt di atas, ganti nama petani dan origin, lihat preview dalam satu menit. Paket gratis 30 prompt AI per hari cukup untuk eksplorasi. Bandingkan dengan <a href="/artikel/landing-page-preorder">panduan landing page preorder</a> untuk strategi batch terbatas, dan <a href="/artikel/vibecoding-untuk-umkm">panduan vibecoding untuk UMKM</a>. Setelah publish, tempel link di bio Instagram dan story.</p>
      `,
      };
