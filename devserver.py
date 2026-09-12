#!/usr/bin/env python3
"""Local dev server with caching disabled, so browser tabs always see the latest edit."""
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8743


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    http.server.test(HandlerClass=NoCacheHandler, port=PORT)
