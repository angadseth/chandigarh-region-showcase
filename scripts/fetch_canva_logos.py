"""Grab every logo image from the shared Canva 'HOUSES LOGOS' design (view link).

Usage: python -I scripts/fetch_canva_logos.py
Saves each distinct image Canva loads into research/logos-raw/<n>.<ext>, plus a full-page shot.
"""
import pathlib

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "research" / "logos-raw"
OUT.mkdir(parents=True, exist_ok=True)
URL = "https://www.canva.com/design/DAGzV2jf1Jk/Zr8qK8CfwC_Ll76d554Avg/view"

seen = {}


def on_response(resp):
    u = resp.url
    if "image-resize" in u or "/media/" in u:
        try:
            body = resp.body()
        except Exception:
            return
        key = u.split("uri:")[-1].split("/")[0] if "uri:" in u else u.split("?")[0]
        if len(body) > 5000 and len(body) > len(seen.get(key, b"")):
            seen[key] = body


with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1400, "height": 1000}, device_scale_factor=2)
    page.on("response", on_response)
    page.goto(URL, wait_until="networkidle", timeout=90000)
    page.wait_for_timeout(3000)
    for i in range(10):
        page.screenshot(path=str(OUT / f"page-{i + 1}.png"))
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(2500)
    b.close()

for i, (k, body) in enumerate(seen.items()):
    ext = "png" if body[:4] == b"\x89PNG" else "jpg"
    (OUT / f"img-{i:02d}.{ext}").write_bytes(body)
print(len(seen), "images")
