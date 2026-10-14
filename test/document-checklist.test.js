"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync("public/app.js", "utf8");
const ctx = vm.createContext({});
vm.runInContext(source.slice(source.indexOf("function buildDocumentChecklist("), source.indexOf("function renderDocumentChecklist(")), ctx);
const build = entries => JSON.parse(JSON.stringify(ctx.buildDocumentChecklist(entries)));
vm.runInContext(source.slice(source.indexOf("function renderDocumentChecklist("), source.indexOf("function actionPlanBenefits(")), ctx);
ctx.reqEscape = text => text;
const benefit = (name, documents, status = "ready") => ({ b: { name, detail: { documents } }, r: { status } });

test("checklist preserves verbatim text and groups only case/whitespace/trailing punctuation duplicates", () => {
  const entries = [benefit("B", ["  Photo  identification.  ", "Notice of Assessment", "Your most recent tax return filed"]), benefit("A", ["PHOTO identification!", "Notice of Assessment.", "Medical form (signed)"]), benefit("C", ["Photo identification", "Medical form signed"], "almost")];
  const original = JSON.stringify(entries);
  const result = build(entries);
  assert.equal(JSON.stringify(entries), original, "pure: input unchanged");
  assert.deepEqual(result[0], { text: "  Photo  identification.  ", programs: ["A", "B", "C"] });
  assert.deepEqual(result[1], { text: "Notice of Assessment", programs: ["A", "B"] });
  assert.equal(result.length, 5, "similar medical-form items remain distinct; tax return is not assessment");
  assert.ok(result.some(e => e.text === "Your most recent tax return filed"));
});

test("no programs excluded, duplicate bullets count once per program, missing lists ignored", () => {
  assert.deepEqual(build([benefit("No", ["Secret document"], "no"), benefit("Almost", ["ID", "id."], "almost"), { b: { name: "Empty" }, r: { status: "ready" } }, benefit("Blank", ["", "   ", null])]), [{ text: "ID", programs: ["Almost"] }]);
  assert.deepEqual(build([]), []);
});

test("shared rendering preserves order and hides singles with zero, one and many count wording", () => {
  for (const n of [0, 1, 3]) {
    const entries = build([benefit("A", ["Shared", ...Array.from({ length: n }, (_, i) => `Private ${i}`)]), benefit("B", ["Shared"])]);
    const original = JSON.stringify(entries);
    const split = ctx.splitDocumentChecklist(entries);
    assert.equal(split.shared.length, 1);
    assert.equal(split.single.length, n);
    const html = ctx.renderDocumentChecklist(entries);
    assert.match(html, /Needed for: A, B/);
    assert.ok(!html.includes("Private"));
    assert.equal(JSON.stringify(entries), original);
    if (!n) assert.ok(!html.includes("more document"));
    else assert.ok(html.includes(`${n === 1 ? "1 more document is" : `${n} more documents are each`} needed by only one program. You'll find them on that program's card and guide.`));
  }
  const html = ctx.renderDocumentChecklist(build([benefit("A", ["Private"])]));
  assert.ok(!html.includes("<ul") && !html.includes("Private") && !html.includes("Taken from"));
});

test("sorts by distinct program count first, then English alphabetical item text", () => {
  assert.deepEqual(build([benefit("A", ["Zebra", "Beta", "Alpha"]), benefit("B", ["Zebra", "Beta"], "almost")]).map(e => e.text), ["Beta", "Zebra", "Alpha"]);
});
