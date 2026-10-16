const { chromium } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
(async()=>{const b=await chromium.launch();
for (const f of ["data.js","i18n.js","changelog.js","orgs-data.js","app.js","stateManager.js"]){const p=await b.newPage();const errs=[];p.on("pageerror",e=>errs.push(e.message.slice(0,80)));
await p.route("**/"+f+"*",r=>r.abort());await p.goto("http://127.0.0.1:8799/");await p.waitForTimeout(2500);
const t=await p.evaluate(()=>document.getElementById("app").innerText.trim().slice(0,90).replace(/\n/g," | "));console.log(f.padEnd(16),"->",JSON.stringify(t),"errors:",errs.slice(0,2).join(" ; "));await p.close()}
await b.close()})();
