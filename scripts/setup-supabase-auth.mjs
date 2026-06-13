#!/usr/bin/env node
/* Setup auth Supabase + Google OAuth via Management API */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupSupabaseAuth, getAuthConfig } from '../lib/supabase-mgmt.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadDotEnv(file) {
  const path = resolve(root, file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (v) process.env[m[1]] = v;
  }
}

['.env.local', '.env.production', '.env.vercel', '.env'].forEach(loadDotEnv);

const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const appUrl = process.env.KARSA_APP_URL || 'https://karsa.work';
const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID || '';
const googleSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || '';

async function main() {
  if (!accessToken) {
    console.error('❌ Set SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)');
    process.exit(1);
  }

  console.log('📡 Membaca konfigurasi auth saat ini...');
  const before = await getAuthConfig(accessToken);
  console.log('   site_url:', before.site_url || '(belum di-set)');
  console.log('   google:', before.external_google_enabled ? 'aktif' : 'belum');

  console.log('\n🔧 Menerapkan konfigurasi KARSA...');
  const result = await setupSupabaseAuth({
    accessToken,
    appUrl,
    googleClientId,
    googleSecret,
  });

  console.log('\n✅ Selesai');
  console.log('   site_url:', result.site_url);
  console.log('   mailer_autoconfirm:', result.mailer_autoconfirm);
  console.log('   google:', result.google_enabled ? 'aktif' : 'belum (isi GOOGLE_OAUTH_*)');

  if (!googleClientId || !googleSecret) {
    console.log('\n📋 Google OAuth — buat di Google Cloud Console:');
    console.log('   https://console.cloud.google.com/auth/clients/create');
    console.log('   Tipe: Web application');
    console.log('   Authorized JS origins:');
    console.log('     -', appUrl);
    console.log('     - http://localhost:8080');
    console.log('   Authorized redirect URI:');
    console.log('     - https://rebryzzjrvsgzzxoutko.supabase.co/auth/v1/callback');
    console.log('\n   Lalu set GOOGLE_OAUTH_CLIENT_ID & GOOGLE_OAUTH_CLIENT_SECRET dan jalankan ulang script ini.');
  }
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
