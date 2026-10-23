"""Screenshot the local site section by section, desktop and phone.

Usage: python -I scripts/shoot.py [url] [outdir]
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8800/"
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else "research/shots")
OUT.mkdir(parents=True, exist_ok=True)
SECTIONS = ["hero", "story", "meetups", "spotlight", "nights", "map", "houses", "gallery"]

with sync_playwright() as p:
    b = p.chromium.launch()
    for name, vp, mobile in [("desk", {"width": 1440, "height": 900}, False), ("phone", {"width": 390, "height": 844}, True)]:
        page = b.new_page(viewport=vp, device_scale_factor=1, is_mobile=mobile, has_touch=mobile)
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: m.type == "error" and errors.append(m.text))
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(4200)
        page.screenshot(path=str(OUT / f"{name}-0-hero.png"))
        for i, sec in enumerate(SECTIONS[1:], 1):
            page.evaluate(f"document.getElementById('{sec}').scrollIntoView()")
            page.wait_for_timeout(500)
            # walk the section so scroll-triggered reveals fire
            page.mouse.wheel(0, 300)
            page.wait_for_timeout(1500)
            page.screenshot(path=str(OUT / f"{name}-{i}-{sec}.png"))
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1800)
        page.screenshot(path=str(OUT / f"{name}-9-footer.png"))
        overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
        print(name, "errors:", errors, "x-overflow:", overflow)
        page.close()
    b.close()
