/* Read-only loader: runs public/data.js + the app.js prefix (helpers, REQS,
   evaluate, STEPS) + evaluateAnswers in a Node vm, the same slice approach used
   by test/confirmed-facts.test.js and the #209 measurement. No browser startup. */
const fs = require("fs"), vm = require("vm"), path = require("path");
function loadEngine(root = path.resolve(__dirname, "../../..")) {
  const app = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
  const ctx = vm.createContext({ console, AbilityFinderState: require(path.join(root, "public/stateManager.js")) });
  vm.runInContext(fs.readFileSync(path.join(root, "public/data.js"), "utf8"), ctx);
  const stepsAt = app.indexOf("/* =============================================================================\n   WIZARD STEPS");
  const stepsEnd = app.indexOf("\n];\n", stepsAt) + 4;
  const visEnd = app.indexOf("const visibleSteps");
  const evalAns = app.slice(app.indexOf("function evaluateAnswers"), app.indexOf("function scenarioAnswerModel"));
  // benefitInResultsScope + benefitProvince (scope fix, d0bbe52) and the province helpers they call.
  const scopeAt = app.indexOf("function benefitInResultsScope");
  const benefitProvince = app.slice(scopeAt, app.indexOf("}", app.indexOf("return null;", app.indexOf("function benefitProvince"))) + 1) + "\n" +
    app.slice(app.indexOf("function benefitIsLocal"), app.indexOf("function benefitSearchText"));
  vm.runInContext(
    app.slice(0, stepsEnd) + "\n" + app.slice(stepsEnd, app.indexOf("\n", visEnd) + 1) + "\n" + evalAns + "\n" + benefitProvince +
      "\nglobalThis.__ = { REQS, BENEFITS, STEPS, CITIES_BY_PROVINCE, BENEFIT_VALUES, BENEFIT_META, evaluate, evaluateAnswers, priorityScore, benefitProvince, benefitInResultsScope, browseCatalog," +
      " visibleSteps, setAnswers: (a) => { answers = a; }, getAnswers: () => answers };",
    ctx,
  );
  // line numbers of each REQS key
  const lines = app.split("\n");
  const reqLine = {};
  const reqStart = lines.findIndex((l) => l.startsWith("const REQS = {"));
  for (let i = reqStart; i < lines.length && !(i > reqStart && lines[i] === "};"); i++) {
    const m = /^  ([A-Za-z0-9_]+): \{/.exec(lines[i]);
    if (m && !reqLine[m[1]]) reqLine[m[1]] = i + 1;
  }
  return { ...ctx.__, reqLine };
}
module.exports = { loadEngine };
