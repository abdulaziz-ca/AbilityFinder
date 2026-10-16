const { chromium } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
const B="http://127.0.0.1:8799";
const prof={ forWho: "self", disabilities: ["physical", "mental"], ageBand: "19to59", ageGroup: "adult", disabilityVerified: "yes", functionalNeeds: ["mobility"], province: "AB", circumstances: ["none"], citizenPR: true, dtc: "yes", situation: ["unableToWork"], income: "low", city: "Edmonton" };
(async()=>{const b=await chromium.launch();
for (const rm of ["no-preference","reduce"]) {
const p=await b.newPage({viewport:{width:320,height:256},reducedMotion:rm});
await p.goto(B+"/");await p.waitForFunction(()=>history.state!==null);
const ov=()=>p.evaluate(()=>{const w=document.documentElement.clientWidth;const offenders=[...document.querySelectorAll("#app *, .nav *")].filter(e=>{const r=e.getBoundingClientRect();return r.right>w+1&&r.width>0&&getComputedStyle(e).position!=="fixed"}).filter(e=>!e.closest(".tier-scroll")).slice(0,6).map(e=>e.tagName+"."+e.className.toString().split(" ")[0]+" r="+Math.round(e.getBoundingClientRect().right));return {scrollW:document.documentElement.scrollWidth,w,offenders,hiddenReveal:[...document.querySelectorAll("#app *")].filter(e=>getComputedStyle(e).opacity==="0"&&e.textContent.trim()).length,anims:document.getAnimations().length}});
const out={landing:await ov()};
await p.evaluate((m)=>{answers=Object.assign(BLANK(),m);setState("results")},prof);await p.waitForTimeout(700);out.results=await ov();
await p.evaluate(()=>setState("detail",{detailId:"aish"}));await p.waitForTimeout(500);out.detail=await ov();
await p.evaluate(()=>{answers=BLANK();setState("wizard",{stepIndex:0})});await p.waitForTimeout(500);out.wizard=await ov();
// fixed overlays coverage at 320x256
out.fixed=await p.evaluate(()=>[...document.querySelectorAll("body *")].filter(e=>["fixed","sticky"].includes(getComputedStyle(e).position)&&e.getBoundingClientRect().height>0).map(e=>e.className.toString().split(" ")[0]+" "+Math.round(e.getBoundingClientRect().width)+"x"+Math.round(e.getBoundingClientRect().height)));
await p.screenshot({path:`reflow-wizard-${rm}.png`});
await p.goto(B+"/guides/aish.html");out.guide=await ov();
console.log(rm, JSON.stringify(out));await p.close();}
await b.close()})();
