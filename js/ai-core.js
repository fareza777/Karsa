/* ===== KARSA AI — engine inti (logika murni, tanpa DOM) =====
   Dipakai oleh js/ai.js di browser (global KarsaAICore) DAN oleh unit test di
   Node (module.exports). Semua fungsi di sini murni: tak menyentuh DOM, State,
   atau jaringan — supaya bisa diuji & tak gampang regresi. */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  // eslint-disable-next-line no-param-reassign
  root.KarsaAICore = mod;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // --- Util kecil (salinan privat agar tak bentrok dengan utils.js global) ---
  function fileExt(path) {
    const name = String(path).split('/').pop();
    const dot = name.lastIndexOf('.');
    return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
  }

  function isValidPath(path) {
    if (!path || path.startsWith('/') || path.endsWith('/')) return false;
    const base = path.split('/').pop() || '';
    if (/^(tsx?|jsx?|json|html|css|md|txt)$/i.test(base)) return false;
    if (!base.includes('.')) return false;
    return path.split('/').every((seg) => /^[\w.\- ]+$/.test(seg) && seg !== '.' && seg !== '..');
  }

  // Kurung {} () [] seimbang, mengabaikan string & komentar.
  function braceBalance(code) {
    let b = 0; let p = 0; let br = 0; let q = null;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (q) {
        if (ch === '\\') { i++; continue; }
        if (ch === q) q = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') { q = ch; continue; }
      if (ch === '/' && code[i + 1] === '/') { while (i < code.length && code[i] !== '\n') i++; continue; }
      if (ch === '/' && code[i + 1] === '*') {
        i += 2;
        while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++;
        i++;
        continue;
      }
      if (ch === '{') b++;
      else if (ch === '}') b--;
      else if (ch === '(') p++;
      else if (ch === ')') p--;
      else if (ch === '[') br++;
      else if (ch === ']') br--;
    }
    return b === 0 && p === 0 && br === 0;
  }

  function isFileComplete(code, path) {
    const c = (code || '').trim();
    if (c.length < 4) return false;
    const ext = fileExt(path);
    if (ext === 'html') {
      if (c.length > 250) {
        const tail = c.slice(-120);
        if (!/<\/(html|body)>/i.test(tail)) return false;
      }
      const scripts = (c.match(/<script\b/gi) || []).length;
      const scriptClose = (c.match(/<\/script>/gi) || []).length;
      if (scripts > scriptClose) return false;
    }
    if (ext === 'css') return braceBalance(c);
    if (ext === 'js' || ext === 'ts' || ext === 'jsx' || ext === 'tsx') {
      if (/\[\.\.\.\]|BUKAN kode asli|penanda dipotong|← ini/i.test(c)) return false;
      if (!braceBalance(c)) return false;
      if (/const\s+\w+\s*=\s*\[\s*$/.test(c)) return false;
      if (/[{(,=]\s*$/.test(c)) return false;
      if ((ext === 'tsx' || ext === 'jsx' || ext === 'ts') && !/export\s+default\b/.test(c)) return false;
      // #A10 Cek sintaks nyata utk JS polos (bukan modul/JSX): tangkap kode
      // brace-seimbang tapi rusak (mis. terpotong di tengah ekspresi). Di-guard
      // dari import/export/await yang sah tapi melempar di dalam new Function().
      if ((ext === 'js' || ext === 'mjs' || ext === 'cjs')
        && !/\b(import|export)\b/.test(c) && !/(^|[^.\w])await\b/.test(c)) {
        try { new Function(c); } catch (e) { if (e instanceof SyntaxError) return false; }
      }
    }
    if (ext === 'json') {
      try { JSON.parse(c); } catch (e) { return false; }
    }
    return true;
  }

  function hasUnclosedCodeFence(text) {
    return (((text || '').match(/```/g) || []).length % 2) !== 0;
  }

  // #A3 Estimasi token kasar (≈3.6 char/token; kode lebih padat dari prosa).
  // Untuk budgeting/peringatan — bukan tokenizer presisi.
  function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(String(text).length / 3.6);
  }

  // Total estimasi token untuk array pesan {role, content:string|parts[]}.
  function estimateMessagesTokens(msgs) {
    if (!Array.isArray(msgs)) return 0;
    let n = 0;
    for (const m of msgs) {
      const c = m && m.content;
      if (typeof c === 'string') n += estimateTokens(c);
      else if (Array.isArray(c)) {
        for (const part of c) {
          if (part && part.type === 'text' && typeof part.text === 'string') n += estimateTokens(part.text);
          else if (part && part.type === 'image_url') n += 800; // perkiraan kasar token gambar
        }
      }
      n += 4; // overhead per pesan
    }
    return n;
  }

  function extractProse(text) {
    const idx = (text || '').indexOf('```');
    return idx === -1 ? (text || '').trim() : text.slice(0, idx).trim();
  }

  function rebuildWithFiles(originalVisible, files) {
    const prose = extractProse(originalVisible);
    const blocks = files.map((f) => {
      const lang = fileExt(f.path) || 'txt';
      return '```' + lang + ' file=' + f.path + '\n' + f.code + '\n```';
    });
    return (prose ? prose + '\n\n' : '') + blocks.join('\n\n');
  }

  // Sambung kode terpotong dengan lanjutannya secara MULUS — kunci anti-rusak.
  // Menangani: file ditulis ulang utuh, sisa yang mengulang akhir prior, dan
  // sisa murni — tanpa pernah mengganti prior dengan potongan yang lebih pendek.
  function stitchCode(prior, cont) {
    const a = (prior || '').replace(/\s+$/, '');
    const b = (cont || '').replace(/^\n+/, '');
    if (!a) return b;
    if (!b.trim()) return a;
    const head = a.slice(0, Math.min(80, a.length)).trim();
    if (head && b.trimStart().startsWith(head)) return b;
    const max = Math.min(a.length, b.length, 4000);
    for (let len = max; len >= 12; len--) {
      if (a.slice(a.length - len) === b.slice(0, len)) return a + b.slice(len);
    }
    return a + b;
  }

  // --- Edit terarah (SEARCH/REPLACE) ---
  function parseEditBlocks(text) {
    const blocks = [];
    const blockRe = /```[\w-]*[ \t]+edit[=:]\s*["']?([^\s"'`]+)["']?[^\n]*\n([\s\S]*?)```/gi;
    let m;
    while ((m = blockRe.exec(text)) !== null) {
      const path = m[1].trim().replace(/^\.\//, '');
      if (!isValidPath(path)) continue;
      const body = m[2];
      const edits = [];
      const pairRe = /<{5,}\s*SEARCH[^\n]*\n([\s\S]*?)\n={5,}[^\n]*\n([\s\S]*?)\n>{5,}\s*REPLACE/gi;
      let p;
      while ((p = pairRe.exec(body)) !== null) edits.push({ search: p[1], replace: p[2] });
      if (edits.length) blocks.push({ path, edits });
    }
    return blocks;
  }

  function matchFlexible(haystack, needle) {
    const trimmed = (needle || '').trim();
    if (!trimmed) return null;
    const esc = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    try {
      const re = new RegExp(esc);
      const mm = re.exec(haystack);
      if (mm) return { start: mm.index, end: mm.index + mm[0].length };
    } catch (e) { /* regex gagal — abaikan */ }
    return null;
  }

  // Terapkan pasangan SEARCH/REPLACE ke isi file dari filesMap (path→konten).
  function resolveEdits(filesMap, path, edits) {
    const files = filesMap || {};
    if (files[path] === undefined) return { ok: false, reason: 'nofile', missing: edits.length, ambiguous: 0, applied: 0 };
    let code = files[path];
    let applied = 0;
    let missing = 0;
    let ambiguous = 0;
    edits.forEach(({ search, replace }) => {
      const s = search.replace(/\n$/, '');
      const r = replace.replace(/\n$/, '');
      if (!s) { missing++; return; }
      const idx = code.indexOf(s);
      if (idx !== -1) {
        // #3 Penjaga keunikan: kalau teks lama muncul >1×, jangan menebak lokasi.
        if (code.indexOf(s, idx + s.length) !== -1) { ambiguous++; return; }
        code = code.slice(0, idx) + r + code.slice(idx + s.length); applied++; return;
      }
      // Sudah diterapkan sebelumnya? anggap sukses (idempoten untuk "Terapkan ulang").
      if (r && code.indexOf(r) !== -1) { applied++; return; }
      const flex = matchFlexible(code, s);
      if (flex) { code = code.slice(0, flex.start) + r + code.slice(flex.end); applied++; return; }
      missing++;
    });
    return { ok: missing === 0 && ambiguous === 0 && applied > 0, code, applied, missing, ambiguous };
  }

  function editResolutionReport(text, filesMap) {
    const resolved = [];
    const unresolved = [];
    parseEditBlocks(text).forEach((b) => {
      const res = resolveEdits(filesMap, b.path, b.edits);
      if (res.ok) resolved.push(b.path);
      else {
        const reason = res.reason || (res.ambiguous ? 'ambiguous' : 'missing');
        unresolved.push({ path: b.path, missing: res.missing, ambiguous: res.ambiguous, reason });
      }
    });
    return { resolved, unresolved };
  }

  // Tangkap blok ```lang file=path yang fence-nya BELUM ditutup (truncation
  // di tengah file — bentuk truncation paling umum). Tanpa ini partial-nya
  // tak terlihat → lanjutan tak bisa menyasarnya & isi hilang.
  function parseTrailingOpenBlock(text) {
    if (!hasUnclosedCodeFence(text)) return null;
    const idx = text.lastIndexOf('```');
    if (idx === -1) return null;
    const after = text.slice(idx + 3);
    const nl = after.indexOf('\n');
    if (nl === -1) return null;
    const header = after.slice(0, nl);
    if (/\bedit[=:]/i.test(header)) return null; // edit parsial tak bisa diresolusi
    const m = header.match(/\bfile[=:]\s*["']?([^\s"'`]+)/i);
    if (!m) return null;
    const path = m[1].trim().replace(/^\.\//, '');
    const code = after.slice(nl + 1).replace(/\n$/, '');
    if (!isValidPath(path) || !code.trim()) return null;
    return { path, code };
  }

  // Parse blok ```lang file=path … ``` + resolusi blok edit terarah.
  function parseFileBlocks(text, filesMap) {
    const files = [];
    const patterns = [
      /```[\w-]*[ \t]+file[=:]\s*["']?([^\s"'`]+)["']?[^\n]*\n([\s\S]*?)```/gi,
      /```[\w-]*[ \t]+file=([^\s`]+)[ \t]*\n([\s\S]*?)```/g,
      /```[\w-]*\nfile=([^\s`]+)[ \t]*\n([\s\S]*?)```/g,
    ];
    patterns.forEach((regex) => {
      let match;
      const re = new RegExp(regex.source, regex.flags);
      while ((match = re.exec(text)) !== null) {
        const path = match[1].trim().replace(/^\.\//, '');
        const code = match[2].replace(/\n$/, '');
        if (isValidPath(path) && code.trim()) files.push({ path, code });
      }
    });
    const unique = {};
    files.forEach((f) => { unique[f.path] = f.code; });
    parseEditBlocks(text).forEach((b) => {
      if (unique[b.path] !== undefined) return;
      const res = resolveEdits(filesMap, b.path, b.edits);
      if (res.ok) unique[b.path] = res.code;
    });
    // Blok terakhir yang terpotong (fence terbuka) → simpan partial-nya
    // (hanya jika path itu belum punya versi lengkap dari blok tertutup).
    const open = parseTrailingOpenBlock(text);
    if (open && unique[open.path] === undefined) unique[open.path] = open.code;
    return Object.keys(unique).map((path) => ({ path, code: unique[path] }));
  }

  function mergeContinuedOutput(previous, continuation, filesMap) {
    const prevFiles = parseFileBlocks(previous, filesMap);
    const newFiles = parseFileBlocks(continuation, filesMap);
    if (!newFiles.length) {
      const tail = continuation.replace(/^[\s\S]*?```[\w-]*\s*\n?/m, '').replace(/```\s*$/m, '').trim();
      const incomplete = prevFiles.filter((f) => !isFileComplete(f.code, f.path));
      if (incomplete.length && tail) {
        const last = incomplete[incomplete.length - 1];
        last.code = stitchCode(last.code, tail);
        return rebuildWithFiles(previous, prevFiles);
      }
      return previous;
    }
    const map = Object.fromEntries(prevFiles.map((f) => [f.path, f.code]));
    newFiles.forEach((f) => {
      const prior = map[f.path];
      if (prior && !isFileComplete(prior, f.path)) {
        map[f.path] = stitchCode(prior, f.code);
      } else if (prior && isFileComplete(prior, f.path) && f.code.trim().length < prior.trim().length * 0.6) {
        map[f.path] = prior;
      } else {
        map[f.path] = f.code;
      }
    });
    return rebuildWithFiles(previous, Object.keys(map).map((path) => ({ path, code: map[path] })));
  }

  function isResponseTruncated(visible, finishReason, filesMap) {
    if (hasUnclosedCodeFence(visible)) return true;
    const files = parseFileBlocks(visible, filesMap);
    if (!files.length) return finishReason === 'length';
    const allComplete = files.every((f) => isFileComplete(f.code, f.path));
    if (allComplete) return false;
    if (finishReason === 'length') return true;
    return files.some((f) => !isFileComplete(f.code, f.path));
  }

  return {
    fileExt, isValidPath, braceBalance, isFileComplete, hasUnclosedCodeFence,
    extractProse, rebuildWithFiles, stitchCode, parseEditBlocks, matchFlexible,
    resolveEdits, editResolutionReport, parseFileBlocks, mergeContinuedOutput,
    isResponseTruncated, estimateTokens, estimateMessagesTokens,
  };
});
