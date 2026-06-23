import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const robots = readFileSync(join(import.meta.dirname, '..', 'robots.txt'), 'utf8');

describe('robots.txt', () => {
  it('allows public pages', () => {
    expect(robots).toContain('Allow: /');
  });

  it('blocks non-indexable app surfaces', () => {
    expect(robots).toContain('Disallow: /app');
    expect(robots).toContain('Disallow: /admin');
    expect(robots).toContain('Disallow: /api/');
  });

  it('references sitemap', () => {
    expect(robots).toContain('Sitemap: https://karsa.work/sitemap.xml');
  });
});