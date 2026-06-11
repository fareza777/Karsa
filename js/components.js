/* ===== KARSA — komponen UI: toast, modal, menu konteks ===== */

function showToast(message, type) {
  const root = $('#toast-root');
  const icons = { ok: '✅', error: '⚠️', warn: '💡', info: '✨' };
  const toast = el('div', { class: 'toast toast-' + (type || 'info') }, [
    el('span', { text: icons[type] || icons.info }),
    el('span', { text: message }),
  ]);
  root.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function closeModal() {
  const overlay = $('.modal-overlay');
  if (overlay) overlay.remove();
}

// Modal generik. options: { title, wide, body: Node, actions: [{label, primary, danger, onClick}] }
function showModal(options) {
  closeModal();
  const actions = (options.actions || []).map((action) =>
    el('button', {
      class: 'btn ' + (action.primary ? 'btn-primary' : action.danger ? 'btn-danger' : 'btn-ghost'),
      text: action.label,
      onclick: () => {
        const keepOpen = action.onClick && action.onClick();
        if (keepOpen !== true) closeModal();
      },
    })
  );

  const modal = el('div', { class: 'modal' + (options.wide ? ' modal-wide' : '') }, [
    el('div', { class: 'modal-head' }, [
      el('span', { class: 'modal-title', text: options.title }),
      el('button', { class: 'icon-btn', text: '✕', onclick: closeModal }),
    ]),
    el('div', { class: 'modal-body' }, [options.body]),
    actions.length ? el('div', { class: 'modal-foot' }, actions) : null,
  ]);

  const overlay = el('div', { class: 'modal-overlay' }, [modal]);
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) closeModal(); });
  $('#modal-root').appendChild(overlay);
  const firstInput = $('input', modal);
  if (firstInput) firstInput.focus();
  return overlay;
}

// Dialog input teks. Mengembalikan via callback onSubmit(value) → return string error utk gagal validasi.
function promptDialog(title, options) {
  const input = el('input', { type: 'text', value: options.value || '', placeholder: options.placeholder || '' });
  const errorMsg = el('div', { class: 'field-error' });
  const submit = () => {
    const error = options.onSubmit(input.value.trim());
    if (error) {
      errorMsg.textContent = error;
      return true; // biarkan modal tetap terbuka
    }
  };
  const body = el('div', {}, [
    el('div', { class: 'field' }, [
      el('label', { text: options.label || '' }),
      input,
      errorMsg,
    ]),
  ]);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { if (submit() !== true) closeModal(); }
  });
  showModal({
    title,
    body,
    actions: [
      { label: 'Batal' },
      { label: options.submitLabel || 'Simpan', primary: true, onClick: submit },
    ],
  });
  input.select();
}

function confirmDialog(title, message, onConfirm) {
  showModal({
    title,
    body: el('p', { class: 'modal-desc', text: message }),
    actions: [
      { label: 'Batal' },
      { label: 'Hapus', danger: true, onClick: onConfirm },
    ],
  });
}

// Menu konteks. items: [{label, icon, danger, onClick} | 'sep']
function showContextMenu(x, y, items) {
  const menu = $('#context-menu');
  menu.innerHTML = '';
  items.forEach((item) => {
    if (item === 'sep') {
      menu.appendChild(el('div', { class: 'context-menu-sep' }));
      return;
    }
    menu.appendChild(el('button', {
      class: 'context-menu-item' + (item.danger ? ' danger' : ''),
      onclick: () => { hideContextMenu(); item.onClick(); },
    }, [
      el('span', { text: item.icon || '' }),
      el('span', { text: item.label }),
    ]));
  });
  menu.classList.remove('hidden');
  const rect = menu.getBoundingClientRect();
  menu.style.left = Math.min(x, window.innerWidth - rect.width - 8) + 'px';
  menu.style.top = Math.min(y, window.innerHeight - rect.height - 8) + 'px';
}

function hideContextMenu() {
  $('#context-menu').classList.add('hidden');
}

document.addEventListener('mousedown', (e) => {
  if (!$('#context-menu').contains(e.target)) hideContextMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { hideContextMenu(); closeModal(); }
});
