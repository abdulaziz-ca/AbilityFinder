// Static guide pages: apply the visitor's theme and display settings before
// first paint, the same way the app does (site audit 2026-10, D-ENGINEERING
// P2-5). Guides used to always render dark and ignore text size and contrast.
// External file so the strict CSP (script-src 'self') holds. Read-only: it
// never writes state.
// DESIGN_V2 must match theme-init.js (test/design-v2.test.js checks this).
var DESIGN_V2 = true;
(function () {
  var root = document.documentElement;
  if (DESIGN_V2) { root.classList.add("v2"); root.setAttribute("data-view", "guide"); }
  var light = !DESIGN_V2 && window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches;
  root.setAttribute("data-theme", light ? "light" : "dark");
  if (!window.AbilityFinderDB) return;
  window.AbilityFinderDB.loadState({}).then(function (state) {
    var ui = (state && state.ui) || {};
    if (ui.theme === "light" || ui.theme === "dark") root.setAttribute("data-theme", ui.theme);
    var a = ui.a11y || {};
    if (typeof a.fontScale === "number" && a.fontScale >= 0.9 && a.fontScale <= 1.6) {
      root.style.fontSize = Math.round(16 * a.fontScale) + "px";
    }
    var classes = { spacing: "a11y-spacing", contrast: "a11y-contrast", links: "a11y-links", motion: "a11y-nomotion" };
    function apply() {
      Object.keys(classes).forEach(function (key) {
        if (a[key] === true) document.body.classList.add(classes[key]);
      });
    }
    if (document.body) apply();
    else document.addEventListener("DOMContentLoaded", apply, { once: true });
  }).catch(function () {});
})();
