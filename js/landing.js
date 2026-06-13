document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.lp-nav');
  const menuBtn = document.querySelector('.lp-menu-btn');
  const onScroll = () => nav?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  menuBtn?.addEventListener('click', () => nav?.classList.toggle('is-open'));

  document.querySelectorAll('.lp-faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.lp-faq-item');
      const open = item?.classList.contains('is-open');
      document.querySelectorAll('.lp-faq-item').forEach((el) => el.classList.remove('is-open'));
      if (!open) item?.classList.add('is-open');
    });
  });

  fetch('/api/config')
    .then((r) => r.json())
    .then((cfg) => {
      const priceEl = document.getElementById('lp-pro-price');
      const ctaEl = document.getElementById('lp-pro-cta');
      if (!priceEl || !ctaEl) return;

      const freeDaily = cfg.freeAiDaily || 30;
      document.querySelectorAll('.lp-hero-meta strong').forEach((el, i) => {
        if (i === 0) el.textContent = String(freeDaily);
      });
      const gratisList = document.querySelector('.lp-price-card:not(.featured) .lp-price-list');
      if (gratisList && gratisList.children[0]) {
        gratisList.children[0].textContent = freeDaily + ' prompt AI per hari';
      }

      if (cfg.billingEnabled && cfg.lemonCheckoutBase) {
        priceEl.innerHTML = 'Pro <span>/ bulan</span>';
        ctaEl.textContent = 'Berlangganan Pro';
        ctaEl.href = cfg.lemonCheckoutBase;
        ctaEl.target = '_blank';
        ctaEl.rel = 'noopener';
      } else if (cfg.proAvailable) {
        priceEl.innerHTML = 'Aktif <span>/ kode</span>';
        ctaEl.textContent = 'Aktifkan di app';
        ctaEl.href = '/app';
      }
    })
    .catch(() => { /* pakai default statis */ });
});
