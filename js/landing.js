/* ===== KARSA Landing — nav, FAQ, demo replay, pricing ===== */

(function () {
  const DEMO_STEPS = [
    {
      title: 'Tulis ide',
      caption: 'Ceritakan warung atau bisnis dalam bahasa Indonesia',
      build: buildScenePrompt,
    },
    {
      title: 'AI bikin kode',
      caption: 'Kode HTML & CSS dihasilkan otomatis',
      build: buildSceneCode,
    },
    {
      title: 'Preview langsung',
      caption: 'Hasil tampil real-time di panel kanan',
      build: buildScenePreview,
    },
    {
      title: 'Publish',
      caption: 'Situs live di subdomain karsa.work',
      build: buildScenePublish,
    },
  ];

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach((c) => {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function sidePanel() {
    return el('div', { class: 'lp-scene-side' }, [
      el('div', { class: 'lp-scene-line accent' }),
      el('div', { class: 'lp-scene-line w70' }),
      el('div', { class: 'lp-scene-line w50' }),
      el('div', { class: 'lp-scene-line w70' }),
    ]);
  }

  function buildScenePrompt() {
    const scene = el('div', { class: 'lp-scene' });
    scene.appendChild(sidePanel());
    const ai = el('div', { class: 'lp-scene-ai' });
    ai.appendChild(el('div', { class: 'lp-scene-bubble user', text: 'Bikin landing page warung kopi kekinian, ada menu & lokasi maps' }));
    ai.appendChild(el('div', { class: 'lp-scene-bubble ai', text: 'Siap! Saya buatkan hero, menu grid, dan footer kontak…' }));
    ai.appendChild(el('div', { class: 'lp-scene-typing' }, [
      el('span'), el('span'), el('span'),
    ]));
    scene.appendChild(ai);
    const prev = el('div', { class: 'lp-scene-preview' });
    prev.appendChild(el('div', { class: 'lp-mock-app' }, [
      el('div', { class: 'lp-mock-app-head', text: 'Kopi Nusantara' }),
      el('div', { class: 'lp-mock-app-body' }, [
        el('div', { style: 'height:6px;width:70%;border-radius:4px;background:rgba(255,255,255,.08)' }),
        el('div', { style: 'height:6px;width:50%;border-radius:4px;background:rgba(255,255,255,.05);margin-top:6px' }),
      ]),
    ]));
    scene.appendChild(prev);
    return scene;
  }

  function buildSceneCode() {
    const scene = el('div', { class: 'lp-scene' });
    scene.appendChild(sidePanel());
    const editor = el('div', { class: 'lp-scene-editor' });
    editor.innerHTML = '<span class="cm">&lt;!-- KARSA AI --&gt;</span><br>'
      + '<span class="kw">&lt;header</span> <span class="str">class="hero"</span><span class="kw">&gt;</span><br>'
      + '&nbsp;&nbsp;<span class="kw">&lt;h1&gt;</span>Kopi Nusantara<span class="kw">&lt;/h1&gt;</span><br>'
      + '&nbsp;&nbsp;<span class="kw">&lt;p&gt;</span>Barista lokal, rasa autentik<span class="kw">&lt;/p&gt;</span><br>'
      + '<span class="kw">&lt;/header&gt;</span>';
    scene.appendChild(editor);
    const prev = el('div', { class: 'lp-scene-preview' });
    prev.appendChild(el('div', { class: 'lp-mock-app' }, [
      el('div', { class: 'lp-mock-app-head', text: 'Kopi Nusantara' }),
      el('div', { class: 'lp-mock-app-body' }, [
        el('p', { style: 'font-size:.65rem;color:var(--lp-muted)', text: 'Barista lokal, rasa autentik' }),
        el('div', { class: 'lp-mock-stat' }, [
          el('span', { text: 'Menu hari ini' }),
          el('strong', { text: '12 item' }),
        ]),
      ]),
    ]));
    scene.appendChild(prev);
    return scene;
  }

  function buildScenePreview() {
    const scene = el('div', { class: 'lp-scene' });
    scene.appendChild(sidePanel());
    scene.appendChild(el('div', { class: 'lp-scene-editor' }, [
      el('span', { class: 'cm', text: '/* preview sync */' }),
    ]));
    const prev = el('div', { class: 'lp-scene-preview' });
    prev.appendChild(el('div', { class: 'lp-mock-app' }, [
      el('div', { class: 'lp-mock-app-head', text: '☕ Kopi Nusantara' }),
      el('div', { class: 'lp-mock-app-body' }, [
        el('div', { class: 'lp-mock-stat' }, [
          el('span', { text: 'Espresso' }),
          el('strong', { text: 'Rp 18K' }),
        ]),
        el('div', { class: 'lp-mock-stat' }, [
          el('span', { text: 'Latte' }),
          el('strong', { text: 'Rp 28K' }),
        ]),
        el('div', { class: 'lp-mock-stat' }, [
          el('span', { text: 'Total order' }),
          el('strong', { text: 'Rp 156K' }),
        ]),
      ]),
    ]));
    scene.appendChild(prev);
    return scene;
  }

  function buildScenePublish() {
    const scene = el('div', { class: 'lp-scene' });
    scene.appendChild(sidePanel());
    scene.appendChild(el('div', { class: 'lp-scene-ai' }, [
      el('div', { class: 'lp-scene-bubble ai', text: '🚀 Publish ke karsa.work…' }),
    ]));
    const prev = el('div', { class: 'lp-scene-preview' });
    prev.appendChild(el('div', { class: 'lp-mock-publish' }, [
      el('div', { class: 'lp-mock-publish-icon', text: '🚀' }),
      el('div', { style: 'font-size:.8rem;font-weight:600', text: 'Situs kamu sudah live!' }),
      el('div', { class: 'lp-mock-url', text: 'kopinusantara.karsa.work' }),
    ]));
    scene.appendChild(prev);
    return scene;
  }

  function DemoPlayer(stageId, captionId, onStep) {
    let index = 0;
    let timer = null;
    const stage = document.getElementById(stageId);
    const caption = document.getElementById(captionId);
    const scenes = DEMO_STEPS.map((s) => s.build());

    function show(i) {
      if (!stage) return;
      index = ((i % scenes.length) + scenes.length) % scenes.length;
      stage.innerHTML = '';
      const scene = scenes[index];
      scene.classList.add('active');
      stage.appendChild(scene);
      const step = DEMO_STEPS[index];
      if (caption) {
        caption.innerHTML = '<strong>' + step.title + '</strong> — ' + step.caption;
      }
      if (onStep) onStep(index);
    }

    function start(interval) {
      show(0);
      if (timer) clearInterval(timer);
      timer = setInterval(() => show(index + 1), interval || 4500);
    }

    function goTo(i) {
      show(i);
    }

    function stop() {
      if (timer) clearInterval(timer);
    }

    return { start, goTo, stop, getIndex: () => index };
  }

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

    const stepCards = document.querySelectorAll('.lp-demo-step-card');
    const dotsRoot = document.getElementById('lp-demo-dots');
    const dots = [];

    function setActiveStep(i) {
      stepCards.forEach((card, j) => card.classList.toggle('active', j === i));
      dots.forEach((dot, j) => dot.classList.toggle('active', j === i));
    }

    if (dotsRoot) {
      DEMO_STEPS.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'lp-demo-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Langkah ' + (i + 1));
        dot.addEventListener('click', () => {
          cinema.goTo(i);
          hero.goTo(i);
        });
        dotsRoot.appendChild(dot);
        dots.push(dot);
      });
    }

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        const i = parseInt(card.dataset.step, 10);
        if (!Number.isNaN(i)) {
          cinema.goTo(i);
          hero.goTo(i);
        }
      });
    });

    const hero = DemoPlayer('lp-hero-demo', 'lp-hero-caption', setActiveStep);
    const cinema = DemoPlayer('lp-cinema-demo', 'lp-cinema-caption', setActiveStep);

    hero.start(5000);
    cinema.start(5000);

    const demoSection = document.getElementById('demo');
    if (demoSection && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) cinema.start(4500);
          else cinema.stop();
        });
      }, { threshold: 0.25 });
      obs.observe(demoSection);
    }

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
      .catch(() => { /* default statis */ });
  });
})();
