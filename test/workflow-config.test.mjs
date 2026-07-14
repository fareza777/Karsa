import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const ci = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
const browserRunner = readFileSync(new URL('../scripts/browser-e2e.mjs', import.meta.url), 'utf8');
const authClient = readFileSync(new URL('../js/auth.js', import.meta.url), 'utf8');
const adminClient = readFileSync(new URL('../js/admin.js', import.meta.url), 'utf8');
const planClient = readFileSync(new URL('../js/plan.js', import.meta.url), 'utf8');
const appClient = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const appHtml = readFileSync(new URL('../app.html', import.meta.url), 'utf8');

describe('workflow produksi', () => {
  it('mengunci Playwright sebagai dependency pengembangan', () => {
    expect(pkg.devDependencies?.playwright).toMatch(/^\^?\d/);
  });

  it('CI memakai install deterministik dan menjalankan browser E2E', () => {
    expect(ci).toMatch(/run:\s*npm ci\b/);
    expect(ci).toMatch(/playwright install chromium/);
    expect(ci).toMatch(/run:\s*npm run e2e:browser\b/);
  });

  it('menyediakan satu perintah verifikasi penuh untuk developer', () => {
    expect(pkg.scripts?.verify).toBe('npm run generate-seo && npm run check && npm test && npm run e2e && npm run smoke && npm run e2e:browser');
  });

  it('browser runner tidak boleh skip sukses di CI', () => {
    expect(browserRunner).toMatch(/process\.env\.CI[\s\S]+process\.exit\(1\)/);
  });

  it('bootstrap menandai UI siap dan browser menunggu readiness, bukan timeout tetap', () => {
    expect(appHtml).toMatch(/id="hero-prompt-send"[^>]+disabled[^>]+aria-busy="true"/);
    expect(appClient).toContain("$('#hero-prompt-send').removeAttribute('disabled')");
    expect(appClient).toContain("document.body.dataset.karsaReady = 'true'");
    expect(browserRunner).toContain("body[data-karsa-ready=\"true\"]");
    expect(browserRunner).not.toContain('await page.waitForTimeout(600);');
  });
});

describe('kontrak autentikasi klien', () => {
  it('Auth menyediakan access token dan header Bearer', () => {
    expect(authClient).toContain('async function getAccessToken()');
    expect(authClient).toContain('async function authHeaders()');
    expect(authClient).toMatch(/Authorization\s*=\s*`Bearer \$\{token\}`/);
  });

  it('admin dan superuser memakai header autentikasi', () => {
    expect(adminClient).toContain('await Auth.authHeaders()');
    expect(planClient).toContain('await Auth.authHeaders()');
    expect(adminClient).not.toMatch(/JSON\.stringify\(\{\s*email:\s*user\.email/);
    expect(planClient).not.toMatch(/JSON\.stringify\(\{\s*email:\s*user\.email/);
  });
});
