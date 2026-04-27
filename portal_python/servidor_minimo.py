"""
Alternativa SEM instalar pacotes: apenas biblioteca padrao do Python.
Uso: python servidor_minimo.py
Abre: http://127.0.0.1:8765/
"""

from __future__ import annotations

import http.server
import socketserver
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "smartia-portal-offline.html"
PORT = 8765


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:  # noqa: N802
        if self.path in ("/", "/index.html"):
            if not HTML.is_file():
                self.send_error(500, "smartia-portal-offline.html nao encontrado")
                return
            data = HTML.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        return super().do_GET()


def main() -> None:
    with ReusableTCPServer(("127.0.0.1", PORT), Handler) as httpd:
        url = f"http://127.0.0.1:{PORT}/"
        print(f"SmartIA (Python stdlib) em {url}")
        print("Ctrl+C para parar.")
        try:
            webbrowser.open(url)
        except OSError:
            pass
        httpd.serve_forever()


if __name__ == "__main__":
    main()
