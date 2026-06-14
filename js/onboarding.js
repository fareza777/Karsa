/* ===== KARSA — Onboarding tour (coachmark, sekali untuk pengguna baru) ===== */

const Onboarding = (() => {
  const KEY = 'karsa.onboarded.v1';

  const STEPS = [
    {
      sel: '#hero-prompt-input',
      title: '1. Mulai dari satu kalimat ✨',
      body: 'Ceritakan aplikasi impianmu di sini — KARSA AI langsung membangunnya jadi kode yang berjalan.',
    },
    {
      sel: '#template-strip .template-card',
      title: '2. Atau pilih template 🧩',
      body: 'Punya 10 template siap pakai — landing page, kasir UMKM, game, sampai mobile. Klik untuk mulai.',
    },
    {
      sel: '#btn-import-project',
      title: '3. Bawa proyekmu 📂',
      body: 'Sudah punya kode? Impor folder atau file JSON. Semua tersimpan aman di browsermu.',
    },
  ];

  let idx = 0;
  let overlay = null;
  let spot = null;
  let tip = null;

  function done() {
    try { localStorage.setItem(KEY, '1'); } catch (e) { /* abaikan */ }
    if (overlay) { overlay.remove(); overlay = null; }
    window.removeEventListener('resize', position);
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); done(); }
  }

  function position() {
    const step = STEPS[idx];
    const target = step && document.querySelector(step.sel);
    if (!target) { next(); return; }
    const r = target.getBoundingClientRect();
    const pad = 8;
    spot.style.left = (r.left - pad) + 'px';
    spot.style.top = (r.top - pad) + 'px';
    spot.style.width = (r.width + pad * 2) + 'px';
    spot.style.height = (r.height + pad * 2) + 'px';

    tip.querySelector('.ob-title').textContent = step.title;
    tip.querySelector('.ob-body').textContent = step.body;
    tip.querySelector('.ob-count').textContent = (idx + 1) + ' / ' + STEPS.length;

    // Tempatkan tooltip di bawah target bila muat, jika tidak di atas;
    // lalu jepit agar SELALU di dalam layar (tombol tak pernah ketutup).
    const th = tip.offsetHeight || 180;
    const tw = 300;
    let top = (r.bottom + th + 24 < window.innerHeight) ? r.bottom + 14 : r.top - th - 14;
    top = Math.max(12, Math.min(window.innerHeight - th - 12, top));
    const left = Math.max(12, Math.min(window.innerWidth - tw - 12, r.left));
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function next() {
    idx++;
    if (idx >= STEPS.length) { done(); showToast('Selamat berkarya di KARSA! 🚀', 'ok'); return; }
    position();
  }

  function build() {
    spot = el('div', { class: 'ob-spot' });
    tip = el('div', { class: 'ob-tip' }, [
      el('button', { class: 'ob-close', text: '✕', title: 'Tutup', onclick: done }),
      el('span', { class: 'ob-count' }),
      el('h4', { class: 'ob-title' }),
      el('p', { class: 'ob-body' }),
      el('div', { class: 'ob-actions' }, [
        el('button', { class: 'ob-skip', text: 'Lewati', onclick: done }),
        el('button', { class: 'ob-next btn btn-primary btn-sm', text: 'Lanjut →', onclick: next }),
      ]),
    ]);
    // Klik area gelap (di luar tooltip) menutup tur — anti-stuck.
    overlay = el('div', { class: 'ob-overlay', onclick: done }, [spot, tip]);
    tip.addEventListener('click', (e) => e.stopPropagation());
    document.body.appendChild(overlay);
    window.addEventListener('resize', position);
    document.addEventListener('keydown', onKey);
    position();
  }

  function maybeStart() {
    try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }
    // Hanya untuk pengguna benar-benar baru: belum punya proyek sama sekali
    if (typeof State !== 'undefined' && State.getProjects && State.getProjects().length > 0) {
      try { localStorage.setItem(KEY, '1'); } catch (e) { /* abaikan */ }
      return;
    }
    // Hanya di dashboard, dan saat elemen sudah ada
    if ($('#view-dashboard').classList.contains('hidden')) return;
    if (!document.querySelector('#hero-prompt-input')) return;
    setTimeout(build, 700);
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* abaikan */ }
    idx = 0;
    if (overlay) overlay.remove();
    maybeStart();
  }

  return { maybeStart, reset };
})();

document.addEventListener('DOMContentLoaded', () => setTimeout(() => Onboarding.maybeStart(), 400));
