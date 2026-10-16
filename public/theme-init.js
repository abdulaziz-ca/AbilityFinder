// Independent boot guard: still works if app.js never loads or parses.
(function () {
  var finished = false;
  var failed = false;
  var timer = setTimeout(fail, 10000);
  function fail() {
    if (finished) return;
    var app = document.getElementById("app");
    if (!app) { document.addEventListener("DOMContentLoaded", fail, { once: true }); return; }
    failed = true;
    clearTimeout(timer);
    app.innerHTML = '<section class="startup-error" role="alert"><h1>AbilityFinder did not finish loading</h1><p>Please reload to try again. You can also read the program guides.</p><button type="button" class="btn btn-primary" id="startupReload">Reload</button><p><a class="source-link" href="/guides/">Browse program guides</a></p></section>';
    document.getElementById("startupReload").addEventListener("click", function () { window.location.reload(); });
  }
  window.AbilityFinderStartup = {
    fail: fail,
    ready: function () { finished = true; clearTimeout(timer); },
  };
  window.addEventListener("error", function (event) {
    if (finished || failed) return;
    if (event.target !== window && event.target?.tagName !== "SCRIPT") return;
    if (event.target && event.target.tagName === "SCRIPT" && /changelog\.js/.test(event.target.src)) return;
    fail();
  }, true);
  window.addEventListener("unhandledrejection", function () { if (!finished && !failed) fail(); });
})();

// Set the theme before first paint to avoid a flash. Kept as an external file
// (not an inline <script>) so the site can ship a strict Content-Security-Policy
// with script-src 'self' — see _headers.
(function () {
  var fallback = window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", fallback);
  // IndexedDB is asynchronous, unlike the legacy localStorage theme read. Set
  // the system preference immediately, then replace it as soon as the manager
  // recovers a saved theme. app.js performs the authoritative restore at boot.
  if (window.AbilityFinderDB) {
    window.AbilityFinderDB.loadState({}).then(function (state) {
      var saved = state && state.ui && state.ui.theme;
      if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    });
  }
})();
