// Set the theme before first paint to avoid a flash. Kept as an external file
// (not an inline <script>) so the site can ship a strict Content-Security-Policy
// with script-src 'self' — see _headers.
(function () {
  try {
    var th = localStorage.getItem("abilityfinder.theme");
    if (th !== "light" && th !== "dark")
      th = window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", th);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
