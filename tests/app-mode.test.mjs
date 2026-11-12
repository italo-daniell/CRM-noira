import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { NextRequest } from 'next/server.js';

const compile = (path, replacements = {}) => {
  let source = ts.transpileModule(fs.readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const [from,to] of Object.entries(replacements)) source = source.replaceAll(from,to);
  return `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
};
const mode = compile('../lib/app-mode.ts');
const config = compile('../lib/supabase/config.ts');
const { updateSession } = await import(compile('../lib/supabase/proxy.ts', {
  '../app-mode': mode,
  './config': config,
  '@supabase/ssr': import.meta.resolve('@supabase/ssr'),
  'next/server': import.meta.resolve('next/server.js'),
}));

test('open app redirects all previous entry pages into the CRM without contacting auth', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Open access must not require an authentication request'); };
  try {
    for (const route of ['/entrar','/criar-conta','/recuperar-senha','/redefinir-senha','/confirmar-email']) {
      const response = await updateSession(new NextRequest(`https://noira.test${route}`));
      assert.equal(response.status,307);
      assert.equal(response.headers.get('location'),'https://noira.test/dashboard');
    }
    for (const route of ['/dashboard','/dashboard/contacts','/dashboard/conversations','/dashboard/calendar','/dashboard/ai','/dashboard/reports','/dashboard/profile']) {
      const response = await updateSession(new NextRequest(`https://noira.test${route}`));
      assert.equal(response.headers.get('x-middleware-next'),'1');
      assert.equal(response.headers.get('location'),null);
      assert.equal(response.headers.get('cache-control'),'private, no-store');
    }
  } finally { globalThis.fetch=original; }
});

test('installable manifest starts at CRM and has actual PNG icons at declared sizes', () => {
  const manifest=JSON.parse(fs.readFileSync(new URL('../public/manifest.webmanifest',import.meta.url)));
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.start_url,'/dashboard');
  assert.equal(manifest.scope,'/');
  for(const size of [192,512]) {
    const icon=manifest.icons.find(icon=>icon.sizes===`${size}x${size}`);
    assert.ok(icon);
    const image=fs.readFileSync(new URL(`../public${icon.src}`,import.meta.url));
    assert.equal(image.subarray(1,4).toString(),'PNG');
    assert.equal(image.readUInt32BE(16),size);
    assert.equal(image.readUInt32BE(20),size);
  }
});

test('offline fallback keeps a route back to the CRM', () => {
  const html=fs.readFileSync(new URL('../public/offline.html',import.meta.url),'utf8');
  assert.match(html,/href="\/dashboard"/);
  assert.match(html,/registros salvos neste navegador/);
});
