const fs=require('node:fs'),path=require('node:path'),test=require('node:test'),assert=require('node:assert/strict'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const out={};const dictionary=require('../lib/generated/public-content-translations.json');
new Function('exports','require',ts.transpileModule(fs.readFileSync(path.join(root,'lib/public-content-localization.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(out,()=>({default:dictionary}));
test('published content fallback translates descriptions without altering technical data or Arabic',()=>{
 const source='عقد شراكات استراتيجية مع 4Relief لتوجيه دعمك المؤسسي نحو مشاريع إغاثية موثقة ميدانياً. عزز أثرك الإنساني بشفافية وتقارير أداء دورية.';
 const original={id:'fixture',slug:'institutional-partnerships',description:source,sections:[{type:'text',props:{body:source,buttonLink:'/ar/projects'}}],authorName:'اسم حقيقي'};
 for(const locale of ['en','fr','tr']){
  const result=out.localizePublicContent(original,locale);
  assert.doesNotMatch(result.description,/[\u0621-\u064a]/);
  assert.notEqual(result.description,source);
  assert.equal(result.slug,original.slug);assert.equal(result.sections[0].type,'text');assert.equal(result.sections[0].props.buttonLink,'/ar/projects');assert.equal(result.authorName,'اسم حقيقي');
 }
 assert.equal(out.localizePublicContent(original,'ar'),original);assert.equal(original.description,source);
});
test('translation preserves markup, links and section topology',()=>{
 const source='عقد شراكات استراتيجية مع 4Relief لتوجيه دعمك المؤسسي نحو مشاريع إغاثية موثقة ميدانياً. عزز أثرك الإنساني بشفافية وتقارير أداء دورية.';
 const html=`<p>${source}</p>\n<a href="https://example.test/report">report</a>`;
 const result=out.localizePublicText(html,'en');
 assert.match(result,/<p>/);assert.match(result,/<\/p>\n<a href="https:\/\/example.test\/report">report<\/a>/);assert.doesNotMatch(result,/[\u0621-\u064a]/);
 assert.match(out.localizePublicText(`<p>${source}</p> <em>report</em>`,'en'),/<\/p> <em>report<\/em>/);
});
