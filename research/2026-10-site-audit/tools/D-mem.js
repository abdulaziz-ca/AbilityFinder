const { chromium } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const cdp=await p.context().newCDPSession(p);await cdp.send("Performance.enable");
await p.goto("http://127.0.0.1:8799/");await p.waitForFunction(()=>history.state!==null);
const m=async()=>{await cdp.send("HeapProfiler.collectGarbage");const x=(await cdp.send("Performance.getMetrics")).metrics;const g=n=>x.find(y=>y.name===n).value;return {heapMB:+(g("JSHeapUsedSize")/1048576).toFixed(1),nodes:g("Nodes"),listeners:g("JSEventListeners"),docListeners:await p.evaluate(()=>0)}};
console.log("start",JSON.stringify(await m()));
await p.evaluate(()=>{answers=Object.assign(BLANK(),{ forWho: "self", disabilities: ["physical"], ageBand: "19to59", ageGroup: "adult", disabilityVerified: "yes", functionalNeeds: ["mobility"], province: "AB", circumstances: ["none"], citizenPR: true, dtc: "yes", situation: ["unableToWork"], income: "low", city: "Edmonton" })});
for(let i=0;i<3;i++){await p.evaluate(()=>setState("results"));await p.evaluate(()=>setState("detail",{detailId:"aish"}));await p.evaluate(()=>setState("browse"));}
console.log("after 3 cycles",JSON.stringify(await m()));
for(let i=0;i<20;i++){await p.evaluate(()=>setState("results"));await p.evaluate(()=>setState("detail",{detailId:"aish"}));await p.evaluate(()=>setState("browse"));}
console.log("after 23 cycles",JSON.stringify(await m()));
await p.evaluate(()=>setState("results"));console.log("on results",JSON.stringify(await m()));
await b.close()})();
