const fs = require('fs');
const ts = require('typescript');
function load(path) { const out = {}; new Function('exports', ts.transpileModule(fs.readFileSync(path, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(out); return out; }
async function main() {
  const {restoredPolicies} = load('lib/restored-policies.ts');
  const texts=[];
  function walk(value) {
    if(typeof value==='string') {
      if(!/[\u0621-\u064A]/.test(value)) return () => value;
      const indexes=[];
      let rest=value;
      while(rest.length) {
        let end=Math.min(3000,rest.length);
        if(end<rest.length) {const boundary=rest.lastIndexOf('\n',end); if(boundary>1500) end=boundary+1; else {const space=rest.lastIndexOf(' ',end);if(space>1500) end=space+1;}}
        indexes.push(texts.length);texts.push(rest.slice(0,end));rest=rest.slice(end);
      }
      return values=>indexes.map(index=>values[index]).join('\n');
    }
    if(Array.isArray(value)){const children=value.map(walk);return values=>children.map(child=>child(values));}
    if(value&&typeof value==='object'){const children=Object.entries(value).map(([key,item])=>[key,walk(item)]);return values=>Object.fromEntries(children.map(([key,child])=>[key,child(values)]));}
    return () => value;
  }
  const build=walk(restoredPolicies);
  const plan={texts,apply:build};
  console.log('Translating '+texts.length+' complete text chunks.');
  const values = new Array(plan.texts.length);
  let next = 0;
  await Promise.all(Array.from({length:3}, async () => {
    while (next < plan.texts.length) {
      const index = next++;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const url = new URL('https://translate.googleapis.com/translate_a/single');
          url.search = new URLSearchParams({client:'gtx',sl:'ar',tl:'en',dt:'t',q:plan.texts[index]}).toString();
          const response = await fetch(url, {signal:AbortSignal.timeout(15000)});
          if (!response.ok) throw Error('Translation HTTP '+response.status);
          const data = await response.json();
          const value = data[0].map(part => part[0]).join('');
          if (!value.trim() || /[\u0621-\u064A]/.test(value)) throw Error('Incomplete translation');
          values[index] = value;
          if(index%10===0) console.log('Completed text chunk '+index);
          break;
        } catch (error) { if (attempt === 2) throw error; }
      }
    }
  }));
  const translated = plan.apply(values);
  for (const slug of Object.keys(restoredPolicies)) if (translated[slug].sections.length !== restoredPolicies[slug].sections.length) throw Error('Missing sections');
  fs.writeFileSync('lib/restored-policies-en.ts', 'export const restoredPoliciesEn: Record<string, { title: string; description: string; sections: { title: string; text: string }[] }> = '+JSON.stringify(translated,null,2)+';\n');
  console.log('Translated '+Object.keys(translated).length+' policies, '+values.length+' text segments.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
