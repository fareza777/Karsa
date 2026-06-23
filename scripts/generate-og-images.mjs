import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLE_PATHS, SEO_ROUTES, SITE } from './seo-routes.mjs';

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapTitle(text, maxLen = 42) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLen && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

export function renderOgSvg({ title, subtitle, slug }) {
  const lines = wrapTitle(title);
  const lineY = lines.length > 1 ? [210, 280] : [240];
  const titleNodes = lines
    .map((line, index) => {
      const y = lineY[index] ?? 240 + index * 70;
      return `  <text x="80" y="${y}" fill="#eef1f7" font-family="system-ui,Segoe UI,sans-serif" font-size="56" font-weight="800">${escapeXml(line)}</text>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg-${slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#080a10"/>
      <stop offset="1" stop-color="#151a28"/>
    </linearGradient>
    <linearGradient id="g-${slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c5cff"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow-${slug}" cx="75%" cy="35%" r="45%">
      <stop offset="0" stop-color="#7c5cff" stop-opacity=".35"/>
      <stop offset="1" stop-color="#7c5cff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg-${slug})"/>
  <rect width="1200" height="630" fill="url(#glow-${slug})"/>
  <rect x="80" y="80" width="56" height="56" rx="14" fill="url(#g-${slug})"/>
  <path d="M108 98l7.2 22.8L138 128l-22.8 7.2L108 158l-7.2-22.8L78 128l22.8-7.2Z" fill="#fff"/>
  <text x="156" y="122" fill="#eef1f7" font-family="system-ui,Segoe UI,sans-serif" font-size="36" font-weight="700">KARSA</text>
${titleNodes}
  <text x="80" y="360" fill="#8b94a8" font-family="system-ui,Segoe UI,sans-serif" font-size="28">${escapeXml(subtitle)}</text>
  <rect x="80" y="430" width="280" height="52" rx="26" fill="url(#g-${slug})"/>
  <text x="220" y="464" fill="#fff" font-family="system-ui,Segoe UI,sans-serif" font-size="22" font-weight="600" text-anchor="middle">karsa.work</text>
</svg>
`;
}

export function generateOgImages(targetDir = join(process.cwd(), 'og')) {
  mkdirSync(targetDir, { recursive: true });
  const written = [];

  for (const path of ARTICLE_PATHS) {
    const route = SEO_ROUTES[path];
    const slug = path.split('/').pop();
    const file = join(targetDir, `${slug}.svg`);
    writeFileSync(
      file,
      renderOgSvg({
        title: route.ogTitle,
        subtitle: route.category,
        slug,
      }),
      'utf8'
    );
    written.push(file);
  }

  const homeOg = join(process.cwd(), 'og.svg');
  writeFileSync(
    homeOg,
    renderOgSvg({
      title: 'Dari ide, jadi aplikasi',
      subtitle: 'Pembuat aplikasi & website dengan AI — Bahasa Indonesia',
      slug: 'home',
    }),
    'utf8'
  );
  written.push(homeOg);

  return written;
}

const isCliEntry =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliEntry) {
  const files = generateOgImages();
  console.log(`✓ ${files.length} OG SVG images generated`);
}