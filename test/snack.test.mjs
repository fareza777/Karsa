import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

// Muat modul browser (IIFE) ke sandbox Node agar logika mobile bisa diuji unit.
// snack.js butuh: fileExt (utils.js), expoEntryPath/sortedProjectPaths (project.js).
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let Snack;

beforeAll(() => {
  const sandbox = { console };
  sandbox.globalThis = sandbox;
  sandbox.showToast = () => {}; // stub DOM
  vm.createContext(sandbox);
  const expose = {
    'utils.js': ['fileExt'],
    'project.js': ['expoEntryPath', 'sortedProjectPaths', 'analyzeProjectFiles', 'hasUsableWebPreview'],
    'snack.js': ['Snack'],
  };
  for (const file of ['utils.js', 'project.js', 'snack.js']) {
    let code = readFileSync(join(root, 'js', file), 'utf8');
    for (const name of expose[file]) {
      code += `\n;globalThis.${name} = typeof ${name} !== 'undefined' ? ${name} : undefined;`;
    }
    vm.runInContext(code, sandbox, { filename: file });
  }
  Snack = sandbox.Snack;
});

const mobileProject = (appTsx, pkg) => ({
  name: 'Uji',
  projectType: 'mobile',
  files: {
    'App.tsx': appTsx,
    'package.json': JSON.stringify(pkg || { dependencies: { expo: '~52.0.0', react: '18.3.1', 'react-native': '0.76.3' } }),
  },
});

const validApp = 'import { View, Text } from "react-native";\nexport default function App(){\n  return (<View><Text>Halo dunia yang cukup panjang untuk lolos cek</Text></View>);\n}';

describe('Snack.diagnoseProject', () => {
  it('App.tsx valid → ok', () => {
    expect(Snack.diagnoseProject(mobileProject(validApp)).ok).toBe(true);
  });
  it('komponen arrow implicit-return → ok (tak salah-vonis)', () => {
    const arrow = 'import { View, Text } from "react-native";\nconst App = () => (\n  <View><Text>halo dunia yang cukup panjang sekali</Text></View>\n);\nexport default App;';
    expect(Snack.diagnoseProject(mobileProject(arrow)).ok).toBe(true);
  });
  it('tanpa export default → error', () => {
    const bad = 'import { View } from "react-native";\nfunction App(){ return null; }';
    expect(Snack.diagnoseProject(mobileProject(bad)).ok).toBe(false);
  });
  it('App.tsx terpotong (kurung tak seimbang) → error', () => {
    const cut = 'import { View, Text } from "react-native";\nexport default function App(){\n  return (<View><Text>Hal';
    expect(Snack.diagnoseProject(mobileProject(cut)).ok).toBe(false);
  });
  it('package.json rusak → error', () => {
    const p = { name: 'x', projectType: 'mobile', files: { 'App.tsx': validApp, 'package.json': '{rusak' } };
    expect(Snack.diagnoseProject(p).ok).toBe(false);
  });
});

describe('Snack.snackWebRisky (deteksi app "berat")', () => {
  it('pakai paket native (async-storage) → berat', () => {
    const app = 'import AsyncStorage from "@react-native-async-storage/async-storage";\n' + validApp;
    expect(Snack.snackWebRisky(mobileProject(app))).toBe(true);
  });
  it('react-native bawaan saja → tidak berat', () => {
    expect(Snack.snackWebRisky(mobileProject(validApp))).toBe(false);
  });
});

describe('Snack.buildSnackFiles — auto-inject dependency hilang (ensureDeps)', () => {
  it('paket di-import tapi tak ada di package.json → ditambahkan', () => {
    const app = 'import AsyncStorage from "@react-native-async-storage/async-storage";\n' + validApp;
    const sf = Snack.buildSnackFiles(mobileProject(app));
    const deps = JSON.parse(sf['package.json'].contents).dependencies;
    expect(deps['@react-native-async-storage/async-storage']).toBeTruthy();
  });
  it('versi diketahui di-pin (bukan "*")', () => {
    const app = 'import AsyncStorage from "@react-native-async-storage/async-storage";\n' + validApp;
    const sf = Snack.buildSnackFiles(mobileProject(app));
    const deps = JSON.parse(sf['package.json'].contents).dependencies;
    expect(deps['@react-native-async-storage/async-storage']).toBe('1.23.1');
  });
});

describe('Snack.buildEmbedPage — kirim deps + sdkVersion via atribut', () => {
  it('embed memuat data-snack-dependencies utk paket eksternal', () => {
    const app = 'import { NavigationContainer } from "@react-navigation/native";\n' + validApp;
    const page = Snack.buildEmbedPage(mobileProject(app));
    const m = page.match(/data-snack-dependencies="([^"]*)"/);
    expect(m && /@react-navigation\/native@/.test(m[1])).toBe(true);
  });
  it('embed memuat data-snack-sdkVersion dari versi expo', () => {
    const page = Snack.buildEmbedPage(mobileProject(validApp));
    expect(/data-snack-sdkVersion="52\.0\.0"/.test(page)).toBe(true);
  });
});

describe('Snack.buildOpenUrl — penjaga HTTP 431 (URL kepanjangan)', () => {
  it('app kecil → URL dibuat', () => {
    expect(typeof Snack.buildOpenUrl(mobileProject(validApp))).toBe('string');
  });
  it('app besar → null (cegah 431; pakai preview in-app)', () => {
    const huge = 'import { View, Text } from "react-native";\n// ' + 'x'.repeat(9000) + '\nexport default function App(){ return (<View><Text>a</Text></View>); }';
    expect(Snack.buildOpenUrl(mobileProject(huge))).toBe(null);
  });
});
