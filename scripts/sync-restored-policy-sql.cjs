const fs = require('fs'), ts = require('typescript');
function load(path) {const out={}; new Function('exports',ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(out);return out;}
const ar=load('lib/restored-policies.ts').restoredPolicies;
const en=load('lib/restored-policies-en.ts').restoredPoliciesEn;
const q=value=>"'"+value.replace(/'/g,"''")+"'";
let sql='-- Company policies; Arabic and matching English. Company incorporated 29 June 2026.\nBEGIN;\n';
for(const [locale,pages] of Object.entries({ar,en})) for(const [slug,page] of Object.entries(pages)) {
  const sections=JSON.stringify(page.sections.map((section,index)=>({id:slug+'-'+index,type:'text',props:{title:section.title,body:section.text}})));
  if(locale==='ar') sql+=`UPDATE "Page" SET "title"=${q(page.title)},"description"=${q(page.description)},"sections"=${q(sections)}::jsonb,"updatedAt"=now() WHERE "slug"=${q(slug)};\n`;
  else sql+=`INSERT INTO "PageTranslation" ("pageId","locale","title","description","sections") SELECT "id",'en',${q(page.title)},${q(page.description)},${q(sections)}::jsonb FROM "Page" WHERE "slug"=${q(slug)} ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","description"=EXCLUDED."description","sections"=EXCLUDED."sections","updatedAt"=now();\n`;
}
sql+='COMMIT;\n';fs.writeFileSync('supabase/legal_pages.sql',sql);
console.log('Synced '+Object.keys(ar).length+' Arabic and English policies.');
