import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildSitemapEntries,
  renderSitemapXml,
} from '../scripts/generate-sitemap.mjs';
import { ARTICLE_PATHS, SEO_ROUTES, SITE } from '../scripts/seo-routes.mjs';

const ROOT = join(import.meta.dirname, '..');

describe('sitemap generator', () => {
  it('XML is well-formed and balanced', () => {
    const xml = renderSitemapXml();
    const open = (xml.match(/<url>/g) || []).length;
    const close = (xml.match(/<\/url>/g) || []).length;
    expect(open).toBe(close);
    expect(open).toBeGreaterThan(0);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('includes homepage and all articles with lastmod', () => {
    const entries = buildSitemapEntries();
    const locs = entries.map((entry) => entry.loc);
    expect(locs).toContain(SEO_ROUTES['/'].canonical);
    for (const path of ARTICLE_PATHS) {
      expect(locs).toContain(SEO_ROUTES[path].canonical);
    }
    for (const entry of entries) {
      expect(entry.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('committed sitemap.xml matches generator output', () => {
    const generated = renderSitemapXml().replace(/\r\n/g, '\n');
    const onDisk = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8').replace(/\r\n/g, '\n');
    expect(onDisk).toBe(generated);
  });
});