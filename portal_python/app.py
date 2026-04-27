"""
SmartIA — servidor web em Python (Flask).
Serve o arquivo smartia-portal-offline.html da pasta pai (raiz do projeto SmartIA).
"""

from __future__ import annotations

from pathlib import Path

from flask import Flask, Response, abort, send_from_directory

# Raiz: portal_python/ | Pai: SmartIA/
APP_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = APP_DIR.parent
OFFLINE_HTML = PROJECT_ROOT / "smartia-portal-offline.html"
PUBLIC_DIR = PROJECT_ROOT / "public"

app = Flask(__name__)


def _read_offline_html() -> str:
    if not OFFLINE_HTML.is_file():
        raise FileNotFoundError(
            f"Arquivo nao encontrado: {OFFLINE_HTML}. "
            "Mantenha smartia-portal-offline.html na pasta SmartIA."
        )
    return OFFLINE_HTML.read_text(encoding="utf-8")


@app.get("/")
def index() -> Response:
    """Pagina principal do portal (offline)."""
    try:
        html = _read_offline_html()
    except FileNotFoundError as e:
        abort(500, description=str(e))
    return Response(html, mimetype="text/html; charset=utf-8")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "portal": "smartia"}


@app.get("/public/<path:filename>")
def public_files(filename: str):
    """favicon.svg e outros arquivos em /public, se existirem."""
    if not PUBLIC_DIR.is_dir():
        abort(404)
    return send_from_directory(PUBLIC_DIR, filename)


if __name__ == "__main__":
    # Mesma porta usada nos scripts .bat do projeto (8765)
    app.run(host="127.0.0.1", port=8765, debug=False)
