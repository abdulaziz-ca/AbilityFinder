/* Dependency-free static server for the app e2e projects.

   Replaces `python3 -m http.server`, whose listen backlog of 5 overflowed when
   several workers each opened 14+ parallel connections: requests were dropped
   or retried after 1 s, 3 s, ..., which surfaced as timeouts and as
   "BENEFITS is not defined" when data.js never arrived (site audit 2026-10,
   D-ENGINEERING.md P2-6). Behaviour otherwise matches http.server: a directory
   serves its index.html, a directory without a trailing slash redirects, and
   anything missing is a 404. No caching headers, no _headers processing (the
   worker projects run wrangler for that).

   Usage: node e2e/static-server.js <root> <port> */
"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || "public");
const port = Number(process.argv[3] || 8766);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".json": "application/json",
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname); }
  catch { return send(res, 400, {}, "Bad request"); }
  let file = path.join(root, pathname);
  if (file !== root && !file.startsWith(root + path.sep)) return send(res, 403, {}, "Forbidden");
  fs.stat(file, (err, stat) => {
    if (!err && stat.isDirectory()) {
      if (!pathname.endsWith("/")) return send(res, 301, { Location: pathname + "/" }, "");
      file = path.join(file, "index.html");
    }
    fs.readFile(file, (readErr, data) => {
      if (readErr) return send(res, 404, { "Content-Type": "text/plain" }, "Not found");
      const headers = { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Content-Length": data.length };
      send(res, 200, headers, req.method === "HEAD" ? undefined : data);
    });
  });
});
server.listen(port, "127.0.0.1", 511, () => console.log(`static server on http://127.0.0.1:${port} (${root})`));
