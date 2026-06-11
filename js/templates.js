/* ===== KARSA — template proyek bawaan ===== */

const TEMPLATES = [
  {
    id: 'blank',
    name: 'Kosong',
    desc: 'Mulai dari nol: HTML, CSS, dan JS polos.',
    icon: '📄',
    color: 'linear-gradient(135deg,#64748b,#94a3b8)',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aplikasi Baru</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <h1>Halo, dunia! 👋</h1>
  <p>Mulai tulis kodemu di sini.</p>
  <script src="js/app.js"></script>
</body>
</html>
`,
      'css/style.css': `body {
  font-family: system-ui, sans-serif;
  display: grid;
  place-content: center;
  min-height: 100vh;
  text-align: center;
  background: #f8fafc;
  color: #1e293b;
}
`,
      'js/app.js': `console.log('Aplikasi berjalan! 🚀');
`,
    },
  },

  {
    id: 'landing',
    name: 'Landing Page',
    desc: 'Halaman promosi modern dengan hero & fitur.',
    icon: '🚀',
    color: 'linear-gradient(135deg,#7c5cff,#22d3ee)',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lumo — Produktivitas Tanpa Batas</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav>
    <span class="logo">✨ Lumo</span>
    <a href="#fitur" class="btn-nav">Fitur</a>
  </nav>
  <header class="hero">
    <h1>Kerja Lebih Cerdas,<br>Bukan Lebih Keras.</h1>
    <p>Lumo membantumu mengatur tugas, fokus, dan menyelesaikan lebih banyak hal setiap hari.</p>
    <button class="btn-cta" onclick="daftar()">Coba Gratis Sekarang</button>
  </header>
  <section id="fitur" class="features">
    <div class="card"><span>⚡</span><h3>Super Cepat</h3><p>Antarmuka ringan yang langsung responsif.</p></div>
    <div class="card"><span>🎯</span><h3>Tetap Fokus</h3><p>Mode fokus memblokir semua gangguan.</p></div>
    <div class="card"><span>📊</span><h3>Lacak Progres</h3><p>Statistik harian yang memotivasi.</p></div>
  </section>
  <footer>Dibuat dengan ❤️ menggunakan KARSA</footer>
  <script src="js/app.js"></script>
</body>
</html>
`,
      'css/style.css': `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; background: #0b0e1a; color: #eef0ff; }
nav { display: flex; justify-content: space-between; align-items: center; padding: 18px 32px; }
.logo { font-weight: 800; font-size: 18px; }
.btn-nav { color: #a5b4fc; text-decoration: none; font-weight: 600; }
.hero { text-align: center; padding: 90px 20px 70px; }
.hero h1 {
  font-size: clamp(32px, 6vw, 56px);
  background: linear-gradient(135deg, #a78bfa, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 18px;
}
.hero p { color: #9aa3c0; max-width: 440px; margin: 0 auto 30px; font-size: 17px; }
.btn-cta {
  background: linear-gradient(135deg, #7c5cff, #22d3ee);
  color: #fff; border: none; padding: 15px 34px;
  border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer;
  transition: transform .2s;
}
.btn-cta:hover { transform: scale(1.05); }
.features {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px; padding: 20px 32px 70px; max-width: 900px; margin: 0 auto;
}
.card {
  background: #141832; border: 1px solid #252b52;
  border-radius: 16px; padding: 26px; text-align: center;
}
.card span { font-size: 32px; }
.card h3 { margin: 12px 0 6px; }
.card p { color: #9aa3c0; font-size: 14px; }
footer { text-align: center; color: #5b6285; padding: 24px; font-size: 13px; }
`,
      'js/app.js': `function daftar() {
  alert('Terima kasih sudah mendaftar! 🎉');
  console.log('Tombol CTA diklik');
}
`,
    },
  },

  {
    id: 'todo',
    name: 'Aplikasi Todo',
    desc: 'Daftar tugas interaktif dengan penyimpanan lokal.',
    icon: '✅',
    color: 'linear-gradient(135deg,#34d399,#22d3ee)',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tugasku</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main class="app">
    <h1>📝 Tugasku</h1>
    <form id="form">
      <input id="input" type="text" placeholder="Mau ngerjain apa?" autocomplete="off">
      <button type="submit">＋</button>
    </form>
    <ul id="list"></ul>
    <p id="stats"></p>
  </main>
  <script src="js/app.js"></script>
</body>
</html>
`,
      'css/style.css': `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: system-ui, sans-serif;
  background: linear-gradient(160deg, #ecfdf5, #e0f2fe);
  min-height: 100vh; display: flex; justify-content: center; padding-top: 60px;
}
.app { width: min(440px, 92vw); }
h1 { text-align: center; color: #065f46; margin-bottom: 22px; }
form { display: flex; gap: 8px; margin-bottom: 18px; }
input {
  flex: 1; padding: 13px 16px; border: 2px solid #a7f3d0;
  border-radius: 12px; font-size: 15px; outline: none;
}
input:focus { border-color: #10b981; }
form button {
  width: 48px; border: none; border-radius: 12px;
  background: #10b981; color: #fff; font-size: 22px; cursor: pointer;
}
ul { list-style: none; }
li {
  display: flex; align-items: center; gap: 10px;
  background: #fff; padding: 13px 15px; border-radius: 12px;
  margin-bottom: 8px; box-shadow: 0 2px 8px rgba(6, 95, 70, .08);
}
li.done span { text-decoration: line-through; opacity: .45; }
li span { flex: 1; }
li button { border: none; background: none; cursor: pointer; font-size: 15px; }
#stats { text-align: center; color: #047857; font-size: 13px; margin-top: 14px; }
`,
      'js/app.js': `let tugas = JSON.parse(localStorage.getItem('tugasku') || '[]');

const form = document.getElementById('form');
const input = document.getElementById('input');
const list = document.getElementById('list');
const stats = document.getElementById('stats');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const teks = input.value.trim();
  if (!teks) return;
  tugas.push({ teks: teks, selesai: false });
  input.value = '';
  simpanDanRender();
});

function toggle(i) {
  tugas[i].selesai = !tugas[i].selesai;
  simpanDanRender();
}

function hapus(i) {
  tugas.splice(i, 1);
  simpanDanRender();
}

function simpanDanRender() {
  localStorage.setItem('tugasku', JSON.stringify(tugas));
  render();
}

function render() {
  list.innerHTML = '';
  tugas.forEach((t, i) => {
    const li = document.createElement('li');
    if (t.selesai) li.className = 'done';

    const cek = document.createElement('input');
    cek.type = 'checkbox';
    cek.checked = t.selesai;
    cek.onchange = () => toggle(i);

    const span = document.createElement('span');
    span.textContent = t.teks;

    const del = document.createElement('button');
    del.textContent = '🗑️';
    del.onclick = () => hapus(i);

    li.append(cek, span, del);
    list.appendChild(li);
  });
  const selesai = tugas.filter((t) => t.selesai).length;
  stats.textContent = tugas.length
    ? selesai + ' dari ' + tugas.length + ' tugas selesai'
    : 'Belum ada tugas. Yuk mulai! 💪';
}

render();
`,
    },
  },

  {
    id: 'calculator',
    name: 'Kalkulator',
    desc: 'Kalkulator cantik dengan papan tombol lengkap.',
    icon: '🧮',
    color: 'linear-gradient(135deg,#f59e0b,#f43f5e)',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kalkulator</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="calc">
    <div id="display">0</div>
    <div class="keys">
      <button class="fn" data-act="clear">C</button>
      <button class="fn" data-act="back">⌫</button>
      <button class="fn" data-key="%">%</button>
      <button class="op" data-key="/">÷</button>
      <button data-key="7">7</button>
      <button data-key="8">8</button>
      <button data-key="9">9</button>
      <button class="op" data-key="*">×</button>
      <button data-key="4">4</button>
      <button data-key="5">5</button>
      <button data-key="6">6</button>
      <button class="op" data-key="-">−</button>
      <button data-key="1">1</button>
      <button data-key="2">2</button>
      <button data-key="3">3</button>
      <button class="op" data-key="+">＋</button>
      <button class="zero" data-key="0">0</button>
      <button data-key=".">.</button>
      <button class="eq" data-act="eq">=</button>
    </div>
  </div>
  <script src="js/app.js"></script>
</body>
</html>
`,
      'css/style.css': `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: system-ui, sans-serif;
  background: #18181b; min-height: 100vh;
  display: grid; place-content: center;
}
.calc {
  background: #27272a; border-radius: 24px; padding: 22px;
  width: 300px; box-shadow: 0 20px 60px rgba(0,0,0,.5);
}
#display {
  color: #fff; font-size: 40px; text-align: right;
  padding: 18px 8px; min-height: 80px;
  overflow: hidden; text-overflow: ellipsis;
}
.keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.keys button {
  height: 58px; border: none; border-radius: 16px;
  background: #3f3f46; color: #fff; font-size: 20px; cursor: pointer;
  transition: filter .1s, transform .1s;
}
.keys button:hover { filter: brightness(1.2); }
.keys button:active { transform: scale(.94); }
.fn { background: #52525b !important; }
.op { background: #f59e0b !important; }
.eq { background: linear-gradient(135deg, #f59e0b, #f43f5e) !important; }
.zero { grid-column: span 2; }
`,
      'js/app.js': `const display = document.getElementById('display');
let expr = '';

document.querySelectorAll('.keys button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.key;
    const act = btn.dataset.act;
    if (act === 'clear') expr = '';
    else if (act === 'back') expr = expr.slice(0, -1);
    else if (act === 'eq') hitung();
    else expr += key;
    tampil();
  });
});

function hitung() {
  if (!expr) return;
  // Hanya izinkan karakter aman sebelum evaluasi
  if (!/^[\d+\-*/.% ()]+$/.test(expr)) { expr = ''; return; }
  try {
    const hasil = Function('"use strict"; return (' + expr.replace(/%/g, '/100') + ')')();
    expr = String(Math.round(hasil * 1e10) / 1e10);
    console.log('Hasil:', expr);
  } catch (e) {
    expr = '';
    display.textContent = 'Error';
    return;
  }
}

function tampil() {
  display.textContent = expr || '0';
}
`,
    },
  },

  {
    id: 'snake',
    name: 'Game Ular',
    desc: 'Game ular klasik dengan skor & canvas.',
    icon: '🐍',
    color: 'linear-gradient(135deg,#6366f1,#a855f7)',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Ular</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <h1>🐍 Game Ular</h1>
  <p class="skor">Skor: <span id="skor">0</span> · Tertinggi: <span id="tertinggi">0</span></p>
  <canvas id="game" width="320" height="320"></canvas>
  <p class="hint">Gunakan tombol panah ← ↑ → ↓ untuk bergerak. Klik canvas untuk mulai ulang.</p>
  <script src="js/app.js"></script>
</body>
</html>
`,
      'css/style.css': `body {
  font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0;
  display: flex; flex-direction: column; align-items: center;
  min-height: 100vh; margin: 0; padding-top: 30px;
}
h1 { margin: 0 0 6px; }
.skor { color: #a5b4fc; margin: 0 0 14px; }
canvas {
  background: #1e293b; border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,.4);
}
.hint { color: #64748b; font-size: 13px; }
`,
      'js/app.js': `const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const GRID = 16;
const SEL = canvas.width / GRID;

let ular, arah, makanan, skor, jalan, gameOver;
let tertinggi = Number(localStorage.getItem('ular.tertinggi') || 0);
document.getElementById('tertinggi').textContent = tertinggi;

function mulai() {
  ular = [{ x: 8, y: 8 }];
  arah = { x: 1, y: 0 };
  skor = 0;
  gameOver = false;
  taruhMakanan();
  document.getElementById('skor').textContent = '0';
}

function taruhMakanan() {
  do {
    makanan = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (ular.some((s) => s.x === makanan.x && s.y === makanan.y));
}

function update() {
  if (gameOver) return;
  const kepala = { x: ular[0].x + arah.x, y: ular[0].y + arah.y };
  if (
    kepala.x < 0 || kepala.x >= GRID || kepala.y < 0 || kepala.y >= GRID ||
    ular.some((s) => s.x === kepala.x && s.y === kepala.y)
  ) {
    gameOver = true;
    if (skor > tertinggi) {
      tertinggi = skor;
      localStorage.setItem('ular.tertinggi', tertinggi);
      document.getElementById('tertinggi').textContent = tertinggi;
    }
    return;
  }
  ular.unshift(kepala);
  if (kepala.x === makanan.x && kepala.y === makanan.y) {
    skor += 10;
    document.getElementById('skor').textContent = skor;
    taruhMakanan();
  } else {
    ular.pop();
  }
}

function gambar() {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(makanan.x * SEL + SEL / 2, makanan.y * SEL + SEL / 2, SEL / 2.6, 0, 7);
  ctx.fill();
  ular.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? '#a5b4fc' : '#6366f1';
    ctx.fillRect(s.x * SEL + 1, s.y * SEL + 1, SEL - 2, SEL - 2);
  });
  if (gameOver) {
    ctx.fillStyle = 'rgba(15, 23, 42, .75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over! 💀', canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = '14px system-ui';
    ctx.fillText('Klik untuk main lagi', canvas.width / 2, canvas.height / 2 + 18);
  }
}

document.addEventListener('keydown', (e) => {
  const peta = {
    ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  };
  const baru = peta[e.key];
  if (baru && !(baru.x === -arah.x && baru.y === -arah.y)) {
    arah = baru;
    e.preventDefault();
  }
});

canvas.addEventListener('click', () => { if (gameOver) mulai(); });

mulai();
setInterval(() => { update(); gambar(); }, 110);
`,
    },
  },

  {
    id: 'quiz',
    name: 'Aplikasi Kuis',
    desc: 'Kuis pilihan ganda dengan skor & progres.',
    icon: '🧠',
    color: 'linear-gradient(135deg,#06b6d4,#3b82f6)',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kuis Seru</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main class="quiz">
    <div class="progress"><div id="bar"></div></div>
    <div id="kotak">
      <h2 id="soal">Memuat...</h2>
      <div id="pilihan"></div>
    </div>
  </main>
  <script src="js/app.js"></script>
</body>
</html>
`,
      'css/style.css': `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: system-ui, sans-serif;
  background: linear-gradient(150deg, #0c4a6e, #1e3a8a);
  min-height: 100vh; display: grid; place-content: center; padding: 20px;
}
.quiz { width: min(480px, 92vw); }
.progress {
  height: 8px; background: rgba(255,255,255,.15);
  border-radius: 99px; margin-bottom: 22px; overflow: hidden;
}
#bar {
  height: 100%; width: 0; border-radius: 99px;
  background: linear-gradient(90deg, #22d3ee, #818cf8);
  transition: width .35s ease;
}
#kotak {
  background: #fff; border-radius: 20px; padding: 30px;
  box-shadow: 0 24px 60px rgba(0,0,0,.35);
}
h2 { color: #0f172a; margin-bottom: 20px; font-size: 20px; }
#pilihan button {
  display: block; width: 100%; text-align: left;
  padding: 14px 18px; margin-bottom: 10px;
  border: 2px solid #e2e8f0; border-radius: 12px;
  background: #f8fafc; font-size: 15px; cursor: pointer;
  transition: border-color .15s, background .15s;
}
#pilihan button:hover { border-color: #38bdf8; }
#pilihan button.benar { border-color: #10b981; background: #d1fae5; }
#pilihan button.salah { border-color: #f43f5e; background: #ffe4e6; }
`,
      'js/app.js': `const SOAL = [
  { t: 'Apa kepanjangan dari HTML?', p: ['HyperText Markup Language', 'High Tech Modern Language', 'Hyperlink Text Mode Layer', 'Home Tool Markup List'], b: 0 },
  { t: 'Tag untuk membuat tautan adalah...', p: ['<link>', '<a>', '<href>', '<url>'], b: 1 },
  { t: 'CSS digunakan untuk...', p: ['Logika aplikasi', 'Struktur halaman', 'Tampilan & gaya', 'Database'], b: 2 },
  { t: 'console.log() berfungsi untuk...', p: ['Menyimpan data', 'Mencetak ke console', 'Membuat loop', 'Mengirim email'], b: 1 },
  { t: 'Simbol komentar satu baris di JavaScript?', p: ['<!-- -->', '##', '//', '/* hanya ini */'], b: 2 },
];

let nomor = 0;
let skor = 0;
let terkunci = false;

const elSoal = document.getElementById('soal');
const elPilihan = document.getElementById('pilihan');
const elBar = document.getElementById('bar');

function tampilkan() {
  terkunci = false;
  const s = SOAL[nomor];
  elSoal.textContent = (nomor + 1) + '. ' + s.t;
  elBar.style.width = (nomor / SOAL.length) * 100 + '%';
  elPilihan.innerHTML = '';
  s.p.forEach((teks, i) => {
    const btn = document.createElement('button');
    btn.textContent = teks;
    btn.onclick = () => jawab(btn, i);
    elPilihan.appendChild(btn);
  });
}

function jawab(btn, i) {
  if (terkunci) return;
  terkunci = true;
  const benar = SOAL[nomor].b;
  if (i === benar) {
    btn.classList.add('benar');
    skor++;
  } else {
    btn.classList.add('salah');
    elPilihan.children[benar].classList.add('benar');
  }
  setTimeout(() => {
    nomor++;
    if (nomor < SOAL.length) tampilkan();
    else selesai();
  }, 900);
}

function selesai() {
  elBar.style.width = '100%';
  elSoal.textContent = '🎉 Selesai! Skormu: ' + skor + ' / ' + SOAL.length;
  elPilihan.innerHTML = '';
  const btn = document.createElement('button');
  btn.textContent = '🔄 Main Lagi';
  btn.onclick = () => { nomor = 0; skor = 0; tampilkan(); };
  elPilihan.appendChild(btn);
  console.log('Kuis selesai dengan skor', skor);
}

tampilkan();
`,
    },
  },
];

function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
