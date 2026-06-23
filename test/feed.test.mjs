import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderFeedXml } from '../scripts/generate-feed.mjs';
import { ARTICLE_PATHS, SEO_ROUTES } from '../scripts/seo-routes.mjs';

const ROOT = join(import.meta.dirname, '..');

describe('feed.xml generator', () => {
  it('includes all articles', () => {
    const xml = renderFeedXml();
    for (const path of ARTICLE_PATHS) {
      expect(xml).toContain(SEO_ROUTES[path].canonical);
      expect(xml).toContain(SEO_ROUTES[path].title);
    }
  });

  it('committed feed.xml matches generator output', () => {
    const generated = renderFeedXml().replace(/\r\n/g, '\n');
    const onDisk = readFileSync(join(ROOT, 'feed.xml'), 'utf8').replace(/\r\n/g, '\n');
    expect(onDisk).toBe(generated);
  });
});