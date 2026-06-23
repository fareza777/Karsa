import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLE_PATHS } from './seo-routes.mjs';
import { ARTICLE_BODY } from './article-content.mjs';
import { renderArticlePage } from './render-seo.mjs';

export function generateArticles(targetDir = join(process.cwd(), 'artikel')) {
  mkdirSync(targetDir, { recursive: true });
  const written = [];

  for (const path of ARTICLE_PATHS) {
    const slug = path.split('/').pop();
    const body = ARTICLE_BODY[slug];
    if (!body) {
      throw new Error(`Missing article body for ${slug}`);
    }
    const out = join(targetDir, `${slug}.html`);
    writeFileSync(out, renderArticlePage(path, body.trim()), 'utf8');
    written.push(out);
  }

  return written;
}

const isCliEntry =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliEntry) {
  const files = generateArticles();
  console.log(`✓ ${files.length} article HTML files generated`);
}