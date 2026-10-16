const { chromium, webkit } = require("/Users/abdulaziz/Claude Random Apps/.taskview-worktrees/oct-resume/node_modules/@playwright/test");
(async()=>{for (const eng of [chromium]){const b=await eng.launch();const p=await b.newPage();
await p.goto("http://127.0.0.1:8799/");await p.waitForFunction(()=>history.state!==null);
await p.evaluate(()=>{answers=BLANK();setState("wizard",{stepIndex:0})});await p.waitForTimeout(500);
console.log(await p.evaluate(()=>[...document.querySelectorAll(".wizard-card input")].map(i=>i.type+":"+i.name).slice(0,4).join(" ")));
await p.locator(".wizard-card input").first().focus();
await p.keyboard.press("ArrowDown");await p.waitForTimeout(700);
console.log("after ArrowDown: step",await p.evaluate(()=>stepIndex),"forWho",await p.evaluate(()=>answers.forWho), "focus", await p.evaluate(()=>document.activeElement.id));
await b.close()}})();
