import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const robots = readFileSync(join(import.meta.dirname, '..', 'robots.txt'), 'utf8');

describe('robots.txt', () => {
  it('allows public marketing and article pages', () => {
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Allow: /artikel/');
    expect(robots).toContain('Allow: /panduan');
    expect(robots).toContain('Allow: /p/');
  });

  it('does not block /app via robots (noindex handled in app.html)', () => {
    expect(robots).not.toContain('Disallow: /app');
  });

  it('blocks admin and api only', () => {
    expect(robots).toContain('Disallow: /admin$');
    expect(robots).toContain('Disallow: /admin/');
    expect(robots).toContain('Disallow: /api/');
  });

  it('references sitemap', () => {
    expect(robots).toContain('Sitemap: https://karsa.work/sitemap.xml');
  });
});
