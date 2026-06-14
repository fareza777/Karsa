/* ===== KARSA — utilitas umum ===== */

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      if (key === 'class') node.className = attrs[key];
      else if (key === 'text') node.textContent = attrs[key];
      else if (key === 'html') node.innerHTML = attrs[key];
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), attrs[key]);
      else if (key === 'disabled' || key === 'checked' || key === 'selected' || key === 'readonly') {
        node[key] = !!attrs[key];
      } else node.setAttribute(key, attrs[key]);
    });
  }
  (children || []).forEach((child) => { if (child) node.appendChild(child); });
  return node;
}

function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function debounce(fn, wait) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return minutes + ' menit lalu';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + ' jam lalu';
  const days = Math.floor(hours / 24);
  if (days < 30) return days + ' hari lalu';
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fileExt(path) {
  const name = path.split('/').pop();
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
}

const FILE_ICONS = {
  html: '🟧', htm: '🟧',
  css: '🟦',
  js: '🟨', mjs: '🟨',
  json: '🟩',
  md: '📝',
  txt: '📄',
  svg: '🎨',
};

function fileIcon(path) {
  return FILE_ICONS[fileExt(path)] || '📄';
}

// Badge tipe file berwarna per bahasa (rasa IDE sungguhan)
const FILE_TYPES = {
  html: { c: '#e34f26', l: '<>' }, htm: { c: '#e34f26', l: '<>' },
  css: { c: '#2965f1', l: 'css' }, scss: { c: '#cf649a', l: 'sc' },
  js: { c: '#f0db4f', l: 'js' }, mjs: { c: '#f0db4f', l: 'js' }, cjs: { c: '#f0db4f', l: 'js' },
  jsx: { c: '#61dafb', l: 'jsx' },
  ts: { c: '#3178c6', l: 'ts' }, tsx: { c: '#3178c6', l: 'tsx' },
  json: { c: '#10b981', l: '{}' },
  md: { c: '#94a3b8', l: 'md' },
  svg: { c: '#a855f7', l: 'svg' },
  png: { c: '#ec4899', l: 'img' }, jpg: { c: '#ec4899', l: 'img' }, jpeg: { c: '#ec4899', l: 'img' }, gif: { c: '#ec4899', l: 'img' }, webp: { c: '#ec4899', l: 'img' },
  txt: { c: '#94a3b8', l: 'txt' }, xml: { c: '#f59e0b', l: 'xml' }, csv: { c: '#22c55e', l: 'csv' },
};

function fileTypeInfo(path) {
  return FILE_TYPES[fileExt(path)] || { c: '#8b94a7', l: '•' };
}

// Node badge file. Dipakai di file-tree, tab editor, kartu kode AI.
function fileBadge(path) {
  const t = fileTypeInfo(path);
  return el('span', { class: 'file-badge', style: '--fc:' + t.c, text: t.l });
}

function baseName(path) {
  return path.split('/').pop();
}

// Validasi nama file/folder: huruf, angka, titik, strip, underscore, spasi; segmen dipisah '/'
function isValidPath(path) {
  if (!path || path.startsWith('/') || path.endsWith('/')) return false;
  const base = path.split('/').pop() || '';
  if (/^(tsx?|jsx?|json|html|css|md|txt)$/i.test(base)) return false;
  if (!base.includes('.')) return false;
  return path.split('/').every((seg) => /^[\w.\- ]+$/.test(seg) && seg !== '.' && seg !== '..');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = el('a', { href: url, download: filename });
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Palet warna ikon proyek/template
const ICON_COLORS = [
  'linear-gradient(135deg,#7c5cff,#22d3ee)',
  'linear-gradient(135deg,#f43f5e,#fb923c)',
  'linear-gradient(135deg,#34d399,#22d3ee)',
  'linear-gradient(135deg,#f59e0b,#f43f5e)',
  'linear-gradient(135deg,#6366f1,#a855f7)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
];

// Base64-url aman unicode (untuk tautan berbagi proyek)
function encodeBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(encoded) {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// Ikon SVG dari sprite #i-* di index.html. Nama valid → node svg; selain itu null.
const ICON_NAMES = new Set([
  'spark', 'sun', 'moon', 'play', 'monitor', 'tablet', 'phone', 'external',
  'history', 'link', 'rocket', 'store', 'download', 'folder', 'folder-open',
  'folder-plus', 'file-plus', 'trash', 'settings', 'sparkles', 'zap', 'bulb',
  'paperclip', 'stop', 'wand', 'keyboard', 'terminal', 'globe', 'camera',
  'scissors', 'maximize', 'refresh', 'pencil', 'copy', 'plus', 'send',
]);

function iconSvg(name) {
  if (!ICON_NAMES.has(name)) return null;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#i-' + name);
  svg.appendChild(use);
  return svg;
}

function colorForId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return ICON_COLORS[hash % ICON_COLORS.length];
}
