import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ARTICLE_PATHS,
  HUB_PATHS,
  RELATED_ARTICLES,
  SEO_ROUTES,
  SITE,
  articleJsonLd,
} from '../scripts/seo-routes.mjs';

const ROOT = join(import.meta.dirname, '..');

function readHtml(relativePath) {
  const rel = relativePath === '/' ? 'index.html' : `${relativePath.replace(/^\//, '')}.html`;
  return readFileSync(join(ROOT, rel), 'utf8');
}

function articleFile(path) {
  return join(ROOT, `${path.replace(/^\//, '')}.html`);
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
    expect(html).toContain('"@type": "ItemList"');
    expect(html).toContain('feed.xml');
    expect(html).toContain('/panduan');
  });

  it('/panduan hub page has collection schema', () => {
    const route = SEO_ROUTES['/panduan'];
    const html = readHtml('/panduan');
    expect(html).toContain(`<title>${route.title}</title>`);
    expect(html).toContain(route.canonical);
    expect(html).toContain('"@type": "CollectionPage"');
    expect(html).toContain('"@type": "ItemList"');
    for (const path of ARTICLE_PATHS) {
      expect(html).toContain(`href="${path}"`);
    }
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
      expect(html).toContain('image/png');
      expect(html).toContain(`property="article:published_time" content="${route.datePublished}"`);
      expect(html).toContain(`property="article:modified_time" content="${route.dateModified}"`);
      expect(html).toContain('"@type": "BlogPosting"');
      expect(html).toContain('"@type": "BreadcrumbList"');
      expect(html).toContain('lp-breadcrumb');
      expect(html).toContain(`<time datetime="${route.datePublished}">`);
      expect(html).toContain(`<h1>${route.headline}</h1>`);
      expect(html).toContain('href="/panduan"');
    });

    it(`${path} links to related articles`, () => {
      const html = readHtml(path);
      for (const related of RELATED_ARTICLES[path]) {
        expect(html).toContain(`href="${related}"`);
      }
    });

    it(`${path} OG PNG exists on disk`, () => {
      const slug = path.split('/').pop();
      expect(existsSync(join(ROOT, 'og', `${slug}.png`))).toBe(true);
    });
  }

  it('articleJsonLd matches route fields', () => {
    for (const path of ARTICLE_PATHS) {
      const route = SEO_ROUTES[path];
      const json = articleJsonLd(path);
      expect(json.headline).toBe(route.headline);
      expect(json.datePublished).toBe(route.datePublished);
      expect(json.mainEntityOfPage['@id']).toBe(route.canonical);
      expect(json.image).toMatch(/\.png$/);
    }
  });

  it('llms.txt lists all articles', () => {
    const llms = readFileSync(join(ROOT, 'llms.txt'), 'utf8');
    expect(llms).toContain(SITE);
    for (const path of ARTICLE_PATHS) {
      expect(llms).toContain(SEO_ROUTES[path].canonical);
    }
    for (const path of HUB_PATHS) {
      expect(llms).toContain(SEO_ROUTES[path].canonical);
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