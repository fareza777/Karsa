import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ARTICLE_PATHS,
  RELATED_ARTICLES,
  SEO_ROUTES,
  SITE,
  articleJsonLd,
} from '../scripts/seo-routes.mjs';

const ROOT = join(import.meta.dirname, '..');

function readHtml(relativePath) {
  const filePath = relativePath === '/'
    ? join(ROOT, 'index.html')
    : join(ROOT, `${relativePath}.html`);
  return readFileSync(filePath, 'utf8');
}

function articleFile(path) {
  return join(ROOT, `${path}.html`);
}

describe('SEO routes', () => {
  it('homepage meta matches seo-routes', () => {
    const route = SEO_ROUTES['/'];
    const html = readHtml('/');
    expect(html).toContain(`<title>${route.title}</title>`);
    expect(html).toContain(route.description);
    expect(html).toContain(route.canonical);
    expect(html).toContain(route.keywords);
    expect(html).toContain(route.ogImage);
    expect(html).toContain('"@type": "Organization"');
    expect(html).toContain('"@type": "WebSite"');
    expect(html).toContain('feed.xml');
  });

  for (const path of ARTICLE_PATHS) {
    it(`${path} has complete article SEO`, () => {
      const route = SEO_ROUTES[path];
      const html = readHtml(path);

      expect(html).toContain(`<title>${route.title}</title>`);
      expect(html).toContain(route.canonical);
      expect(html).toContain(route.keywords);
      expect(html).toContain('property="og:type" content="article"');
      expect(html).toContain(route.ogImage);
      expect(html).toContain(`property="article:published_time" content="${route.datePublished}"`);
      expect(html).toContain(`property="article:modified_time" content="${route.dateModified}"`);
      expect(html).toContain('"@type": "BlogPosting"');
      expect(html).toContain(`<time datetime="${route.datePublished}">`);
      expect(html).toContain(`<h1>${route.headline}</h1>`);
    });

    it(`${path} links to related articles`, () => {
      const html = readHtml(path);
      for (const related of RELATED_ARTICLES[path]) {
        expect(html).toContain(`href="${related}"`);
      }
    });

    it(`${path} OG image exists on disk`, () => {
      const slug = path.split('/').pop();
      expect(existsSync(join(ROOT, 'og', `${slug}.svg`))).toBe(true);
    });
  }

  it('articleJsonLd matches route fields', () => {
    for (const path of ARTICLE_PATHS) {
      const route = SEO_ROUTES[path];
      const json = articleJsonLd(path);
      expect(json.headline).toBe(route.headline);
      expect(json.datePublished).toBe(route.datePublished);
      expect(json.mainEntityOfPage['@id']).toBe(route.canonical);
    }
  });
});

describe('app and admin noindex', () => {
  it('app.html is noindex', () => {
    const html = readFileSync(join(ROOT, 'app.html'), 'utf8');
    expect(html).toContain('noindex');
  });

  it('admin.html is noindex,nofollow', () => {
    const html = readFileSync(join(ROOT, 'admin.html'), 'utf8');
    expect(html).toContain('noindex, nofollow');
  });
});

describe('article files exist', () => {
  for (const path of ARTICLE_PATHS) {
    it(path, () => {
      expect(existsSync(articleFile(path))).toBe(true);
    });
  }
});

describe('SITE constant', () => {
  it('uses production domain', () => {
    expect(SITE).toBe('https://karsa.work');
  });
});