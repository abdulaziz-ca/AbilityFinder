const { chromium } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto("http://127.0.0.1:8799/");await p.waitForFunction(()=>history.state!==null);
const live=[];await p.exposeFunction("__rec",(s)=>live.push(s));
await p.evaluate(()=>{for(const id of ["routeLive","askLive"]){const el=document.getElementById(id);new MutationObserver(()=>window.__rec(id+": "+el.textContent)).observe(el,{childList:true,characterData:true,subtree:true})}
 new MutationObserver((ms)=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){const l=n.matches?.("[aria-live],[role=status],[role=alert]")?[n]:[...n.querySelectorAll?.("[aria-live],[role=status],[role=alert]")||[]];l.forEach(x=>window.__rec("new live region: "+(x.id||x.className)+" '"+x.textContent.trim().slice(0,60)+"'"))}}).observe(document.getElementById("app"),{childList:true,subtree:true})});
const act=()=>p.evaluate(()=>{const a=document.activeElement;return a?(a.id||a.tagName+"."+a.className.toString().split(" ")[0])+" '"+(a.textContent||a.value||"").trim().slice(0,40)+"'":null});
await p.getByRole("button",{name:/Find my benefits/}).first().click();await p.waitForTimeout(600);
console.log("after start:",await act());
// step 1 forWho: pick first option via keyboard
const first=p.locator(".wizard-card input").first();await first.focus();await p.keyboard.press("Space");await p.waitForTimeout(600);
console.log("after picking forWho via Space:",await act(), "step:", await p.evaluate(()=>stepIndex));
// step 2 disabilities multi
await p.waitForTimeout(400);
const cb=p.locator(".wizard-card input[type=checkbox]").nth(1);
if(await cb.count()){await cb.focus();const before=await act();await p.keyboard.press("Space");await p.waitForTimeout(400);console.log("multi-select tick: before",before,"after",await act(), "checked", await p.locator(".wizard-card input[type=checkbox]").nth(1).isChecked());
 await p.keyboard.press("Tab");console.log("next Tab goes to:",await act());}
console.log("LIVE EVENTS:",JSON.stringify(live,null,1));
await b.close()})();
