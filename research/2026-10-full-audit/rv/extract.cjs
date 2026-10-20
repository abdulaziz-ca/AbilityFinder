// Writes rv/<id>.record.json: every stored fact for one benefit (BENEFITS entry, values, meta, extra).
const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('public/data.js','utf8')+"\nglobalThis.X={B:BENEFITS,V:BENEFIT_VALUES,M:BENEFIT_META,E:BENEFIT_EXTRA,VER:BENEFIT_VERIFIED};",ctx);
const X=ctx.X;
for(const id of process.argv.slice(2)){
  const b=X.B.find(r=>r.id===id); if(!b){console.error('missing',id);continue;}
  const rec={id,benefit:b,values:X.V[id]||null,meta:X.M[id]||null,extra:X.E[id]||null,verified:X.VER[id]||'(inherited)'};
  fs.writeFileSync(path.join('research/2026-10-full-audit/rv',id+'.record.json'),JSON.stringify(rec,null,1));
}
