const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { SignJWT } = require('jose');
const root = path.resolve(__dirname, '..');
function load(file, dependencies = {}, env = process.env) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'), { compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020} }).outputText;
  new Function('exports','require','process',js)(exports, name => dependencies[name] || require(name), {env});
  return exports;
}
const tenant = load('lib/tenant.ts');
test('domain matching is exact; previews require configuration; legacy tokens are rejected',()=>{
  assert.equal(tenant.siteForHost('www.destekol.org:443').schema,'destekol');
  assert.equal(tenant.siteForHost('FORRELIEF.ORG').schema,'public');
  assert.equal(tenant.siteForHost('localhost:3000','destekol').id,'destekol');
  for(const host of ['destekol.org.attacker.test','fake-destekol.org','']) assert.throws(()=>tenant.siteForHost(host),/SITE_HOST/);
  assert.equal(tenant.isSiteSession({site:'destekol'},'forrelief'),false);
  assert.equal(tenant.isSiteSession({role:'ADMIN'},'destekol'),false);
});
test('real Supabase builders isolate reads, writes, RPC profiles and cached client instances',async()=>{
  let site = tenant.SITES.forrelief;
  const calls=[];
  const originalFetch=global.fetch;
  global.fetch=async(url,options)=>{
    const headers=new Headers(options.headers);
    calls.push({url:String(url),method:options.method,schema:headers.get('accept-profile') || headers.get('content-profile')});
    return new Response(JSON.stringify([{id:'same-id',title:headers.get('accept-profile')}]),{status:200,headers:{'content-type':'application/json'}});
  };
  try {
    const db=load('lib/supabase.ts',{'./request-site':{getRequestSite:()=>site}}, {SUPABASE_DATABASE_URL:'https://test.supabase.invalid',SUPABASE_SERVICE_ROLE_KEY:'test-only'});
    const first=db.getSupabase(); site=tenant.SITES.destekol; const second=db.getSupabase();
    assert.notEqual(first,second);
    await Promise.all([first.from('Page').select('*').eq('id','same-id'),second.from('Page').select('*').eq('id','same-id')]);
    await second.from('Page').update({title:'changed'}).eq('id','same-id');
    await second.rpc('get_dashboard_stats');
    await first.from('SiteSettings').select('*');
    assert.deepEqual(calls.map(c=>c.schema),['public','destekol','destekol','destekol','public']);
    assert.equal(calls[2].method,'PATCH');
  } finally {global.fetch=originalFetch;}
});
test('admin token cannot cross tenants; deleted membership and changed roles take effect',async()=>{
  let site=tenant.SITES.forrelief; let token; let user={email:'owner@example.test',role:'ADMIN',isStaff:true};
  const secret=new TextEncoder().encode('private-test-secret-at-least-thirty-two-bytes');
  const db={from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:user,error:null})})})})};
  const auth=load('lib/auth.ts',{
    './session-secret':{getSessionSecret:()=>secret},'./request-site':{getRequestSite:()=>site},'./tenant':tenant,
    './supabase':{getSupabase:()=>db},'next/headers':{cookies:()=>({get:()=>token?{value:token}:undefined,set:(_n,t)=>{token=t;},delete:()=>{token=undefined;}})},
  });
  token=await auth.createAdminSession(user.email);
  assert.equal((await auth.requireAdmin()).site,'forrelief');
  site=tenant.SITES.destekol;
  assert.equal(await auth.getAdminSession(),null);
  await assert.rejects(auth.requireAdmin(),/UNAUTHORIZED/);
  token=await auth.createAdminSession(user.email);
  assert.equal((await auth.requireAdmin()).site,'destekol');
  user={...user,role:'VIEWER'};
  assert.equal((await auth.requireAdmin()).role,'VIEWER');
  await assert.rejects(auth.requireSuperAdmin(),/UNAUTHORIZED/);
  user=null;
  assert.equal(await auth.getAdminSession(),null);
  token=await new SignJWT({email:'owner@example.test',role:'ADMIN'}).setProtectedHeader({alg:'HS256'}).sign(secret);
  assert.equal(await auth.getAdminSession(),null);
});
test('translation values and invalidation remain tenant-specific for the same locale',async()=>{
  let site=tenant.SITES.forrelief;
  const db={from:()=>({select:()=>({eq:async()=>({data:[{key:'nav.home',value:site.name}]})})})};
  const i18n=load('lib/i18n.ts',{'./request-site':{getRequestSite:()=>site},'./supabase':{getSupabaseOrNull:()=>db},'./locales':load('lib/locales.ts')});
  assert.equal((await i18n.loadTranslations('en'))['nav.home'],'4Relief');
  site=tenant.SITES.destekol;
  assert.equal((await i18n.loadTranslations('en'))['nav.home'],'Destekol');
  i18n.clearTranslationCache('en');
  site=tenant.SITES.forrelief;
  assert.equal((await i18n.loadTranslations('en'))['nav.home'],'4Relief');
});
