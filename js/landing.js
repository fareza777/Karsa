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
});
