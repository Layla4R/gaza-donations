const fs=require('node:fs'),path=require('node:path'),test=require('node:test'),assert=require('node:assert/strict'),ts=require('typescript');
const out={};new Function('exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/public-messages.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(out);
test('authentication and validation errors use the chosen interface language',()=>{
 for(const locale of ['en','fr','tr'])for(const message of ['البريد الإلكتروني أو كلمة المرور غير صحيحة','البريد وكلمة المرور مطلوبان','هذا البريد الإلكتروني مسجل مسبقاً','TOKEN_EXPIRED','Current password required']){
  const result=out.publicErrorMessage(message,locale);assert.ok(result);assert.doesNotMatch(result,/[\u0621-\u064a]/);
 }
 assert.match(out.publicErrorMessage('Current password required','ar'),/[\u0621-\u064a]/);
 assert.equal(out.publicErrorMessage('تفاصيل خطأ جديد','ar'),'تفاصيل خطأ جديد');
 assert.notEqual(out.publicErrorMessage('البريد وكلمة المرور مطلوبان','fr'),out.publicErrorMessage('البريد وكلمة المرور مطلوبان','en'));
});
