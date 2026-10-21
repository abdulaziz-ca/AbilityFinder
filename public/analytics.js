/* Cloudflare Web Analytics (owner decision 2026-10-20): cookieless visit and page-view
   counts, used to see how the site is doing once marketing starts. Loaded only on the
   real site, so tests and local previews never add fake visits. It never reads or sends
   questionnaire answers; the privacy page describes what it records. */
(function () {
  if (location.hostname !== "abilityfinder.ca" && location.hostname !== "www.abilityfinder.ca") return;
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: "__CF_WA_TOKEN__" }));
  document.head.appendChild(s);
})();
