/* ===== KARSA — Suara ke teks (Web Speech API, id-ID) ===== */

const Voice = (() => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  let activeBtn = null;
  let activeTarget = null;
  let baseText = '';

  function supported() { return !!SR; }

  function stop() {
    if (rec) { try { rec.stop(); } catch (e) { /* abaikan */ } }
  }

  function cleanup() {
    if (activeBtn) activeBtn.classList.remove('recording');
    activeBtn = null;
    activeTarget = null;
    rec = null;
  }

  function start(btn, target) {
    if (!supported()) { showToast('Browser ini belum mendukung input suara. Coba Chrome.', 'warn'); return; }
    if (rec) { stop(); return; } // toggle off

    rec = new SR();
    rec.lang = 'id-ID';
    rec.interimResults = true;
    rec.continuous = false;
    activeBtn = btn;
    activeTarget = target;
    baseText = target.value ? target.value.replace(/\s*$/, '') + ' ' : '';

    btn.classList.add('recording');

    rec.onresult = (e) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      activeTarget.value = baseText + transcript;
      activeTarget.dispatchEvent(new Event('input', { bubbles: true }));
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        showToast('Izin mikrofon ditolak. Aktifkan di pengaturan browser.', 'error');
      } else if (e.error !== 'aborted' && e.error !== 'no-speech') {
        showToast('Input suara gagal: ' + e.error, 'error');
      }
    };
    rec.onend = () => { cleanup(); };

    try { rec.start(); showToast('🎙️ Bicara sekarang… (klik mic lagi untuk berhenti)', 'info'); }
    catch (err) { cleanup(); }
  }

  // Pasang tombol mic untuk sebuah textarea/input
  function attach(btn, target) {
    if (!btn || !target) return;
    if (!supported()) { btn.classList.add('hidden'); return; }
    btn.addEventListener('click', (e) => { e.preventDefault(); start(btn, target); });
  }

  return { supported, attach, stop };
})();
