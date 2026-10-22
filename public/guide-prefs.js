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

// Design v2: an "On this page" list beside the guide, built from its section headings,
// with the current section marked while scrolling. The page reads fine without it.
(function () {
  if (!DESIGN_V2) return;
  function build() {
    var main = document.querySelector(".detail-main"), side = document.querySelector(".detail-side");
    if (!main || !side || side.querySelector(".v2-toc")) return;
    var heads = Array.prototype.slice.call(main.querySelectorAll(".guide-block > .guide-h"));
    if (heads.length < 3) return;
    var fr = (document.documentElement.lang || "").indexOf("fr") === 0;
    var nav = document.createElement("nav");
    nav.className = "v2-toc";
    nav.setAttribute("aria-label", fr ? "Sur cette page" : "On this page");
    var html = "<p>" + (fr ? "Sur cette page" : "On this page") + "</p><ol>";
    heads.forEach(function (h, i) {
      if (!h.id) { var id = "af-guide-sec-" + (i + 1), n = 1; while (document.getElementById(id)) id = "af-guide-sec-" + (i + 1) + "-" + (++n); h.id = id; }
      html += '<li><a href="#' + h.id + '">' + h.textContent.trim().replace(/[<>&]/g, "") + "</a></li>";
    });
    nav.innerHTML = html + "</ol>";
    var apply = side.querySelector(".side-card .guide-list a");
    if (apply) {
      var a = document.createElement("a");
      a.className = "v2-toc-apply"; a.href = apply.href; a.textContent = apply.textContent;
      nav.appendChild(a);
    }
    side.appendChild(nav);
    // Current section = the last heading above the reading line.
    var links = nav.querySelectorAll("ol a"), queued = false;
    // A link moves keyboard focus to its section too, not only the scroll position.
    Array.prototype.forEach.call(links, function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var h = heads[i];
        h.scrollIntoView({ block: "start" });
        if (history.replaceState) history.replaceState(null, "", "#" + h.id);
        h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true });
      });
    });
    function mark() {
      queued = false;
      var cur = 0;
      for (var i = 0; i < heads.length; i++) if (heads[i].getBoundingClientRect().top <= 140) cur = i;
      for (var k = 0; k < links.length; k++) {
        if (k === cur) links[k].setAttribute("aria-current", "true"); else links[k].removeAttribute("aria-current");
      }
    }
    window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(mark); } }, { passive: true });
    mark();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build, { once: true });
  else build();
})();
