#!/usr/bin/env python3
"""Tiny static server that disables caching, so the browser always gets the
latest files (no more stale/blank pages during development).

Serves ./public — the same directory Cloudflare deploys. It does NOT serve
/api/ask; for the assistant, run `npx wrangler dev` instead.
"""
import functools
import http.server
import socketserver
from pathlib import Path

PORT = 8731
ROOT = Path(__file__).parent / "public"


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
handler = functools.partial(NoCacheHandler, directory=str(ROOT))
with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"AbilityFinder running at http://localhost:{PORT}  (serving {ROOT.name}/)")
    httpd.serve_forever()
