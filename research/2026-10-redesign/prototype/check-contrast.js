// Contrast check for the prototype tokens (WCAG 2.x relative luminance). Alpha tints are
// composited over the surface they sit on.
const fs = require("fs");
const css = fs.readFileSync(__dirname + "/index.html", "utf8");
const block = (sel) => Object.fromEntries([...css.split(sel)[1].split("}")[0].matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const hex = (h) => { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const parse = (c, under) => { if (c.startsWith("#")) return hex(c); const m = c.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/); const a = +m[4]; const u = hex(under); return [1, 2, 3].map((i, k) => Math.round(+m[i] * a + u[k] * (1 - a))); };
const lum = (rgb) => { const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
let fail = 0;
for (const [name, sel] of [["dark", ':root, [data-theme="dark"] {'], ["light", '[data-theme="light"] {']]) {
  const t = block(sel);
  const checks = [
    ["text on bg", "text", "bg", 7], ["text on surface", "text", "surface", 7], ["text on surface-2", "text", "surface-2", 7],
    ["text-2 on bg", "text-2", "bg", 4.5], ["text-2 on surface", "text-2", "surface", 4.5], ["text-2 on surface-2", "text-2", "surface-2", 4.5],
    ["accent link on bg", "accent", "bg", 4.5], ["accent link on surface", "accent", "surface", 4.5],
    ["button text on accent-strong", "on-accent", "accent-strong", 4.5],
    ["edge on bg (controls)", "edge", "bg", 3], ["edge on surface (controls)", "edge", "surface", 3],
    ["focus on bg", "focus", "bg", 3], ["focus on surface", "focus", "surface", 3],
    ["ready on its tint", "ready", "ready-bg", 4.5], ["check on its tint", "check", "check-bg", 4.5], ["not-now on its tint", "notnow", "notnow-bg", 4.5],
  ];
  for (const [label, fg, bg, min] of checks) {
    const under = t.surface; const B = parse(t[bg], under); const F = parse(t[fg], under);
    const r = ratio(F, B); const ok = r >= min; if (!ok) fail++;
    console.log(`${name.padEnd(5)} ${ok ? "ok  " : "FAIL"} ${label.padEnd(30)} ${r.toFixed(2)} (min ${min})`);
  }
}
process.exit(fail ? 1 : 0);
