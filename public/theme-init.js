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
