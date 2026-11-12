import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { createServerClient } from '@supabase/ssr';

const compile = (file, replace = {}) => {
  let code = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const [from, to] of Object.entries(replace)) code = code.replaceAll(from, to);
  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
};
const configUrl = compile('../lib/supabase/config.ts');
const config = await import(configUrl);
const { authErrorMessage, safeRedirectPath } = await import(compile('../lib/auth.ts'));
const proxy = await import(compile('../app/api/supabase/[...path]/route.ts', {
  '../../../../lib/supabase/config': configUrl,
}));

test('password login writes cookies that the server can authenticate', async () => {
  const originalFetch = globalThis.fetch;
  const originalBroadcast = globalThis.BroadcastChannel;
  globalThis.BroadcastChannel = undefined;
  const jar = new Map();
  const calls = [];
  const user = { id: 'test-user', email: 'test@example.invalid', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() };
  const jwt = [ { alg: 'HS256', typ: 'JWT' }, { sub: user.id, exp: Math.floor(Date.now()/1000)+3600 } ]
    .map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.') + '.test';
  globalThis.window = { location: { origin: 'https://noira.test' } };
  globalThis.document = {
    get cookie() { return [...jar].map(([name,value]) => `${name}=${value}`).join('; '); },
    set cookie(value) { const [pair] = value.split(';'); const at = pair.indexOf('='); jar.set(pair.slice(0,at),pair.slice(at+1)); },
  };
  globalThis.window.document = globalThis.document;
  globalThis.window.addEventListener = () => {};
  globalThis.window.removeEventListener = () => {};
  globalThis.document.visibilityState = "hidden";
  globalThis.fetch = async (input, init) => {
    calls.push(String(input));
    return Response.json(String(input).includes('/token')
      ? { access_token: jwt, refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer', user }
      : user);
  };
  let browserClient;
  try {
    const moduleUrl = compile('../lib/supabase/client.ts', {
      './config': configUrl,
      '@supabase/ssr': import.meta.resolve('@supabase/ssr'),
    });
    browserClient = (await import(moduleUrl)).createClient();
    const login = await browserClient.auth.signInWithPassword({ email: user.email, password: 'test-password' });
    assert.equal(login.error, null);
    assert.ok([...jar.keys()].some(name => name.startsWith(config.authCookieName)));
    assert.ok(calls.includes('https://noira.test/api/supabase/auth/v1/token?grant_type=password'));
    const server = createServerClient(config.projectUrl, config.publishableKey, {
      cookieOptions: config.authCookieOptions,
      global: { fetch: globalThis.fetch },
      cookies: {
        getAll: () => [...jar].map(([name,value]) => ({ name, value: decodeURIComponent(value) })),
        setAll: values => values.forEach(({name,value}) => jar.set(name,value)),
      },
    });
    const verified = await server.auth.getUser();
    assert.equal(verified.error, null);
    assert.equal(verified.data.user.id, user.id);
    const claims = await server.auth.getClaims();
    assert.equal(claims.data.claims.sub, user.id);
  } finally {
    browserClient?.auth.stopAutoRefresh();
    delete globalThis.window;
    delete globalThis.document;
    globalThis.fetch = originalFetch;
    globalThis.BroadcastChannel = originalBroadcast;
  }
});

test('auth proxy preserves upstream email errors and removes site identity', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    assert.equal(init.headers.get('cookie'), null);
    assert.equal(init.headers.get('oai-authenticated-user-email'), null);
    assert.ok(init.signal);
    assert.match(String(input), /\/auth\/v1\/signup/);
    return Response.json({ code: 'email_address_not_authorized', message: 'Email address not authorized' }, {status: 422});
  };
  try {
    const response = await proxy.POST(new Request('https://noira.test/api/supabase/auth/v1/signup', {
      method:'POST', headers: {cookie:'private=value', 'oai-authenticated-user-email':'private@example.invalid'}, body:'{}',
    }), {params: Promise.resolve({path:['auth','v1','signup']})});
    assert.equal(response.status,422);
    assert.equal((await response.json()).code,'email_address_not_authorized');
    assert.equal(response.headers.get('cache-control'),'no-store');
  } finally { globalThis.fetch = original; }
});

test('network failure becomes an actionable response; non-auth routes are blocked', async () => {
  const original=globalThis.fetch;
  globalThis.fetch=async()=>{throw new Error('connection timeout');};
  try {
    const response=await proxy.POST(new Request('https://noira.test/api/supabase/auth/v1/token',{method:'POST'}),{params:Promise.resolve({path:['auth','v1','token']})});
    assert.equal(response.status,503);
    assert.equal((await response.json()).code,'service_unavailable');
    const forbidden=await proxy.GET(new Request('https://noira.test'),{params:Promise.resolve({path:['rest','v1','users']})});
    assert.equal(forbidden.status,404);
  } finally {globalThis.fetch=original;}
});

test('safe redirects and contextual errors', () => {
  for (const target of ['//evil.test','/\\evil.test','https://evil.test']) assert.equal(safeRedirectPath(target),'/dashboard');
  assert.equal(safeRedirectPath('/dashboard/contacts?view=all'),'/dashboard/contacts?view=all');
  assert.match(authErrorMessage({code:'email_not_confirmed'}),/Confirme/);
  assert.match(authErrorMessage({message:'TimeoutError'}),/demorou/);
  assert.match(authErrorMessage({code:'invalid_credentials'}),/incorretos/);
});
